'use client'
import { Models } from 'node-appwrite'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import Image from 'next/image'
import { actionsDropDownItems } from '@/constants'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  deleteFile,
  renameFile,
  updateFileUsers
} from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'
import { FileDetails, ShareInput } from './ActionsModalContent'

export default function ActionDropDown({ file }: { file: Models.Document }) {
  const path = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>()
  const [name, setFileName] = useState<string>(file.name)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emails, setEmails] = useState<string[]>([])

  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setFileName(file.name)
    setEmails([])
  }

  const handleAction = async () => {
    if (!action) return
    setIsLoading(true)
    let success: boolean | void | Promise<any> = false

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),

      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path })
    }

    success = actions[action.value as keyof typeof actions]()

    if (await success) closeAllModals()

    setIsLoading(false)
  }

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email)

    const success = await updateFileUsers({ fileId: file.$id, emails, path })

    if (success) {
      setEmails(updatedEmails)
      closeAllModals()
    }
  }

  const renderDialogContent = () => {
    if (!action) return null

    const { value, label } = action

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <Input
              type='text'
              value={name}
              onChange={(e) => {
                setFileName(e.target.value)
              }}
            />
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === 'delete' && (
            <p>
              Are you sure you want to delete{' '}
              <span className='delete-file-name'>{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className='flex flex-col gap-3 sm:flex-row'>
            <Button
              className='sm:w-[100%] modal-cancel-button'
              onClick={closeAllModals}
            >
              Cancel
            </Button>
            <Button
              className='sm:w-[100%] capitalize modal-submit-button'
              onClick={handleAction}
            >
              <p>{value}</p>
              {isLoading && (
                <Image
                  src='/assets/icons/loader.svg'
                  alt='Loader'
                  width={24}
                  height={24}
                  className='animate-spin'
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <DropdownMenu
        open={isDropDownOpen}
        onOpenChange={setIsDropDownOpen}
      >
        <DropdownMenuTrigger className='shad-no-focus px-4'>
          <Image
            src='/assets/icons/dots.svg'
            alt='dots'
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropDownItems.map((action) => (
            <DropdownMenuItem
              key={action.value}
              className='shad-dropdown-item'
              onClick={() => {
                setIsDropDownOpen(false)
                setAction(action)

                if (
                  ['rename', 'share', 'delete', 'details'].includes(
                    action.value
                  )
                )
                  setIsModalOpen(true)
              }}
            >
              {action.value === 'download' ? (
                <a
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className='flex items-center gap-2'
                >
                  <Image
                    src={action.icon}
                    alt={action.label}
                    width={30}
                    height={30}
                  />
                  {action.label}
                </a>
              ) : (
                <div className='flex items-center gap-2'>
                  <Image
                    src={action.icon}
                    alt={action.label}
                    width={30}
                    height={30}
                  />
                  {action.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  )
}
