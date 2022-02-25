import React, { useEffect, useRef, useCallback } from 'react'
import useBodyScrollLock from '../../lib/hooks/useBodyScrollLock'
import s from './Modal.module.css'
export default function Modal({
  children,
  title,
  onClose = console.log,
  showCloseButton = true,
}) {
  useBodyScrollLock()

  const ref = useRef()

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        return onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    const modal = ref.current

    if (modal) {
      window.addEventListener('keydown', handleKey)
    }
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleKey])
  return (
    <div>
      <div className={s.root}>
        <div className={s.modal} role="dialog" ref={ref}>
          <div className="relative rounded-lg bg-white shadow">
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between rounded-t border-b p-5">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    onClick={(e) => onClose()}
                    aria-label="Close panel"
                    className={s.close}
                    type="button"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            )}
            <div className="space-y-6 p-6">
              <p className="text-base leading-relaxed text-gray-500">
                {children}
              </p>
            </div>
            {/* <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                I accept
              </button>
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Decline
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
