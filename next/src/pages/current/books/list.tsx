import { Box, Grid, Pagination, TextField } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
  const router = useRouter()
  const page = 'page' in router.query ? Number(router.query.page) : 1

  const [query, setQuery] = useState('')
  const [debounceQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 700)
    return () => clearTimeout(timer)
  }, [query])

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/list?page=' + page
  const url = debounceQuery
    ? `${baseUrl}&q=${encodeURIComponent(debounceQuery)}`
    : baseUrl

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const books = camelcaseKeys(data.books)
  const meta = camelcaseKeys(data.meta)

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push('/current/books/list?page=' + value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
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
        読書一覧
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          mb: 4,
        }}
      >
        <TextField
          placeholder="タイトル・著者名で検索"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          sx={{
            width: '60%',
            maxWidth: '750px',
            backgroundColor: '#fff',
            mt: 3,
          }}
          InputLabelProps={{ shrink: false }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%', maxWidth: '1200px' }}>
          <Box sx={{ width: '240px', pl: 3 }}>
            <MyList />
          </Box>
          <Box sx={{ px: 6, pt: 5, flex: 1 }}>
            <Grid container spacing={4}>
              {books.length > 0 ? (
                books.map((book: ListProps, i: number) => (
                  <Grid key={i} item xs={12} md={6}>
                    <Link href={'/current/books/' + book.id}>
                      <BookCard
                        title={book.title}
                        author={book.author}
                        readDate={book.readDate}
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
