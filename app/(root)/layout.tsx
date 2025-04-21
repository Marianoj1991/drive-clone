import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect('/sign-in')

  return (
    <main className='flex h-screen'>
      <Sidebar {...currentUser} />

      <section className='flex flex-col flex-1 h-full'>
        <MobileNavigation {...currentUser} /> <Header {...currentUser} />
        <div className='main-content'>{children}</div>
      </section>

      <Toaster />
    </main>
  )
}
