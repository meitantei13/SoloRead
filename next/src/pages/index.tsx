import { LoadingButton } from '@mui/lab'
import { Box, Typography, Button, Stack } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSnackbarState } from '@/hooks/useGlobalState'

export default function Home() {
  const [, setSnackbar] = useSnackbarState()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const GuestUserLogin = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/guest_sessions`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      const token = res.headers['access-token'] || res.headers['access_token']
      const client = res.headers['client']
      const uid = res.headers['uid']

      localStorage.setItem('access-token', token)
      localStorage.setItem('client', client)
      localStorage.setItem('uid', uid)

      setSnackbar({
        message: 'サインインに成功しました',
        severity: 'success',
        pathname: '/current/books',
      })
      router.push('/current/books')

      return res.data.data
    } catch (error) {
      console.error('ゲストログインに失敗', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 4,
      }}
    >
      <Box
        sx={{
          zIndex: -10,
        }}
      >
        <Image
          src="/back3.jpg"
          alt="背景画像"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: '#333631',
            p: 2,
          }}
        >
          Solo Read
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          心に残る一冊を、自分だけの本棚に。
          <br />
          Solo Readは、あなただけが開ける秘密の本棚です。
        </Typography>

        <Stack spacing={3} direction="row" sx={{ p: 4 }}>
          <Link href="/sign_in">
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: 140,
                height: 50,
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#8F9D77',
                },
              }}
            >
              ログイン
            </Button>
          </Link>
          <Link href="/sign_up">
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: 140,
                height: 50,
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#8F9D77',
                },
              }}
            >
              新規登録
            </Button>
          </Link>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={GuestUserLogin}
            loading={isLoading}
            sx={{
              width: 140,
              height: 50,
              backgroundColor: 'grey.300',
              color: 'grey.800',
              '&:hover': {
                backgroundColor: '#cdc7c7ff',
              },
              fontWeight: 'bold',
            }}
          >
            ゲストログイン
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  )
}
