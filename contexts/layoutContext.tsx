'use client'
import React, {
  createContext, Dispatch, useContext, useReducer
} from 'react'

const initialData = {
  title: '绮课',
  terms: [],
}

export const LayoutContext = createContext<typeof initialData>(initialData)
export const LayoutDispatch = createContext<
  Dispatch<{
    type: string
    payload: object
  }>
>(() => {})

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCHEDULE_HEADER': {
      const { payload } = action
      const { data } = payload

      return Object.assign({}, state, data)
    }

    default: {
      throw new Error('Unhandled action type.')
    }
  }
}

const LayoutProvider = ({ children, value }) => {
  const [state, dispatch] = useReducer(reducer, value || initialData)

  return (
    <LayoutContext.Provider value={state}>
      <LayoutDispatch.Provider value={dispatch}>
        {children}
      </LayoutDispatch.Provider>
    </LayoutContext.Provider>
  )
}

export default LayoutProvider

export function useLayout() {
  return useContext(LayoutContext)
}

export function useLayoutDispatch() {
  return useContext(LayoutDispatch)
}
