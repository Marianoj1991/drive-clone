import DashboardCard from '@/components/DashboardCard'
import StorageChart from '@/components/StorageChart'
import getDashboardMetrics from '@/hooks/useDashboardMetrics'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const {
    freeSpaceInMB,
    totalSpaceInAppwrite,
    usedSpaceinMB,
    dashboardCardData
  } = await getDashboardMetrics()

  return (
    <div className='flex flex-col gap-10 min-h-[calc(100vh-300px)]'>
      <div className='flex justify-center bg-[#7288fa] p-5 rounded-xl'>
        <div className='flex-1 flex justify-center '>
          <StorageChart
            freeSpace={freeSpaceInMB}
            usedSpace={usedSpaceinMB}
          />
        </div>
        <div className='flex flex-col flex-1 items-center justify-center gap-4'>
          <p className='text-3xl font-semibold text-white'>Available Storage</p>
          <p className='text-lg text-light-300 md:text-xl '>
            {(freeSpaceInMB / 1024).toFixed(2)} GB /{' '}
            {totalSpaceInAppwrite / 1024} GB
          </p>
        </div>
      </div>
      {/* LISTA DE TIPOS */}
      <div className=' sm:flex-row flex-wrap w-full flex items-center justify-center gap-5'>
        {dashboardCardData.map((item) => (
          <DashboardCard
            key={item.name}
            {...item}
          />
        ))}
      </div>
    </div>
  )
}
