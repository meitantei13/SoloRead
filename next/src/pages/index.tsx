import { Box, Typography, Button, Stack } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
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
              sx={{ width: 140, height: 50, fontWeight: 'bold' }}
            >
              ログイン
            </Button>
          </Link>
          <Link href="/sign_up">
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 140, height: 50, fontWeight: 'bold' }}
            >
              新規登録
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 140,
              height: 50,
              backgroundColor: 'grey.300',
              color: 'grey.800',
              '&:hover': { backgroundColor: 'grey.400' },
              fontWeight: 'bold',
            }}
          >
            ゲストログイン
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
