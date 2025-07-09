import Image from 'next/image'
import { Button } from './ui/button'
import Search from './Search'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'
import DarkModeToggle from './DarkModeToggle'

interface Props {
  accountId: string
  $id: string
}

export default function Header({ $id: ownerId, accountId }: Props) {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <FileUploader
          ownerId={ownerId}
          accountId={accountId}
        />
        <DarkModeToggle />
        <form
          action={async () => {
            'use server'
            await signOutUser()
          }}
        >
          <Button
            type='submit'
            className='sign-out-button'
          >
            <Image
              src='/assets/icons/logout.png'
              alt='logo'
              width={36}
              height={36}
              className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  )
}
