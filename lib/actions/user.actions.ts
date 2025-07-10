'use server'

import { Account, ID, Query } from 'node-appwrite'
import { createAdminClient, createSessionClient } from '../appwrite'
import { APPWRITECONFIG } from '../appwrite/config'
import { convertFileSize, convertSpaceUsedToMB, parseStringify } from '../utils'
import { cookies } from 'next/headers'
import { avatarPlaceholderUrl } from '@/constants'
import { redirect } from 'next/navigation'

const getUserByEmail = async (email: string) => {
  try {
    const { databases } = await createAdminClient()

    const result = await databases.listDocuments(
      APPWRITECONFIG.databaseId,
      APPWRITECONFIG.userCollectionId,
      [Query.equal('email', [email])]
    )

    return result.total > 0 ? result.documents[0] : null
  } catch (error) {
    handleError(error, 'Failed to get user by email')
    return null
  }
}

const handleError = (error: unknown, message: string) => {
  if (error instanceof Error) {
    throw new Error(`${message}: ${error.message}`)
  } else if (typeof error === 'string') {
    throw new Error(`${message}: ${error}`)
  } else {
    throw new Error(`${message}: Unexpected error`)
  }
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)
    return session.userId
  } catch (err) {
    handleError(err, 'Fail to send email OTP')
  }
}

export const createAccount = async ({
  fullName,
  email
}: {
  fullName: string
  email: string
}) => {
  const existingUser = await getUserByEmail(email)

  const accountId = await sendEmailOTP({ email })
  if (!accountId) throw new Error('Failed to send an OTP')

  if (!existingUser) {
    const { databases } = await createAdminClient()

    await databases.createDocument(
      APPWRITECONFIG.databaseId,
      APPWRITECONFIG.userCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId
      }
    )
  }

  return parseStringify({ accountId })
}

export const verifySecret = async ({
  accountId,
  password
}: {
  accountId: string
  password: string
}) => {
  try {
    const { account } = await createAdminClient()

    const session = await account.createSession(accountId, password)
    ;(await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })

    return parseStringify({ sessionId: session.$id })
  } catch (err: unknown) {
    handleError(err, 'Failed to verify OTP')
  }
}

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient()

    const result = await account.get()

    const user = await databases.listDocuments(
      APPWRITECONFIG.databaseId,
      APPWRITECONFIG.userCollectionId,
      [Query.equal('accountId', result.$id)]
    )

    if (user.total <= 0) return null

    return parseStringify(user.documents[0])
  } catch (err: unknown) {
    if ((err as any).source === 'redirect') {
      return null
    }
    handleError(err, 'Error al obtener usuario')
  }
}

export const signOutUser = async () => {
  const { account } = await createSessionClient()

  try {
    await account.deleteSession('current')
    ;(await cookies()).delete('appwrite-session')
  } catch (err) {
    handleError(err, 'Failed to sign out user')
  } finally {
    redirect('/')
  }
}

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      await sendEmailOTP({ email })
      return parseStringify({ accountId: existingUser.accountId })
    }

    return parseStringify({ accountId: null, error: 'User not found' })
  } catch (err) {
    handleError(err, 'Failed to sign in user')
  }
}

export const getTotalSpaceUsed = async (): Promise<number> => {
  let totalSize = 0

  try {
    const { storage, account } = await createAdminClient()
    const { buckets } = await storage.listBuckets()

    for (const bucket of buckets) {
      let limit = 100
      let offset = 0
      let hasMore = true

      while (hasMore) {
        const { files, total } = await storage.listFiles(bucket.$id, [
          Query.limit(limit),
          Query.offset(offset)
        ])
        for (const file of files) {
          totalSize += file.sizeOriginal
        }

        offset += limit
        hasMore = offset < total
      }
    }
  } catch (err) {
    handleError(err, 'Error counting files size')
  }

  const totalSizeConverted = convertFileSize(totalSize)

  const usedSpaceinMB = convertSpaceUsedToMB(totalSizeConverted)

  return parseStringify(usedSpaceinMB)
}
