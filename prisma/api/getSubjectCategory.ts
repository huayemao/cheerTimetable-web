import { parseHTML } from '../util/parseTable';
import qs from 'qs';
import fetch from 'node-fetch';
import { HEADERS } from '../util/header';

export const getSubjectCategory = async (jx02id, term) => {
  const url = 'http://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_kb.jsp';

  const data = qs.stringify({
    xnxq01id: term,
    jx02id,
    type2: 'jx02',
    pageSize: '2000',
  });

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  };

  const res = await fetch(url, requestOptions);
  const html = await res.text();
  const doc = parseHTML(html);

  return doc.querySelector('font[title=课程类别]')?.textContent.trim();
};
