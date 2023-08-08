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

export async function getProfession(name:string){
  const res:{
    facultyName: string;
    professionName: string;
    grade: string;
    studentCount?:number
}[] = await prisma.student.findMany({
    select: {
      facultyName: true,
      professionName: true,
      grade:true,
    },
    where:{
      facultyName:name.trim(),
    },
    distinct: ['professionName','grade'],
  });

  const countRes= await prisma.student.groupBy({
    by:['professionName','grade'],
    _count:true,
    where:{
      facultyName:name.trim(),
    },
  })

  for (const item of countRes) {
    res.find(e=>e.professionName === item.professionName &&e.grade===item.grade)!.studentCount = item._count
  }
  return res
}
