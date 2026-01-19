import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import PersonIcon from '@mui/icons-material/Person'
import { Box, List, ListItemButton, ListItemIcon } from '@mui/material'
import axios, { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUserState } from '@/hooks/useGlobalState'

const listSx = {
  pl: 1,
  transition: 'transform 0.1s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    backgroundColor: '#fff',
    color: '#b3cf86ff',
  },
}

const MyList = () => {
  const [user] = useUserState()
  const router = useRouter()

  const addNewBook = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books'

      const headers = {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      }

      const res = await axios.post(url, headers)

      return router.push('/current/books/edit/' + res.data.id)
    } catch (err) {
      if (isAxiosError(err)) {
        console.error(err.message)
      }
    }
  }

  return (
    <List
      sx={{
        minHeight: '430px',
        pt: 12,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          pt: 3,
          m: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pb: 1,
            borderBottom: 1,
          }}
        >
          <PersonIcon />
          <Box sx={{ ml: 1 }}>{user.name}</Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            pb: 2,
            ml: 2,
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5, mt: 2 }}>
            <ListItemIcon sx={{ minWidth: 10 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 10,
                  color: '#000',
                }}
              />
            </ListItemIcon>
            <Link href={'/current/books'}>
              <ListItemButton sx={listSx}>マイページ</ListItemButton>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 10 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 10,
                  color: '#000',
                }}
              />
            </ListItemIcon>
            <ListItemButton onClick={addNewBook} sx={listSx}>
              新規登録
            </ListItemButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 10 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 10,
                  color: '#000',
                }}
              />
            </ListItemIcon>
            <Link href={'/current/books/list'}>
              <ListItemButton sx={listSx}>本一覧＆検索</ListItemButton>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 10 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 10,
                  color: '#000',
                }}
              />
            </ListItemIcon>
            <Link href={'/current/books/reading'}>
              <ListItemButton sx={listSx}>読書中一覧</ListItemButton>
            </Link>
          </Box>
        </Box>
      </Box>
    </List>
  )
}

export default MyList
