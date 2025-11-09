import { AppBar, Box, Button, Container } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()

  const hiddenHeaderPaths = ['/']

  if (hiddenHeaderPaths.includes(router.pathname)) {
    return null
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        py: '12px',
        borderBottom: '1px solid #ccc',
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
              <Image
                src="/logo.png"
                width={133}
                height={40}
                alt="logo"
                priority
              />
            </Link>
          </Box>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              borderRadius: 2,
              boxShadow: 'none',
              color: '#7A8C64',
              border: '1.5px solid #88cb7f',
              '&:hover': {
                border: '1.5px solid #88cb7f',
                backgroundColor: '#f1fdf0ff',
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
