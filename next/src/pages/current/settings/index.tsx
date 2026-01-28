import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { useSnackbarState } from '@/hooks/useGlobalState'

const hoverSx = {
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    backgroundColor: '#f5f5f5',
  },
}

type SettingItemProps = {
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  label: string
  color?: string
}

const SettingItem = ({
  href,
  onClick,
  icon,
  label,
  color = '#3D3D3D',
}: SettingItemProps) => {
  const content = (
    <Box sx={hoverSx}>
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            '&:last-child': { pb: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon}
            <Typography sx={{ fontSize: 16, color }}>{label}</Typography>
          </Box>
          <ChevronRightIcon sx={{ color: '#999' }} />
        </CardContent>
      </Card>
    </Box>
  )
  return href ? (
    <Link href={href}>{content}</Link>
  ) : (
    <Box onClick={onClick}>{content}</Box>
  )
}

const Settings: NextPage = () => {
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/settings/account'

  const handleDelete = async () => {
    if (!confirm('このアカウントを削除しますか？')) return
    try {
      await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid'),
        },
      })

      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')

      setSnackbar({
        message: 'ユーザーを削除しました',
        severity: 'success',
        pathname: '/',
      })
      router.push('/')
    } catch (e) {
      const err = e as AxiosError<{ errors: string[] }>
      console.error(err.message)

      setSnackbar({
        message: 'ユーザーの削除に失敗しました。',
        severity: 'error',
        pathname: '/current/settings',
      })
    }
  }

  return (
    <Box
      sx={{
        pt: 10,
        minHeight: '100vh',
        backgroundColor: '#eaede5ff',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, pt: 4 }}>
          <Link href="/current/books">
            <Tooltip title={'トップページに戻る'}>
              <IconButton sx={{ backgroundColor: '#ffffff' }}>
                <ChevronLeftIcon sx={{ color: '#99AAB6' }} />
              </IconButton>
            </Tooltip>
          </Link>
          <Typography
            component="h2"
            sx={{
              fontSize: 32,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            ユーザー設定
          </Typography>
        </Box>
        <SettingItem
          href="/current/settings/email"
          icon={<EmailIcon sx={{ color: '#A3B18A' }} />}
          label="メールアドレスの変更"
        />
        <SettingItem
          href="/current/settings/password"
          icon={<LockIcon sx={{ color: '#A3B18A' }} />}
          label="パスワードの変更"
        />
        <SettingItem
          href="/current/settings/name"
          icon={<PersonIcon sx={{ color: '#A3B18A' }} />}
          label="ユーザー名の変更"
        />
        <SettingItem
          onClick={handleDelete}
          icon={<DeleteIcon sx={{ color: '#cc6666' }} />}
          label="アカウントの削除"
          color="#cc6666"
        />
      </Container>
    </Box>
  )
}

export default Settings
