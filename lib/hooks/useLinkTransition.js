import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const useLinkTransition = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const routeChangeStart = (url, { shallow }) => {
      if (!shallow) {
        setLoading(true)
      }
    }
    const handleChangeComplete = (url, { shallow }) => {
      if (!shallow) {
        setLoading(false)
      }
    }

    router.events.on('routeChangeStart', routeChangeStart)
    router.events.on('routeChangeComplete', handleChangeComplete)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', routeChangeStart)
      router.events.off('routeChangeComplete', handleChangeComplete)
    }
  }, [])

  return loading
}

export default useLinkTransition
