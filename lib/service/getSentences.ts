export async function getSentences() {
  const { data } = await fetch(
    'https://www.yuque.com/api/tables/records?docId=70387138&docType=Doc&limit=2000&offset=0&sheetId=8gc2RfiVFTi1UOGGVxx64YaQyVSkGB2f'
  ).then((e) => e.json());

  const sentences = data.map((e) => {
    const item = JSON.parse(e.data);
    return {
      sentence: item.x7U5s161raUGRnnua7O48CRz81Q1elTK.value,
      nickName: item.GvWvFE2RLxv6dokKTFrPGEOaVXKpm4bT.value,
    };
  });
  return sentences;
}
