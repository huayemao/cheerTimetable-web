// 获取学生数据

const date = new Date()

const years = [date.getFullYear()].flatMap((e) =>
  Array.from({ length: 6 }, (el, i) => e - i)
)

const terms = years.map((e) => `${e - 1}-${e}-1`)

const getData = async (term) => {
  const html = await (
    await fetch(
      `https://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_find_xs0101.jsp?xnxq01id=${term}&init=1&isview=0`
    )
  ).text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc
    .querySelector('body > script:nth-child(4)')
    .textContent.match(/\[.*]/)[0]
}

for (let i = 0; i < 6; i++) {
  const data = await getData(terms[i])
  localStorage.setItem(terms[i], JSON.stringify(data, undefined, 0))
  alert('ok')
}
