import fetch from 'node-fetch'
import { BaseURL, HEADERS } from '../util/header'

export async function login4query() {
  console.log('Logging in for query...')
  const res = await fetch(
    `${BaseURL}/kblogin.jsp?f=3&type=jg`,
    {
      headers: HEADERS,
    }
  )
  console.log(await res.text())

}
