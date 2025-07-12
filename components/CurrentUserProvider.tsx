'use client'

import { Models } from 'node-appwrite'
import { CurrentUserContext } from '@/app/context/CurrentUserContext'

export function CurrentUserContextProvider({
  user,
  children
}: {
  user: null | Models.Document
  children: React.ReactNode
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )
}
