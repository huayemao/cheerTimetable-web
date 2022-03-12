import { getSubjects } from './getSubjects';
import { seedUtilNoData, prisma } from './seed';


async function seedSubjects() {
  const versions = [
    2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
  ];

  for (const version of versions) {
    await seedUtilNoData(async (...args) => {
      const [pageNum, pageSize] = args;
      return await getSubjects(pageNum, pageSize, version);
    }, prisma.subject);
  }
}
