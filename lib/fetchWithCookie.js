import { toughCookie } from 'jsdom'
import prisma from './prisma.ts'
import { map } from 'lodash'


function parseCookie(str) {
  return str
    .split(',')
    .map((e) => toughCookie.parse(e).cookieString())
    .join('; ')
}

