'use client'

import Image from 'next/image'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Models } from 'node-appwrite'
import { getFiles } from '@/lib/actions/file.actions'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const searchText = searchParams.get('query') || ''
  const router = useRouter()

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles({ searchText: query })
      if (files) {
        setResults(files.documents)
        setOpen(true)
      } else {
        setOpen((e) => !e)
      }
    }

    fetchFiles()
  }, [query])

  useEffect(() => {
    if (!searchText) {
      setQuery('')
    }
  }, [searchText])

  const handleClickItem = (file: Models.Document) => {
    setOpen(false)
    setResults([])
    router.push(
      `${file.type === 'video' ? 'media' : file.type + 's'}?query=${query}`
    )
  }

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          src='/assets/icons/search.svg'
          alt='Search'
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder='Search...'
          className='search-input'
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className='search-result'>
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className='flex items-center justify-between gap-4'
                  onClick={() => handleClickItem(file)}
                >
                  <div className='flex cursor-pointer items-center gap-4'>
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className='size-9 min-w-9'
                    />
                    <p className='subtitle-2 line-clamp-1 text-light-100'>
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className='caption line-clamp-1 text-light-200'
                  />
                </li>
              ))
            ) : (
              <p className='empty-result'>No results</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
