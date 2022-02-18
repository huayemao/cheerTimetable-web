import { useCallback, useState } from 'react'

export default function useCollapsible({ initialState }) {
  const [collapsed, setCollapsed] = useState(
    initialState !== null && initialState !== void 0 ? initialState : false
  )
  const toggleCollapsed = useCallback(() => {
    setCollapsed((expanded) => !expanded)
  }, [])
  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,
  }
}
