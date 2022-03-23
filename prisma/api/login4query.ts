import fetch from 'node-fetch';
import { HEADERS } from '../util/header';

export async function login4query() {
  await fetch('http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=jg', {
    headers: HEADERS,
  });
}
