import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Card, CardContent, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPage } from 'next/types'

const hoverSx = {
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    backgroundColor: '#f5f5f5',
  },
}

type SettingItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  color?: string
}

const SettingItem = ({ href, icon, label, color = '#3D3D3D' }: SettingItemProps) => (
  <Link href={href}>
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
  </Link>
)

const Settings: NextPage = () => {
  return (
    <Box
      sx={{
        pt: 10,
        minHeight: '100vh',
        backgroundColor: '#eaede5ff',
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h2"
          sx={{
            fontSize: 28,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            pt: 4,
          }}
        >
          ユーザー設定
        </Typography>

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
          href="/current/settings/delete"
          icon={<DeleteIcon sx={{ color: '#cc6666' }} />}
          label="アカウントの削除"
          color="#cc6666"
        />
      </Container>
    </Box>
  )
}

export default Settings
