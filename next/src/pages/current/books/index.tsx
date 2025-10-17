import { Box, Button, Container, Typography, Grid } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import BookCard from './BookCard'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
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

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books'
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)

  if (error) return <Error />
  if (!data) return <Loading />

  const books: BookProps[] = camelcaseKeys(data)
  return (
    <Box sx={{ backgroundColor: '#e6f2ff', minHeight: '100vh' }}>
      <Container>
        <Typography>最新投稿</Typography>
        <Grid container spacing={4}>
          {books.map((book: BookProps, i: number) => (
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

        <Button>もっと見る</Button>
      </Container>
    </Box>
  )
}

export default MyPage
