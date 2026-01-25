import {
  Box,
  Grid,
  Pagination,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import BookCard from '@/components/BookCard'
import Error from '@/components/Error'
import GenreSelect from '@/components/GenreSelect'
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
  genreName: string
}

const BooksList: NextPage = () => {
  const [user] = useUserState()
  const router = useRouter()
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const [query, setQuery] = useState('')
  const [debounceQuery, setDebouncedQuery] = useState('')

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 700)
    return () => clearTimeout(timer)
  }, [query])

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/list?page=' + page
  let url = baseUrl
  if (debounceQuery) {
    url += `&q=${encodeURIComponent(debounceQuery)}`
  }
  if (selectedGenreId) {
    url += `&genre_id=${selectedGenreId}`
  }

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const books = camelcaseKeys(data.books)
  const meta = camelcaseKeys(data.meta)
  const contentWidth = isLargeScreen ? '900px' : '460px'

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/current/books/list?page=' + value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: 'secondary.main' }}>
      <Box
        sx={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 'bold',
          pt: 5,
        }}
      >
        読了済一覧＆検索
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 5,
          mb: 4,
        }}
      >
        <TextField
          placeholder="タイトル・著者名で検索"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          sx={{
            width: '50%',
            maxWidth: '500px',
            backgroundColor: '#fff',
          }}
          InputLabelProps={{ shrink: false }}
        />
        <GenreSelect
          selectedGenreId={selectedGenreId}
          onGenreChange={setSelectedGenreId}
        />
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
                        genreName={book.genreName}
                      />
                    </Link>
                  </Grid>
                ))
              ) : debounceQuery ? (
                <Box sx={{ textAlign: 'center', width: '100%', py: 6 }}>
                  検索結果がみつかりませんでした
                </Box>
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

export default BooksList
