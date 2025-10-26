import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import PersonIcon from '@mui/icons-material/Person'
import { Box, List, ListItemButton, ListItemIcon } from '@mui/material'
import Link from 'next/link'
import { useUserState } from '@/hooks/useGlobalState'

const listSx = {
  pl: 1,
  transition: 'transform 0.1s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    backgroundColor: '#fff',
    color: '#779bf5ff',
  },
}

const MyList = () => {
  const [user] = useUserState()

  return (
    <List
      sx={{
        minHeight: '500px',
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
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 10 }}>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 10,
                  color: '#000',
                }}
              />
            </ListItemIcon>
            <Link href={'/current/books/new'}>
              <ListItemButton sx={listSx}>新規登録</ListItemButton>
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
            <Link href={'/current/books/list'}>
              <ListItemButton sx={listSx}>本一覧</ListItemButton>
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
            <Link href={'/current/books/search'}>
              <ListItemButton sx={listSx}>本検索</ListItemButton>
            </Link>
          </Box>
        </Box>
      </Box>
    </List>
  )
}

export default MyList
