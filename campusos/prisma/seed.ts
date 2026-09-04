import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Paths to JSON files (up one directory from campusos/ to data/)
  const dataDir = path.join(__dirname, '../../data');

  // 1. Seed Schedules
  const schedulesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'schedules.json'), 'utf-8'));
  for (const item of schedulesData) {
    await prisma.schedule.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        course: item.course,
        title: item.title,
        day: item.day,
        start_time: item.start_time,
        end_time: item.end_time,
        room: item.room,
        instructor: item.instructor,
        section: item.section,
      },
    });
  }
  console.log('✓ Seeded schedules');

  // 2. Seed Rooms & Bookings
  const roomsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'rooms.json'), 'utf-8'));
  for (const item of roomsData) {
    const { bookings, equipment, ...roomData } = item;
    await prisma.room.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...roomData,
        equipment: JSON.stringify(equipment || []), // Convert array to string
        bookings: {
          create: bookings?.map((b: any) => ({
            booking_id: b.booking_id,
            booked_by: b.booked_by,
            date: b.date,
            start_time: b.start_time,
            end_time: b.end_time,
            purpose: b.purpose,
          })) || [],
        },
      },
    });
  }
  console.log('✓ Seeded rooms and bookings');

  // 3. Seed Events & Registrations
  const eventsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'events.json'), 'utf-8'));
  for (const item of eventsData) {
    const { registrations, ...eventData } = item;
    await prisma.event.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...eventData,
        registrations: {
          create: registrations?.map((r: any) => ({
            student_id: r.student_id,
            name: r.name,
          })) || [],
        },
      },
    });
  }
  console.log('✓ Seeded events and registrations');

  // 4. Seed Announcements
  const announcementsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'announcements.json'), 'utf-8'));
  for (const item of announcementsData) {
    await prisma.announcement.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item },
    });
  }
  console.log('✓ Seeded announcements');

  // 5. Seed Assignments
  const assignmentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'assignments.json'), 'utf-8'));
  for (const item of assignmentsData) {
    await prisma.assignment.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item },
    });
  }
  console.log('✓ Seeded assignments');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
