import prisma from '@/lib/prisma';
import groupBy from 'lodash/groupBy';

export async function getProfessions() {
  const res = await prisma.student.findMany({
    select: {
      facultyName: true,
      professionName: true,
    },
    distinct: ['facultyName', 'professionName'],
  });

  const data = groupBy(res, 'facultyName');
  return data;
}
