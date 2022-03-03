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



// 获取开学时间映射
const getDateMapping = async () => {
  const terms = [
    '2021-2022-2',
    '2021-2022-1',
    '2020-2021-2',
    '2020-2021-1',
    '2019-2020-2',
    '2019-2020-1',
    '2018-2019-2',
    '2018-2019-1',
    '2017-2018-2',
    '2017-2018-1',
    '2016-2017-2',
    '2016-2017-1',
  ]
  const resluts = await Promise.all(
    terms.map(async (term) => {
      const res = await fetch(
        'http://csujwc.its.csu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_WDKB',
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'upgrade-insecure-requests': '1',
          },
          referrer:
            'http://csujwc.its.csu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_WDKB',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `cj0701id=&zc=&demo=&xnxq01id=${term}&sfFD=1`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        }
      )
      const html = await res.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const textContent = doc.querySelector(
        '#kbtable > tbody > tr:nth-child(1) > td:nth-child(1)'
      ).textContent
      return textContent?.split('日')[0]
    })
  )

  const mapping = Object.fromEntries(terms.map((e, i) => [e, resluts[i]]))
  return mapping
}
