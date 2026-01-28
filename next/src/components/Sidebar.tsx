import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material'
import Counts from './Counts'
import MyList from './MyList'

type SidebarProps = {
  drawerOpen: boolean
  onToggle: () => void
  desktopMt?: number
}

const Sidebar = ({ drawerOpen, onToggle, desktopMt = 0 }: SidebarProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      {/* ハンバーガーボタン（モバイル用・固定位置） */}
      {isMobile && (
        <IconButton
          onClick={onToggle}
          sx={{
            position: 'fixed',
            top: 80,
            left: 15,
            zIndex: 1300,
            backgroundColor: '#fff',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      <Drawer open={drawerOpen} onClose={onToggle}>
        <Box sx={{ width: '250px', p: 1, mt: 5 }}>
          <MyList />
          <Counts />
        </Box>
      </Drawer>

      <Box sx={{ display: 'flex' }}>
        {/* サイドバー（デスクトップ用） */}
        {!isMobile && (
          <Box sx={{ width: '240px', flexShrink: 0, mt: desktopMt }}>
            <MyList />
            <Counts />
          </Box>
        )}
      </Box>
    </>
  )
}

export default Sidebar
