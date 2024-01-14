'use client'
import { Switch, SwitchProps } from '@headlessui/react'
import {
  usePreference,
  usePreferenceDispatch
} from 'contexts/preferenceContext'
import React from 'react'

function BaseSwitch(props: SwitchProps<any> & { label: string }) {
  const { checked, onChange, label } = props
  return (
    <div className="flex">
      <span className="mr-auto">{label}</span>
      <Switch
        defaultChecked={checked}
        onChange={onChange}
        className={`${checked ? 'bg-primary-500' : 'bg-primary-200'}
relative inline-flex h-[24px] w-[48px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`${checked ? 'translate-x-6' : 'translate-x-0'}
  pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}

export default function DaysSwitch() {
  const dispatch = usePreferenceDispatch()
  //@ts-ignore
  const { show7DaysOnMobile } = usePreference()
  return (
    <>
      <BaseSwitch
        label='移动端课表展示周一到周日'
        checked={show7DaysOnMobile}
        onChange={(v) => {
          dispatch({
            type: 'SHOW_7_DAYS_ON_MOBILE',
            payload: v,
          })
        }}
      />
    </>
  )
}
