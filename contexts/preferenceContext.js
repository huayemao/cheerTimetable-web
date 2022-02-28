import React, { createContext, useReducer, useContext, useEffect } from 'react'
export const PreferenceContext = createContext()
export const PreferenceDispatch = createContext()

const initialData = {
  show7DaysOnMobile: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_7_DAYS_ON_MOBILE': {
      return Object.assign({}, state, { show7DaysOnMobile: true })
    }
    case 'SHOW_5_DAYS_ON_MOBILE': {
      return Object.assign({}, state, { show7DaysOnMobile: false })
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