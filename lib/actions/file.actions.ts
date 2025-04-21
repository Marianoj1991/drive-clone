'use server'

import { createAdminClient } from '../appwrite'
import { InputFile } from 'node-appwrite/file'
import { APPWRITECONFIG } from '../appwrite/config'
import { ID, Models, Query } from 'node-appwrite'
import { constructFileUrl, getFileType, parseStringify } from '../utils'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './user.actions'

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path
}: UploadFileProps) => {
  try {
    const { storage, databases } = await createAdminClient()

    const inputFile = InputFile.fromBuffer(file, file.name)

    const bucketFile = await storage.createFile(
      APPWRITECONFIG.bucketId,
      ID.unique(),
      inputFile
    )

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id
    }

    const newFile = await databases
      .createDocument(
        APPWRITECONFIG.databaseId,
        APPWRITECONFIG.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(APPWRITECONFIG.bucketId, bucketFile.$id)
        handleError(error, 'Failed to create file document')
      })

    revalidatePath(path)
    return parseStringify(newFile)
  } catch (err) {
    handleError(err, 'Failed to upload file')
  }
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email])
    ])
  ]

  return queries
}

export const getFiles = async () => {
  const { databases } = await createAdminClient()

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) throw new Error('User not Found')

    const queries = createQueries(currentUser)

    const files = await databases.listDocuments(
      APPWRITECONFIG.databaseId,
      APPWRITECONFIG.filesCollectionId,
      queries
    )

    return parseStringify(files)
  } catch (error) {
    handleError(error, 'Failed to get files')
  }
}
