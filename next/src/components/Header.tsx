import { AppBar, Box, Button, Container } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        py: '12px',
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
              color: '#46c934ff',
              border: '1.5px solid #88cb7f',
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
