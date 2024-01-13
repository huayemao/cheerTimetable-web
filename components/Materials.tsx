'use client'

import { useLayout } from 'contexts/layoutContext'
import React from 'react'

function Materials() {
  const layout = useLayout()

  // todo: 构造出链接，到页面的课程资料位置
  return <div>{layout.user && <a href='#课程资料'>上传材料</a>}</div>
}

export default Materials
