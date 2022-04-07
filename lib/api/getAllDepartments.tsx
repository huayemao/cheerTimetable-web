import prisma from 'lib/prisma'

export async function getAllDepartments() {
  const res =
    (await prisma.$queryRaw`SELECT DISTINCT department FROM Subject WHERE tooOld is not true; `) as {
      department: string
    }[]

  return res.map((e) => e.department)
}
