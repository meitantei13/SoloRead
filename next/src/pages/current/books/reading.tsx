import { Box, Grid, Pagination, useMediaQuery, useTheme } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BookCard from '@/components/BookCard'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import Sidebar from '@/components/Sidebar'
import { useUserState } from '@/hooks/useGlobalState'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type ListProps = {
  id: number
  title: string
  author: string
  readDate: string
  genreName: string
}

const ReadingList: NextPage = () => {
  const [user] = useUserState()
  const router = useRouter()
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev)
  }

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
          fontSize: 32,
          fontWeight: 'bold',
          pt: 7,
          pb: 7,
        }}
      >
        読書中一覧
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}
      >
        <Sidebar
          drawerOpen={drawerOpen}
          onToggle={handleDrawerToggle}
          desktopMt={-8}
        />
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              position: 'relative',
              px: { xs: 2, sm: 6 },
              flex: 1,
              width: { xs: '100%', lg: contentWidth },
              maxWidth: contentWidth,
              mx: 'auto',
            }}
          >
            <Grid container spacing={4}>
              {books.length > 0 ? (
                books.map((book: ListProps, i: number) => (
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

export default ReadingList
