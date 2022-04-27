import { createPopper, Instance, Placement } from '@popperjs/core'
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import classNames from 'clsx'
import useClickOutside from '../../lib/hooks/useClickOutside'

export type TooltipProps = PropsWithChildren<{
  className?: string
  content: ReactNode
  placement?: Placement
  trigger?: 'hover' | 'click'
  style?: 'dark' | 'light' | 'auto'
  animation?: false | `duration-${number}`
  arrow?: boolean
  stilOnClick?: boolean
}>
export const Tooltip: FC<TooltipProps> = ({
  children,
  className,
  content,
  placement = 'top',
  trigger = 'hover',
  style = 'dark',
  animation = 'duration-300',
  arrow = true,
  stilOnClick = false,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const popperInstance = useRef<Instance>()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (wrapperRef.current && tooltipRef.current) {
      popperInstance.current = createPopper(
        wrapperRef.current,
        tooltipRef.current,
        {
          placement,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'arrow',
              options: {
                padding: -5, // 5px from the edges of the popper
              },
            },
            { name: 'eventListeners', enabled: true },
          ],
        }
      )
    }
  }, [placement])
  const show = () => {
    setVisible(true)
    tooltipRef.current?.focus()
    popperInstance.current?.update()
  }
  const hide = () => setTimeout(() => setVisible(false), 100)

  useClickOutside(wrapperRef, (el) => {
    if (!stilOnClick || !tooltipRef.current?.contains(el)) visible && hide()
  })

  return (
    <>
      <div
        data-popper-placement={placement}
        className={classNames(
          'tooltip absolute z-10 inline-block rounded-lg py-2 px-3 text-sm font-medium',
          animation !== false && `transition-opacity ${animation}`,
          {
            'shadow-sm': !className?.includes('shadow'),
            'invisible opacity-0': !visible,
            'bg-gray-900 text-white dark:bg-gray-700': style === 'dark',
            'border border-gray-200 bg-white text-gray-900': style === 'light',
            'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white':
              style === 'auto',
          },
          className
        )}
        ref={tooltipRef}
        role="tooltip"
      >
        {content}
        {arrow && (
          <div
            className={classNames('tooltip-arrow', {
              light: style === 'light',
              auto: style === 'auto',
            })}
            style={{ zIndex: '-1' }}
            data-popper-arrow
          />
        )}
      </div>
      <span
        className="w-fit"
        ref={wrapperRef}
        onFocus={show}
        // onBlur={hide}
        {...(trigger === 'hover'
          ? { onMouseEnter: show, onMouseLeave: hide }
          : { onClick: show })}
      >
        {children}
      </span>
    </>
  )
}
