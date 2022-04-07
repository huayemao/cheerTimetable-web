import useCollapsible from 'lib/hooks/useCollapsible'
import React, { createContext, useReducer, useContext, useEffect } from 'react'
export const MenuContext = createContext({})
export const MenuDispatch = createContext(() => {})

const MenuProvider = ({ children }) => {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })

  return (
    <MenuContext.Provider value={{ collapsed }}>
      <MenuDispatch.Provider value={toggleCollapsed}>
        {children}
      </MenuDispatch.Provider>
    </MenuContext.Provider>
  )
}

export default MenuProvider

export function useMenu() {
  return useContext(MenuContext)
}

export function useMenuDispatch() {
  return useContext<() => void>(MenuDispatch)
}
