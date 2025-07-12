import { convertFileSize, convertSpaceUsedToMB } from '@/lib/utils'
import Image from 'next/image'

interface Props {
  icon: string
  name: string
  bgColor?: string
  type?: string
  total: number
  lastUpdate: string | null
}

export default async function DashboardCard({
  icon,
  name,
  bgColor,
  total,
  lastUpdate
}: Props) {
  let spaceInMB = convertSpaceUsedToMB(convertFileSize(total)).toFixed(2)
  let date: Date | null = null
  if (lastUpdate) {
    date = new Date(lastUpdate)
  }

  return (
    <div className='w-48 bg-white shadow-md rounded-xl p-4 sm:w-64 dark:bg-slate-700 '>
      <div className='flex items-center justify-between mb-4'>
        <div
          style={{ backgroundColor: bgColor }}
          className='w-10 h-10 rounded-full flex items-center justify-center'
        >
          <Image
            src={icon}
            alt={name}
            width={24}
            height={24}
          />
        </div>
        <span className='text-lg font-semibold text-gray-800 dark:text-white'>
          {spaceInMB} MB
        </span>
      </div>
      <div className='text-center '>
        <p className='text-gray-800 font-medium dark:text-white'>{name}</p>
        <p className='text-sm text-gray-400 dark:text-gray-300 mt-2'>
          Last update
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
          {date ? date.toLocaleDateString() : 'No date to show'}
        </p>
      </div>
    </div>
  )
}
