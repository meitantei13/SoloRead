import { AppBar, Box, Button, Container } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'

const Header = () => {
  const router = useRouter()
  const [, setUser] = useUserState()
  const [, setSnackbar] = useSnackbarState()

  // ヘッダーを非表示にするページ
  const hiddenHeaderPaths = [
    '/',
    '/sign_up',
    '/sign_in',
    '/forgot_password',
    '/reset_password',
  ]
  if (hiddenHeaderPaths.includes(router.pathname)) {
    return null
  }

  const logout = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign_out`,
        {
          headers: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid'),
          },
        },
      )
    } catch (error) {
      console.log('サーバーログアウトに失敗しました', error)
    }

    localStorage.removeItem('access-token')
    localStorage.removeItem('client')
    localStorage.removeItem('uid')

    setUser({
      id: 0,
      name: '',
      email: '',
      isSignedIn: false,
      isFetched: false,
    })

    await router.push('/')

    setSnackbar({
      message: 'ログアウトに成功しました',
      severity: 'success',
      pathname: '/',
    })
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: 'black',
        boxShadow: 'none',
        py: '12px',
        borderBottom: '2px solid #A3B18A',
      }}
    >
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Link href="/current/books">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                width={133}
                height={40}
                alt="logo"
                style={{ display: 'block' }}
              />
            </Link>
          </Box>
          <Button
            variant="outlined"
            onClick={logout}
            sx={{
              textTransform: 'none',
              fontSize: 16,
              borderRadius: 2,
              boxShadow: 'none',
              color: '#A3B18A',
              border: '1.5px solid #A3B18A',
              '&:hover': {
                border: '1.5px solid #A3B18A',
                backgroundColor: '#ccd7b5ff',
              },
            }}
          >
            ログアウト
          </Button>
        </Box>
      </Container>
    </AppBar>
  )
}

export default Header
