import { navItems, totalSpaceInAppwrite } from '@/constants'
import { getFiles } from '@/lib/actions/file.actions'
import {
  convertFileSize,
  convertSpaceUsedToMB,
  getFileTypesParams
} from '@/lib/utils'
import { Models } from 'node-appwrite'

interface IdashboardCardData {
  type: string
  name: string
  bgColor: string
  total: number
  lastUpdate: string | null
  icon: string
}

interface IReturnMetrics {
  usedSpaceinMB: number
  totalSpaceInAppwrite: number
  freeSpaceInMB: number
  dashboardCardData: IdashboardCardData[]
}

const EMPTY_METRICS: IReturnMetrics = {
  usedSpaceinMB: 0,
  totalSpaceInAppwrite: totalSpaceInAppwrite,
  freeSpaceInMB: 0,
  dashboardCardData: []
}

export default async function getDashboardMetrics(): Promise<IReturnMetrics> {
  // ACA OBTENGO TODOS LOS FILES
  const types: FileType[] = []
  let totalSpaceUsed: number = 0

  const files: Models.Document = await getFiles({ types })

  if (!files) return EMPTY_METRICS

  const dashboardCardData: IdashboardCardData[] = navItems
    .filter((item) => item.type)
    .map((item) => ({
      name: item.name!,
      type: item.type!,
      bgColor: item.bgColor!,
      total: 0,
      lastUpdate: null,
      icon: item.icon!
    }))

  files.documents.forEach((file: Models.Document) => {
    const card = dashboardCardData.find((c) =>
      getFileTypesParams(c.type).includes(file.type)
    )

    if (card) {
      card.total += file.size

      if (!card.lastUpdate) {
        card.lastUpdate = file.$createdAt
      }
    }

    totalSpaceUsed += file.size
  })

  const usedSpaceinMB = convertSpaceUsedToMB(convertFileSize(totalSpaceUsed))

  // TOMAMOS EL ESPACIO EN MB
  const freeSpaceInMB = totalSpaceInAppwrite - usedSpaceinMB

  return {
    usedSpaceinMB,
    totalSpaceInAppwrite,
    freeSpaceInMB,
    dashboardCardData
  }
}
