'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// We create a single prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// --- Schedules ---
export async function getSchedules() {
  return prisma.schedule.findMany()
}
export async function addSchedule(data: any) {
  const newId = `sch-${Math.random().toString(36).substring(2, 9)}`
  await prisma.schedule.create({ data: { id: newId, ...data } })
  revalidatePath('/')
}
export async function updateSchedule(id: string, data: any) {
  await prisma.schedule.update({ where: { id }, data })
  revalidatePath('/')
}
export async function deleteSchedule(id: string) {
  await prisma.schedule.delete({ where: { id } })
  revalidatePath('/')
}

// --- Rooms ---
export async function getRooms() {
  return prisma.room.findMany({ include: { bookings: true } })
}
export async function addRoom(data: any) {
  const newId = `room-${Math.random().toString(36).substring(2, 9)}`
  await prisma.room.create({ data: { id: newId, ...data } })
  revalidatePath('/')
}
export async function updateRoom(id: string, data: any) {
  await prisma.room.update({ where: { id }, data })
  revalidatePath('/')
}
export async function deleteRoom(id: string) {
  await prisma.room.delete({ where: { id } })
  revalidatePath('/')
}

// --- Events ---
export async function getEvents() {
  return prisma.event.findMany({ include: { registrations: true } })
}
export async function addEvent(data: any) {
  const newId = `evt-${Math.random().toString(36).substring(2, 9)}`
  await prisma.event.create({ data: { id: newId, ...data } })
  revalidatePath('/')
}
export async function updateEvent(id: string, data: any) {
  await prisma.event.update({ where: { id }, data })
  revalidatePath('/')
}
export async function deleteEvent(id: string) {
  await prisma.event.delete({ where: { id } })
  revalidatePath('/')
}

// --- Announcements ---
export async function getAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { date: 'desc' } })
}
export async function addAnnouncement(data: any) {
  const newId = `ann-${Math.random().toString(36).substring(2, 9)}`
  await prisma.announcement.create({ data: { id: newId, ...data } })
  revalidatePath('/')
}
export async function updateAnnouncement(id: string, data: any) {
  await prisma.announcement.update({ where: { id }, data })
  revalidatePath('/')
}
export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } })
  revalidatePath('/')
}

// --- Assignments ---
export async function getAssignments() {
  return prisma.assignment.findMany()
}
export async function addAssignment(data: any) {
  const newId = `asgn-${Math.random().toString(36).substring(2, 9)}`
  await prisma.assignment.create({ data: { id: newId, ...data } })
  revalidatePath('/')
}
export async function updateAssignment(id: string, data: any) {
  await prisma.assignment.update({ where: { id }, data })
  revalidatePath('/')
}
export async function deleteAssignment(id: string) {
  await prisma.assignment.delete({ where: { id } })
  revalidatePath('/')
}
