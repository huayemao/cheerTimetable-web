import prisma from '../lib/prisma'

export const COURSES = (async () => await prisma.courseMeta.findMany({}))()
export const STUDENTS = (async () =>
  await await prisma.studentMeta.findMany({}))()
export const LOCATIONS = (async () => await prisma.locationMeta.findMany({}))()
export const TEACHERS = (async () => await prisma.teacherMeta.findMany({}))()
