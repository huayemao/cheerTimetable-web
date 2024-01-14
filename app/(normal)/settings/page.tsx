import { Metadata } from 'next'
import DaysSwitch from './DaysSwitch'

export const metadata: Metadata = {
  title: `设置`,
}

export default function Settings() {
  return (
    <div className="h-full p-2 break-words">
        <DaysSwitch></DaysSwitch>
    </div>
  )
}