import { Box, Grid, Pagination, useMediaQuery, useTheme } from '@mui/material'
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
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/reading?page=' + page
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const books = camelcaseKeys(data.books)
  const meta = camelcaseKeys(data.meta)
  const contentWidth = isLargeScreen ? '900px' : '460px'

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/current/books/reading?page=' + value)
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: 'secondary.main' }}>
      <Box
        sx={{
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 'bold',
          pt: 3,
        }}
      >
        読書中一覧
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}
      >
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '240px' }}>
            <MyList />
          </Box>
          <Box sx={{ px: 6, pt: 5, flex: 1, width: contentWidth }}>
            <Grid container spacing={4}>
              {books.length > 0 ? (
                books.map((book: ListProps, i: number) => (
                  <Grid key={i} item xs={12} lg={6}>
                    <Link href={'/current/books/' + book.id}>
                      <BookCard
                        title={book.title}
                        author={book.author}
                        readDate={book.readDate}
                      />
                    </Link>
                  </Grid>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', width: '100%', py: 6 }}>
                  データがありません
                </Box>
              )}
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
