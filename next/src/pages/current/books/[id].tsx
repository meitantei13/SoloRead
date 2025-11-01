import ChevronLefitIcon from '@mui/icons-material/ChevronLeft'
import { Box, Card, Container, IconButton, Tooltip } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useUserState } from '@/hooks/useGlobalState'
import { useRequireSginedIn } from '@/hooks/useRequireSignedIn'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type CurrentBookProps = {
  title: string
  author: string
  content: string
  readDate: string
}

const CurrentBookDetail: NextPage = () => {
  useRequireSginedIn()
  const [user] = useUserState()
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/'
  const { id } = router.query

  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  )
  if (error) return <Error />
  if (!data) return <Loading />

  const fieldBoxSx = {
    padding: {
      xs: '0 24px 24px 24px',
      sm: '0 30px 20px 30px',
    },
    marginTop: '20px',
  }

  const labelSx = { fontSize: 14, fontWeight: 'bold', color: '#555' }
  const valueSx = {
    display: 'block',
    pl: 3,
    pt: 1,
    fontSize: 16,
    fontWeight: 'medium',
  }

  const book: CurrentBookProps = camelcaseKeys(data)

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        backgroundColor: '#EDF2F7',
      }}
    >
      <Box
        sx={{
          borderTop: '0.5px solid #acbcc7',
          color: '#6e7b85',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            pt: 3,
          }}
        >
          <Link href={'/current/books/list'}>
            <Tooltip title="記事一覧に移動">
              <IconButton sx={{ backgroundColor: '#ffffff' }}>
                <ChevronLefitIcon sx={{ color: '#99AAB6' }} />
              </IconButton>
            </Tooltip>
          </Link>
        </Container>
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100%',
            mt: 5,
          }}
        >
          <Card
            sx={{
              boxShadow: 'none',
              dorderRadius: '12px',
              maxWidth: 840,
              width: '100%',
            }}
          >
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: '1px solid #ccc',
              }}
            >
              <Box sx={labelSx}>書名</Box>
              <Box sx={valueSx}>{book.title}</Box>
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: '1px solid #ccc',
              }}
            >
              <Box sx={labelSx}>著者</Box>
              <Box sx={valueSx}>{book.author}</Box>{' '}
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: '1px solid #ccc',
              }}
            >
              <Box sx={labelSx}>読了日</Box>
              <Box sx={valueSx}>{book.readDate}</Box>
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
              }}
            >
              <Box sx={labelSx}>感想</Box>
              <Box sx={valueSx}>{book.content}</Box>{' '}
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}

export default CurrentBookDetail
