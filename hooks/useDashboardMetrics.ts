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
  freeSpaceInMB: totalSpaceInAppwrite,
  dashboardCardData: []
}

export default async function getDashboardMetrics(): Promise<IReturnMetrics> {
  // ACA OBTENGO TODOS LOS FILES
  const types: FileType[] = []

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
  })

  const totalSpacedUsed = files.documents.reduce(
    (acc: number, doc: Models.Document) => {
      return (acc += doc.size)
    },
    0
  )

  const usedSpaceinMB = convertSpaceUsedToMB(convertFileSize(totalSpacedUsed))

  // TOMAMOS EL ESPACIO EN MB
  const freeSpaceInMB = totalSpaceInAppwrite - usedSpaceinMB

  return {
    usedSpaceinMB,
    totalSpaceInAppwrite,
    freeSpaceInMB,
    dashboardCardData
  }
}
