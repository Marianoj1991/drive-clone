'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function StorageChart({
  usedSpace,
  freeSpace
}: {
  usedSpace: number
  freeSpace: number
}) {
  const data = {
    labels: ['Used Space', 'Free Space'],
    datasets: [
      {
        data: [usedSpace, freeSpace],
        backgroundColor: ['#fff', '#9db2ce'],
        hoverBackgroundColor: ['#fff', '#9db2ce'],
        borderWidth: 1
      }
    ]
  }

  const options = {
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 16,
          padding: 14,
          font: {
            size: 14
          },
          color: '#fff'
        }
      },
      tooltip: {
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        },
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.chart._metasets[0].total
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} MB (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className='w-64 h-auto flex justify-center'>
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  )
}
