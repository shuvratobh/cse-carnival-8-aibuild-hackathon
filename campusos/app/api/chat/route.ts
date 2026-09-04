// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Use a global prisma instance for Next.js to prevent connection exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-flash-latest'),
    messages: modelMessages,
    system: `You are the CampusOS AI Agent, an intelligent assistant for university students.
You have access to live database tools to lookup schedules, rooms, events, announcements, and assignments.
Always use the tools to fetch real data before answering. Do not guess.
If a user asks to perform an action (e.g. book a room, register for an event), use the corresponding tool.
Present data cleanly and concisely. If a user asks for something you can't do, politely say no.
The university week runs Sunday-Thursday (Friday-Saturday are weekends). All times are 24h format.`,
    tools: {
      lookupSchedule: tool({
        description: 'Get class schedules by day or course code',
        parameters: z.object({
          day: z.string().optional().describe('Day of the week (e.g., Monday, Tuesday)'),
          course: z.string().optional().describe('Course code (e.g., CSE 4113)'),
        }),
        execute: async ({ day, course }: { day?: string; course?: string }) => {
          const where: any = {};
          if (day) where.day = { contains: day };
          if (course) where.course = { contains: course };
          return await prisma.schedule.findMany({ where });
        },
      }),
      lookupRooms: tool({
        description: 'Find rooms by capacity, equipment, or availability',
        parameters: z.object({
          minCapacity: z.number().optional().describe('Minimum capacity required'),
          equipment: z.string().optional().describe('Required equipment (e.g., projector, AC)'),
        }),
        execute: async ({ minCapacity, equipment }: { minCapacity?: number; equipment?: string }) => {
          const rooms = await prisma.room.findMany({ include: { bookings: true } });
          return rooms.filter((r: any) => {
            let pass = true;
            if (minCapacity && r.capacity < minCapacity) pass = false;
            if (equipment && !r.equipment.includes(equipment)) pass = false;
            return pass;
          });
        },
      }),
      lookupEvents: tool({
        description: 'Get upcoming events or filter by name',
        parameters: z.object({
          status: z.string().optional().describe('Status (upcoming, ongoing, completed)'),
        }),
        execute: async ({ status }: { status?: string }) => {
          const where: any = {};
          if (status) where.status = status;
          return await prisma.event.findMany({ where });
        },
      }),
      lookupAnnouncements: tool({
        description: 'Get active announcements, optionally filtered by priority',
        parameters: z.object({
          priority: z.string().optional().describe('Priority (high, medium, low)'),
        }),
        execute: async ({ priority }: { priority?: string }) => {
          const where: any = {};
          if (priority) where.priority = priority;
          return await prisma.announcement.findMany({ where, orderBy: { date: 'desc' } });
        },
      }),
      lookupAssignments: tool({
        description: 'Get pending or completed assignments',
        parameters: z.object({
          status: z.string().optional().describe('Status (pending, submitted, late)'),
        }),
        execute: async ({ status }: { status?: string }) => {
          const where: any = {};
          if (status) where.status = status;
          return await prisma.assignment.findMany({ where, orderBy: { deadline: 'asc' } });
        },
      }),
      bookRoom: tool({
        description: 'Book a room for a specific time and date',
        parameters: z.object({
          roomNumber: z.string().describe('Room number to book (e.g., 7A03)'),
          date: z.string().describe('Date in YYYY-MM-DD format'),
          startTime: z.string().describe('Start time in HH:MM format'),
          endTime: z.string().describe('End time in HH:MM format'),
          purpose: z.string().describe('Purpose of booking'),
        }),
        execute: async ({ roomNumber, date, startTime, endTime, purpose }: { roomNumber: string; date: string; startTime: string; endTime: string; purpose: string }) => {
          const room = await prisma.room.findUnique({ where: { room_number: roomNumber } });
          if (!room) return { error: `Room ${roomNumber} not found.` };
          
          // Simplified clash check for hackathon (normally requires more logic)
          const newBookingId = `bk-${Math.random().toString(36).substring(2, 9)}`;
          await prisma.booking.create({
            data: {
              booking_id: newBookingId,
              room_id: room.id,
              booked_by: 'Student (Via AI)',
              date,
              start_time: startTime,
              end_time: endTime,
              purpose,
            }
          });
          return { success: true, message: `Room ${roomNumber} successfully booked.` };
        },
      }),
      registerEvent: tool({
        description: 'Register a student for an event',
        parameters: z.object({
          eventName: z.string().describe('Name of the event to register for'),
        }),
        execute: async ({ eventName }: { eventName: string }) => {
          const event = await prisma.event.findFirst({ where: { name: { contains: eventName } } });
          if (!event) return { error: `Event ${eventName} not found.` };
          if (event.registered >= event.capacity) return { error: 'Event is fully booked.' };
          
          await prisma.registration.create({
            data: {
              student_id: 'user-001', // Mock student ID
              event_id: event.id,
              name: 'Current User',
            }
          });
          
          // Increment registered count
          await prisma.event.update({
            where: { id: event.id },
            data: { registered: event.registered + 1 }
          });
          
          return { success: true, message: `Successfully registered for ${event.name}.` };
        }
      })
    },
  });

  return result.toUIMessageStreamResponse();
}
