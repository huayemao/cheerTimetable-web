"use client"
import React, { createContext, useReducer, useContext, useEffect } from 'react'
export const PreferenceContext = createContext({})
export const PreferenceDispatch = createContext()

const initialData = {
  show7DaysOnMobile: false,
  queryTools: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_7_DAYS_ON_MOBILE': {
      const { payload } = action
      return Object.assign({}, state, { show7DaysOnMobile: payload })
    }
    case 'ADD_QUERY_TOOL': {
      const { payload } = action
      return Object.assign({}, state, {
        queryTools: (state.queryTools || []).concat(payload.queryTool),
      })
    }
    case 'REMOVE_QUERY_TOOL': {
      const { payload } = action
      return Object.assign({}, state, {
        queryTools: (state.queryTools || []).filter(
          (e) => e.name !== payload.name
        ),
      })
    }
    default: {
      throw new Error('Unhandled action type.')
    }
  }
}

const PreferenceProvider = ({ children }) => {
  const storageData =
    typeof window !== 'undefined' ? localStorage.getItem('UI_PREFERENCE') : null

  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(storageData) || initialData
  )

  useEffect(() => {
    localStorage.setItem('UI_PREFERENCE', JSON.stringify(state))
  }, [state])

  return (
    <PreferenceContext.Provider value={state}>
      <PreferenceDispatch.Provider value={dispatch}>
        {children}
      </PreferenceDispatch.Provider>
    </PreferenceContext.Provider>
  )
}

export default PreferenceProvider

export function usePreference() {
  return useContext(PreferenceContext)
}

export function usePreferenceDispatch() {
  return useContext(PreferenceDispatch)
}
