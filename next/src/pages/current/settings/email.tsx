import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Container,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useGlobalState'

type ChangeEmailData = {
  email: string
}

const ChangeEmail: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const { control, handleSubmit } = useForm<ChangeEmailData>({
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ChangeEmailData) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/settings/email'

    try {
      await axios.post(
        url,
        { email: data.email },
        {
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid'),
          },
        },
      )

      setSnackbar({
        message: '承認メールを送信しました',
        severity: 'success',
        pathname: '/current/settings/email',
      })
    } catch (e) {
      const err = e as AxiosError<{ errors: string[] }>
      console.error(err.message)

      setSnackbar({
        message: '承認メールの送信に失敗しました',
        severity: 'error',
        pathname: '/current/settings/email',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validationRules = {
    email: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください。',
      },
    },
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
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 4, pt: 4 }}>
            <Link href="/current/settings">
              <Tooltip title={'ユーザー設定に戻る'}>
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
              メールアドレスの変更
            </Typography>
          </Box>
          <Controller
            name="email"
            control={control}
            rules={validationRules.email}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                placeholder="メールアドレス"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ backgroundColor: 'white', mb: 3 }}
              />
            )}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#8F9D77',
              },
              mt: 3,
            }}
          >
            メール認証に進む
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}

export default ChangeEmail
