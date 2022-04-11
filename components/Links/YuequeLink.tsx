import Image from 'next/image'

export function YuqueLink() {
  return (
    <a
      className="inline-flex items-center"
      href="https://www.yuque.com/huayemao/cheer-timetable/overview"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mr-2 h-6 w-6 align-middle">
        <YuqueIcon />
      </div>
      关于
    </a>
  )
}

export function YuqueIcon() {
  return (
    <Image
      width={'24'}
      height={'24'}
      alt="关于"
      loading="lazy"
      data-testid="img-avatar"
      src="https://gw.alipayobjects.com/zos/rmsportal/UTjFYEzMSYVwzxIGVhMu.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_48%2Ch_48%2Fformat%2Cpng"
    />
  )
}
