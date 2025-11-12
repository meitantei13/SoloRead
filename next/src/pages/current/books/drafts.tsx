import { Box, Grid, Pagination } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
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

const DraftsList: NextPage = () => {
  const [user] = useUserState()
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/drafts?page=' + page
  const { data, error } = useSWR(user.isSignedIn ? url : url, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const books = camelcaseKeys(data.books)
  const meta = camelcaseKeys(data.meta)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/current/books/drafts?page=' + value)
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: 'primary.main' }}>
      <Box
        sx={{
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 'bold',
          pt: 3,
        }}
      >
        下書き一覧
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <Box sx={{ width: '240px', pl: 3 }}>
            <MyList />
          </Box>
          <Box sx={{ px: 6, pt: 5, flex: 1 }}>
            <Grid container spacing={4}>
              {books.map((book: ListProps, i: number) => (
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <Pagination
                count={meta.totalPages}
                page={meta.currentPage}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DraftsList
