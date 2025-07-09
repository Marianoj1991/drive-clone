'use client'

import { avatarPlaceholderUrl, navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type currentUser = {
  fullName: string
  email: string
  avatar: string
}

export default function Sidebar({ fullName, email, avatar }: currentUser) {
  const pathname = usePathname()

  return (
    <aside className='sidebar'>
      <Link href='/'>
        <Image
          src='/assets/icons/logo-full-brand.png'
          alt='logo'
          width={300}
          height={60}
          className='hidden lg:block'
        />
        <div className='lg:hidden relative w-[60px] h-[45px] '>
          <Image
            src='/assets/icons/logo-full.png'
            alt='logo'
            fill
            className='w-[100px]'
          />
        </div>
      </Link>

      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {navItems.map((item) => {
            const isActive = item.url === pathname

            return (
              <Link
                href={item.url}
                key={item.name}
                className='lg:w-full '
              >
                <li
                  className={cn(
                    'sidebar-nav-item',
                    pathname === item.url && 'shad-active'
                  )}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className={cn('nav-icon', isActive && 'nav-icon-active')}
                  />
                  <p className='dark:text-white hidden lg:block'>{item.name}</p>
                </li>
              </Link>
            )
          })}
        </ul>
      </nav>

      <div className='w-[200px] d-flex items-center justify-center'>
        <Image
          src='/assets/images/files-2.png'
          alt='logo'
          width={506}
          height={418}
          className='hidden lg:block w-full'
        />
      </div>

      <div className='sidebar-user-info '>
        <Image
          src={avatarPlaceholderUrl}
          alt='Avatar'
          width={44}
          height={44}
          className='sidebar-user-avatar'
        />

        <div className='hidden lg:block dark:text-white'>
          <p className='subtitle-2 capitalize'>{fullName}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>
    </aside>
  )
}
