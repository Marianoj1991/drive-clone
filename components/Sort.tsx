'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { sortTypes } from '@/constants'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Sort() {
  const path = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') ?? sortTypes[0].value
  const [sortValue, setSortValue] = useState(currentSort)

  useEffect(() => {
    setSortValue(searchParams.get('sort') ?? sortTypes[0].value)
  }, [searchParams])

  const handleSort = (value: string) => {
    const paramsCloned = new URLSearchParams(Array.from(searchParams.entries()))

    paramsCloned.set('sort', value)
    router.replace(`${path}?${paramsCloned.toString()}`)
    setSortValue(value)
  }

  return (
    <Select
      onValueChange={handleSort}
      defaultValue={sortValue}
    >
      <SelectTrigger className='sort-select'>
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className='sort-select-content'>
        {sortTypes.map((sort) => (
          <SelectItem
            className='shad-select-item'
            key={sort.label}
            value={sort.value}
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
