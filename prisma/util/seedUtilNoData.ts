export function seedUtilNoData(getList, model) {
  return async () => {
    let pageNum = 1
    let { hasMore } = await saveOnePage(pageNum)
    while (hasMore) {
      hasMore = (await saveOnePage(++pageNum)).hasMore
    }

    async function saveOnePage(pageNum) {
      const list = await getList(pageNum, '1000')
      const payload = await model.createMany({
        data: list.filter((e) => e.id), // 确保 id 存在
        skipDuplicates: true,
      })

      console.log('page ' + pageNum + ' done with ' + payload.count + ' items')

      return {
        payload,
        hasMore: list.length,
      }
    }
  }
}
