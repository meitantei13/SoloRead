import ChevronLefitIcon from '@mui/icons-material/ChevronLeft'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Typography,
  Switch,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'
import { useRequireSginedIn } from '@/hooks/useRequireSignedIn'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type BookProps = {
  title: string
  author: string
  readDate: string
  content: string
  status: string
}

type BookFormData = {
  title: string
  author: string
  readDate: string
  content: string
}

const CurrentBooksEdit: NextPage = () => {
  useRequireSginedIn()
  const router = useRouter()
  const [user] = useUserState()
  const [, setSnackbar] = useSnackbarState()
  const [statusChecked, setStatusChecked] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChangeStatusChecked = () => {
    setStatusChecked(!statusChecked)
  }

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/'
  const { id } = router.query
  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  )

  const book: BookProps = useMemo(() => {
    if (!data) {
      return {
        title: '',
        author: '',
        readDate: '',
        content: '',
        status: '',
      }
    }
    return {
      title: data.title == null ? '' : data.title,
      author: data.author == null ? '' : data.author,
      readDate: data.read_date == null ? '' : data.read_date,
      content: data.content == null ? '' : data.content,
      status: data.status,
    }
  }, [data])

  const { handleSubmit, control, reset } = useForm<BookFormData>({
    defaultValues: book,
  })

  useEffect(() => {
    if (data) {
      console.log(data)
      reset(book)
      setStatusChecked(book.status == '投稿中')
      setIsFetched(true)
    }
  }, [data, book, reset])

  const onSubmit: SubmitHandler<BookFormData> = (data) => {
    const isPublished = statusChecked

    if (data.title.trim() === '') {
      return setSnackbar({
        message: '記事の保存にはタイトルが必要です',
        severity: 'error',
        pathname: '/current/books/edit/[id]',
      })
    }

    if (isPublished && data.author.trim() === '') {
      return setSnackbar({
        message: '記事の保存には著者名が必要です',
        severity: 'error',
        pathname: '/current/books/edit/[id]',
      })
    }

    if (isPublished && data.readDate.trim() === '') {
      return setSnackbar({
        message: '記事の保存には読了日が必要です',
        severity: 'error',
        pathname: '/current/books/edit/[id]',
      })
    }

    setIsLoading(true)

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + '/current/books/' + id

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const status = statusChecked ? 'published' : 'draft'

    const patchData = {
      book: {
        title: data.title,
        author: data.author,
        read_date: data.readDate,
        content: data.content,
        status: status,
      },
    }

    axios({
      method: 'PATCH',
      url: patchUrl,
      data: patchData,
      headers: headers,
    })
      .then(() => {
        setSnackbar({
          message: '記事を保存しました',
          severity: 'success',
          pathname: '/current/books/edit/[id]',
        })
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: '記事の保存に失敗しました',
          severity: 'error',
          pathname: '/current/books/edit/[id]',
        })
      })
    setIsLoading(false)
  }

  if (error) return <Error />
  if (!data || !isFetched) return <Loading />

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#EDF2F7' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderTop: '0.5px solid #acbcc7',
        }}
      >
        <Box
          maxWidth="sm"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            mt: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link href={'/current/books/list'}>
              <Tooltip title="記事一覧に移動">
                <IconButton sx={{ backgroundColor: '#ffffff' }}>
                  <ChevronLefitIcon sx={{ color: '#99AAB6' }} />
                </IconButton>
              </Tooltip>
            </Link>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  mr: 3,
                }}
              >
                <Switch
                  checked={statusChecked}
                  onChange={handleChangeStatusChecked}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#333', fontSize: '0.85rem' }}
                >
                  下書き/投稿中
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                  sx={{
                    color: '#333',
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                    borderRadius: 1,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                  }}
                >
                  更新する
                </LoadingButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="本のタイトル"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="本の著者名"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
            <Controller
              name="readDate"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="読了日 ※YYYY-MM-DDの形式で入力してください"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder="本の感想"
                  multiline
                  fullWidth
                  rows={23}
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CurrentBooksEdit
