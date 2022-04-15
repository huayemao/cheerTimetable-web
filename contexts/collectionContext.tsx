import useCollapsible from 'lib/hooks/useCollapsible'
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  Dispatch,
} from 'react'

const initialData = {
  student: [],
  teacher: [],
  location: [],
  course: [],
  subject: [],
}

export const CollectionContext = createContext(initialData)
export const CollectionDispatch = createContext<
  Dispatch<{
    type: string
    payload: object
  }>
>(() => {})

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      const { payload } = action
      const { data } = payload
      const { id, type } = data

      const existed = state[type].find((e) => e.id === id)

      if (existed) {
        return Object.assign({}, state, {
          [type]: state[type].filter((e) => e.id !== id),
        })
      } else {
        return Object.assign({}, state, {
          [type]: state[type].concat(data),
        })
      }
    }

    default: {
      throw new Error('Unhandled action type.')
    }
  }
}

const CollectionProvider = ({ children }) => {
  const storageData =
    typeof window !== 'undefined' ? localStorage.getItem('COLLECTION') : null

  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(storageData || 'null') || initialData
  )

  useEffect(() => {
    localStorage.setItem('COLLECTION', JSON.stringify(state))
  }, [state])

  return (
    <CollectionContext.Provider value={state}>
      <CollectionDispatch.Provider value={dispatch}>
        {children}
      </CollectionDispatch.Provider>
    </CollectionContext.Provider>
  )
}

export default CollectionProvider

export function useCollection() {
  return useContext(CollectionContext)
}

export function useCollectionDispatch() {
  return useContext(CollectionDispatch)
}
