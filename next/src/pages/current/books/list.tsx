import { Box, Grid } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import useSWR from 'swr'
import BookCard from '@/components/BookCard'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import MyList from '@/components/MyList'
import { useUserState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type ListProps = {
  id: number
  title: string
  author: string
  readDate: string
}

const BooksList: NextPage = () => {
  const [user] = useUserState()
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books'

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const books = camelcaseKeys(data, { deep: true })

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#bafbbaff',
      }}
    >
      <Box sx={{ display: 'flex', maxWidth: '1200px' }}>
        <Box sx={{ width: '240px', pl: 3 }}>
          <MyList />
        </Box>
        <Box sx={{ px: 6, pt: 5, flex: 1 }}>
          <Grid container spacing={4}>
            {books.map((book: ListProps, i: number) => (
              <Grid key={i} item xs={12} md={6}>
                <BookCard
                  title={book.title}
                  author={book.author}
                  readDate={book.readDate}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default BooksList
