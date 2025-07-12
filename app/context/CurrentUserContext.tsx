import { createContext, useContext } from 'react'
import { Models } from 'node-appwrite'

export const CurrentUserContext = createContext<Models.Document | null>(null)

export function useCurrentUser() {
  return useContext(CurrentUserContext)
}
