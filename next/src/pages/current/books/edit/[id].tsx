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
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { Button as ShadcnButton } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'
import { useRequireSginedIn } from '@/hooks/useRequireSignedIn'
import { styles } from '@/styles'
import { fetcher } from '@/utils'
import 'react-day-picker/style.css'

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

    const strictDateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (data.readDate && !strictDateRegex.test(data.readDate)) {
      return setSnackbar({
        message: '読了日は YYY-MM-DD の形式で入力してください',
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

    const pageChange =
      statusChecked === false ? '/current/books/drafts' : '/current/books/list'

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
          pathname: pageChange,
        })
        router.push(pageChange)
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.message)
        setSnackbar({
          message: '記事の保存に失敗しました',
          severity: 'error',
          pathname: '/current/books/edit/[id]',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (error) return <Error />
  if (!data || !isFetched) return <Loading />

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: 'secondary.main' }}>
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
            width: '100%',
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
                  sx={{
                    '& .Mui-checked': {
                      color: '#A3B18A', // スイッチの丸の色（オン時）
                    },
                    '& .Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#98ad76ff', // バーの色（オン時）
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#ccc', // オフ時のバーの色
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#333', fontSize: '0.85rem' }}
                >
                  下書き / 投稿中
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={isLoading}
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#8F9D77',
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
              render={({ field, fieldState }) => {
                const selectedDate = field.value
                  ? new Date(field.value)
                  : undefined

                const displayDate = selectedDate ?? new Date()

                return (
                  <Box>
                    <Popover>
                      <PopoverTrigger asChild>
                        <ShadcnButton
                          variant="outline"
                          className={`
                            w-full justify-start
                            border border-[#BDBDBD]
                            transition-none
                          hover:border-black
                          data-[state=open]:border-[#A3B18A]
                            data-[state=open]:border-2
                          `}
                          style={{
                            backgroundColor: 'white',
                            padding: '16.5px 14px',
                            height: '56px',
                            borderRadius: '4px',
                            textAlign: 'left',
                            color: selectedDate ? '#1f1f1f' : '#8a8a8a',
                            fontSize: '15px',
                            fontFamily: 'inherit',
                            letterSpacing: '0.03em',
                            width: '100%',
                          }}
                        >
                          {selectedDate
                            ? format(selectedDate, 'yyyy年M月d日')
                            : '読了日を選択'}
                        </ShadcnButton>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[300px] p-0 shadow-none border-none"
                        align="start"
                        alignOffset={5}
                      >
                        <Calendar
                          mode="single"
                          selected={displayDate}
                          defaultMonth={displayDate}
                          locale={ja}
                          modifiersClassNames={{
                            today: 'no-today',
                          }}
                          onSelect={(selected) => {
                            if (!selected) return
                            // フォームに yyyy-MM-dd の文字列で渡す
                            field.onChange(format(selected, 'yyyy-MM-dd'))
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <Typography
                        color="error"
                        sx={{ mt: 1, fontSize: '0.8rem' }}
                      >
                        {' '}
                        {fieldState.error.message}{' '}
                      </Typography>
                    )}
                  </Box>
                )
              }}
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
