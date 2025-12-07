import { Box, List, Typography } from '@mui/material'
import { Book, BookCopy, LibraryBig } from 'lucide-react'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const token = localStorage.getItem('access-token')
  const client = localStorage.getItem('client')
  const uid = localStorage.getItem('uid')

  const res = await fetch(url, {
    headers: {
      'Countent-Type': 'application/json',
      'access-token': token || '',
      client: client || '',
      uid: uid || '',
    },
  })

  if (!res.ok) {
    throw new Error('認証に失敗しました')
  }

  return res.json()
}

const countSx = {
  fontSize: '28px',
  textAlign: 'right',
  mt: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 1,
}

const Counts = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/counts'

  const { data, error } = useSWR(url, fetcher)
  if (error) return <p>データの取得に失敗しました</p>
  if (!data) return <p>読み込み中・・・</p>

  return (
    <List>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 2,
          p: 2,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        <Typography sx={{ fontSize: '20px' }}>今月読んだ本:</Typography>
        <Typography sx={countSx}>
          <Book size={26} color="#333" />
          {data.this_month}冊
        </Typography>
        <Typography sx={{ fontSize: '20px', mt: 2 }}>今年読んだ本:</Typography>
        <Typography sx={countSx}>
          <BookCopy size={26} color="#333" />
          {data.this_year}冊
        </Typography>
        <Typography sx={{ fontSize: '20px', mt: 2 }}>
          今まで読んだ本:
        </Typography>
        <Typography sx={countSx}>
          <LibraryBig size={26} color="#333" />
          {data.total_count}冊
        </Typography>
      </Box>
    </List>
  )
}

export default Counts
