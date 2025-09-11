export function getSemestersByGrade(grade, terms, student?: any) {
  // 检查输入参数类型
  // 将两位年级数转换为完整的入学年份和毕业年份
  const startYear = `20${grade}`;
  const isEightYearProgram = student?.professionName?.includes("八年");
  const endYear = `${parseInt(startYear) + (isEightYearProgram ? 8 : 6)}`;

  // 过滤出符合条件的学期
  const filteredSemesters = terms.filter(semester => {
    const [start, end] = semester.split('-').map(Number);
    return start >= startYear && end <= endYear;
  });

  console.log(`${student.professionName} ${student?.name} Start Year: ${startYear}, End Year: ${endYear}, term count: ${filteredSemesters.length}`);

  return filteredSemesters;
}
