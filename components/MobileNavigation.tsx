'use client'

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Separator } from './ui/separator'
import { navItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

interface Props {
  fullName: string
  email: string
  avatar: string
  accountId: string
  $id: string
}

export default function MobileNavigation({
  $id: ownerId,
  fullName,
  email,
  avatar,
  accountId
}: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className='mobile-header'>
      <Link
        href='/'
        className='h-full'
      >
        <Image
          src='/assets/icons/logo-full-brand.svg'
          alt='logo'
          width={120}
          height={52}
          className='h-full'
        />
      </Link>
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger>
          <Image
            src='assets/icons/menu.svg'
            alt='menu logo'
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image
                src={avatar}
                alt='avatar'
                width={44}
                height={44}
                className='header-user-avatar'
              />
              <div className='sm:hidden lg:block'>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption'>{email}</p>
              </div>
            </div>
            <Separator className='mb-2 bg-light-200/20' />
          </SheetTitle>

          <nav className='mobile-nav'>
            <ul className='mobile-nav-list'>
              {navItems.map((item) => {
                const isActive = item.url === pathname

                return (
                  <Link
                    href={item.url}
                    key={item.name}
                    className='lg:w-full'
                  >
                    <li
                      className={cn(
                        'mobile-nav-item',
                        pathname === item.url && 'shad-active'
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={cn(
                          'nav-icon',
                          pathname === item.url && 'nav-icon-active'
                        )}
                      />
                      <p>{item.name}</p>
                    </li>
                  </Link>
                )
              })}
            </ul>
          </nav>

          <Separator className='my-5 bg-light-200/20' />

          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader
              accountId={accountId}
              ownerId={ownerId}
            />
            <Button
              type='submit'
              className='mobile-sign-out-button'
              onClick={async () => await signOutUser()}
            >
              <Image
                src='assets/icons/logout.svg'
                alt='logout logo'
                width={25}
                height={25}
              />

              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
