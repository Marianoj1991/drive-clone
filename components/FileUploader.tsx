'use client'

import { MouseEvent, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { handleError, uploadFile } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'

interface Props {
  ownerId: string
  accountId: string
  className?: string
}

export default function FileUploader({
  ownerId,
  accountId,
  className = ''
}: Props) {
  const path = usePathname()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
      acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))

          return toast({
            description: (
              <p className='body-2 text-white z-50'>
                <span className='font-semibold'>{file.name}</span> is to large.
                Max file size is 50MB.
              </p>
            ),
            className: 'error-toast'
          })
        }
      })
    },
    [ownerId, accountId, path]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpdateFiles = async () => {
    try {
      setIsLoading(true)
      const uploadPromises = files.map(async (file) => {
        const uploadedFile = await uploadFile({
          file,
          ownerId,
          accountId,
          path
        })
        if (uploadedFile) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
        }
      })
      await Promise.all(uploadPromises)
    } catch (err) {
      handleError(err, 'Error uploading files')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = (
    e: MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    e.stopPropagation()
    setFiles((prevFiles: File[]) =>
      prevFiles.filter((file) => file.name !== fileName)
    )
  }

  return (
    <>
      <div
        {...getRootProps()}
        className='cursor-pointer'
      >
        <input {...getInputProps()} />
        <Button
          type='button'
          className={cn('uploader-button')}
        >
          <Image
            src='/assets/icons/upload.svg'
            alt='Upload icon'
            width={25}
            height={25}
          />
          <p>{isDragActive ? 'Drop the file here' : 'Upload'}</p>
        </Button>
      </div>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <button
            className='h4 bg-rose-400 px-5 py-3 rounded-xl w-fit text-white font-bold flex gap-2 items-center'
            disabled={isLoading}
            onClick={handleUpdateFiles}
          >
            {!isLoading ? 'Confirm uploading?' : 'Uploading'}
            {isLoading && (
              <Image
                src='/assets/icons/loader.svg'
                alt='loader'
                width={24}
                height={24}
                className='ml-2 animate-spin'
              />
            )}
          </button>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)

            return (
              <li
                key={`${file.name}-${index}`}
                className='uploader-preview-item'
              >
                <div className='flex items-center gap-3'>
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className='preview-item-name'>
                    {file.name}
                    {isLoading && (
                      <Image
                        src='/assets/icons/file-loader.gif'
                        width={80}
                        height={26}
                        alt='Loader'
                      />
                    )}
                  </div>
                </div>

                <Image
                  src='/assets/icons/remove.svg'
                  width={24}
                  height={24}
                  alt='Remove'
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
