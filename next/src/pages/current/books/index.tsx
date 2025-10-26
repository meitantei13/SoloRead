import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import BookCard from '@/components/BookCard'
import Counts from '@/components/Counts'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import MyList from '@/components/MyList'
import { useUserState } from '@/hooks/useGlobalState'
import { useRequireSginedIn } from '@/hooks/useRequireSignedIn'
import { fetcher } from '@/utils'

type BookProps = {
  id: number
  title: string
  author: string
  readDate: string
  user: {
    name: string
  }
}

const MyPage: NextPage = () => {
  useRequireSginedIn()
  const [user] = useUserState()

  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  const books: BookProps[] = camelcaseKeys(data)
  const visibleBooks = isLargeScreen ? books.slice(0, 8) : books.slice(0, 4)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'primary.main',
      }}
    >
      <Box sx={{ display: 'flex', maxWidth: '1200px' }}>
        <Box sx={{ width: '220px' }}>
          <MyList />
        </Box>
        <Box sx={{ backgroundColor: 'primary.main', flex: 1 }}>
          <Typography sx={{ py: 2, pl: 2 }}>最新投稿</Typography>
          <Container>
            <Grid container spacing={4}>
              {visibleBooks.map((book: BookProps, i: number) => (
                <Grid key={i} item xs={12} md={6}>
                  <Link href={'/current/books/' + book.id}>
                    <BookCard
                      title={book.title}
                      author={book.author}
                      readDate={book.readDate}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                py: 2,
              }}
            >
              <Button sx={{ color: '#000' }}>もっと見る</Button>
            </Box>
          </Container>
        </Box>
        <Box
          sx={{
            width: '220px',
          }}
        >
          <Counts />
        </Box>
      </Box>
    </Box>
  )
}

export default MyPage
