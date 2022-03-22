
export async function seedUtilNoData(getList, model) {
  async function saveOnePage(pageNum) {
    return await getList(pageNum, '1000').then(async (list) => {
      const payload = await model.createMany({
        data: list,
        skipDuplicates: true,
      });

      if (list.length) {
        console.log(list[0]?.id || list[0]);
      }

      console.log('page ' + pageNum + ' done with ' + payload.count + ' items');

      return {
        payload,
        finished: list.length === 0,
      };
    });
  }

  let pageNum = 1;
  let { finished } = await saveOnePage(pageNum);
  while (!finished) {
    finished = await (await saveOnePage(++pageNum)).finished;
  }
}
