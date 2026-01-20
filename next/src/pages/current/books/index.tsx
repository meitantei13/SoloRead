import {
  Box,
  Button,
  Typography,
  Grid,
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
  genreName: string
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
  const visibleBooks = isLargeScreen ? books.slice(0, 6) : books.slice(0, 3)
  const contentWidth = () => {
    if (isLargeScreen === true && books.length > 1) {
      return '900px'
    }

    if (isLargeScreen === true && books.length === 1) {
      return '460px'
    }

    if (isLargeScreen === false) {
      return '460px'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'secondary.main',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '240px' }}>
          <MyList />
          <Counts />
        </Box>
        <Box
          sx={{
            px: 6,
            flex: 1,
            width: contentWidth(),
          }}
        >
          <Typography
            sx={{
              mt: 7,
              mb: 2,
              pl: 2,
              fontWeight: 'bold',
              fontSize: 23,
            }}
          >
            最新投稿
          </Typography>
          <Box>
            {books.length === 0 ? (
              <Box sx={{ pt: 2, pl: 5, fontSize: 18, lineHeight: 1.8 }}>
                まだ投稿はありません。
                <br />
                「新規登録」から最初の投稿を
                <br />
                追加してみましょう！
              </Box>
            ) : (
              <Box>
                <Grid container spacing={4}>
                  {visibleBooks.map((book: BookProps, i: number) => (
                    <Grid key={i} item xs={12} lg={6}>
                      <Link href={'/current/books/' + book.id}>
                        <BookCard
                          title={book.title}
                          author={book.author}
                          readDate={book.readDate}
                          genreName={book.genreName}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    pt: 2,
                  }}
                >
                  <Link href={'/current/books/list'}>
                    <Button
                      sx={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        transition: 'transform 0.1s',
                        '&:hover': {
                          transform: 'translate(2px, 2px)',
                          color: '#b3cf86ff',
                          backgroundColor: 'secondary.main',
                        },
                        color: '#000',
                      }}
                    >
                      もっと見る
                    </Button>
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MyPage
