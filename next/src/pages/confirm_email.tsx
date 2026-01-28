import { Box, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'

const ConfirmEmail: NextPage = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()
  const [, setUser] = useUserState()
  const [isError, setIsError] = useState(false)

  const token = router.query.token as string | undefined

  useEffect(() => {
    if (!router.isReady) return

    if (!token) {
      setIsError(true)
      return
    }

    const confirmEmail = async () => {
      const url =
        process.env.NEXT_PUBLIC_API_BASE_URL + '/current/settings/email/confirm'

      try {
        const res = await axios.get(url, { params: { token } })

        // 新しい認証情報をlocalStorageに保存
        localStorage.setItem('access-token', res.data['access-token'])
        localStorage.setItem('client', res.data.client)
        localStorage.setItem('uid', res.data.uid)

        // 新しい認証情報でユーザー情報を再取得
        const userUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user'
        const userRes = await axios.get(userUrl, {
          headers: {
            'Content-Type': 'application/json',
            'access-token': res.data['access-token'],
            client: res.data.client,
            uid: res.data.uid,
          },
        })
        setUser({
          ...userRes.data,
          isSignedIn: true,
          isFetched: true,
        })

        setSnackbar({
          message: 'メールアドレスを更新しました。',
          severity: 'success',
          pathname: '/current/settings',
        })
        router.push('/current/settings')
      } catch {
        setIsError(true)
      }
    }
    confirmEmail()
  }, [router.isReady, token, router, setSnackbar, setUser])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'secondary.main',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isError ? (
        <Typography color="error" variant="h6">
          このリンクは無効または期限切れです。
        </Typography>
      ) : (
        <Typography variant="h6">メールアドレスを確認中・・・</Typography>
      )}
    </Box>
  )
}

export default ConfirmEmail
