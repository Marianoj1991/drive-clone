import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { CurrentUserContextProvider } from '@/components/CurrentUserProvider'

export default async function Layout({ children }: { children: ReactNode }) {
  let currentUser
  try {
    currentUser = await getCurrentUser()
  } catch (err) {
    return redirect('/sign-in')
  }

  if (!currentUser) return redirect('/sign-in')

  return (
    <CurrentUserContextProvider user={currentUser}>
      <main className='flex min-h-screen'>
        <Sidebar {...currentUser} />
        <section className='flex flex-col flex-1 h-screen'>
          <MobileNavigation {...currentUser} /> <Header {...currentUser} />
          <div className='main-content'>{children}</div>
        </section>
        <Toaster />
      </main>
    </CurrentUserContextProvider>
  )
}
