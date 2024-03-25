import { H2 } from '@/components/H2'
import { AUTHORS } from 'constants/siteConfig'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `关于绮课`,
}

export default function Component() {
  return (
    <div className="h-full p-2 break-words">
      <H2 simple title={'Github'} slate>
        <p>
          绮课是一个开源软件，代码库：{' '}
          <a
            href="https://github.com/huayemao/cheerTimetable-web"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://github.com/huayemao/cheerTimetable-web
          </a>
        </p>
      </H2>
      <H2 simple title={'QQ 交流群'} slate>
        <p>
          欢迎在 QQ 群组{' '}
          <a
            className="underline"
            href="https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=Lcew_GOBoDdtbtL1D6U5XobhOWuGL-Qh&authKey=EBvha5ApbREU9GgDtL7JVgphjutbnsxi1RkSEUPCbLsAvQ6Oir9ZkwGOL0OS7fEY&noverify=0&group_code=1157682866"
          >
            1157682866
          </a>{' '}
          里交流绮课的功能
        </p>
      </H2>
      <H2 simple title={'关于作者'} slate>
        <p>
          绮课由{' '}
          <a className="text-primary-500" href={AUTHORS[0].url}>
            {AUTHORS[0].name}&nbsp;
          </a>{' 与 '}
          <a className="text-primary-500" href={AUTHORS[1].url}>
            {AUTHORS[1].name}&nbsp;
          </a>{' '}
          开发和维护，欢迎联系
        </p>
      </H2>
    </div>
  )
}
