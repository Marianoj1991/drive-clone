import Image from 'next/image'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5 '>
        <div className='flex max-h-[800px] max-w-[430px] flex-col items-center justify-center space-y-12'>
          <div className='bg-white w-[150px] h-[150px] rounded-full flex items-center justify-center overflow-hidden'>
            <Image
              src='/assets/icons/logo-full.png'
              alt='logo'
              width={120}
              height={120}
            />
          </div>
          <div className='space-y-5 text-white'>
            <h1 className='h1'>
              Store, organize and access — all in one place.
            </h1>
            <p className='text-[20px]'>
              Centralize all your important files with confidence.
            </p>
          </div>
          <div className='w-44 h-44 relative'>
            <Image
              src='/assets/images/files.png'
              alt='Files'
              fill
              className='transition-all hover:rotate-6 hover:scale-105'
              priority={true}
            />
          </div>
        </div>
      </section>

      <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
        <div className='mb-16 lg:hidden'>
          <Image
            src='/assets/icons/logo-full-brand.png'
            alt='logo'
            width={200}
            height={82}
            className='w-full'
          />
        </div>
        {children}
      </section>
    </div>
  )
}
