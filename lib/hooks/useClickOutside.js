import { useEffect } from 'react'
const useClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback(e.target)
    }
  }
  useEffect(() => {
    // 在其他事件监听器之前尽早执行，避免导致的 state 变化引起混乱
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  })
}

export default useClickOutside
