'use client'

import Image from 'next/image'

function DarkModeToggle() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleDarkMode}
      className='sign-out-button'
    >
      <Image
        alt='DarkMode Icon'
        src='/assets/icons/dark-mode.svg'
        width={36}
        height={36}
      />
    </button>
  )
}
export default DarkModeToggle
