import { LoadingButton } from '@mui/lab'
import { Box, Container, Stack, TextField, Typography } from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useGlobalState'

type SignUpData = {
  email: string
  password: string
  name: string
}

const SignUp: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const { handleSubmit, control } = useForm<SignUpData>({
    defaultValues: { email: '', password: '', name: '' },
  })

  const validationRules = {
    email: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value:
          /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: '正しい形式のメールアドレスを入力してください。',
      },
    },
    password: {
      required: 'パスワードを入力してください。',
      minLength: {
        value: 4,
        message: 'パスワードは4文字以上で入力してください。',
      },
    },
    name: {
      required: 'ユーザー名を入力してください',
    },
  }

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    try {
      setIsLoading(true)
      const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth'
      const confirmSuccessUrl =
        process.env.NEXT_PUBLIC_FRONT_BASE_URL + '/sign_in'

      const body = {
        ...data,
        confirm_success_url: confirmSuccessUrl,
      }

      await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setSnackbar({
        message: '承認メールをご確認ください',
        severity: 'success',
        pathname: '/sign_in',
      })
      router.push('/sign_in')
    } catch (e) {
      const err = e as AxiosError<{ error: string }>
      console.error(err.message)

      setSnackbar({
        message: 'ユーザー情報が正しく設定されていません',
        severity: 'error',
        pathname: '/sign_up',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: '#e38c8cff',
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, pt: 4 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: 32,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            新規ユーザー登録
          </Typography>
        </Box>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
          <Controller
            name="email"
            control={control}
            rules={validationRules.email}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                label="メールアドレス"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ background: 'white' }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={validationRules.password}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label="パスワード"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ background: 'white' }}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={validationRules.name}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                label="ユーザー名"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ background: 'white' }}
              />
            )}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
            sx={{ fontWeight: 'bold', color: 'white' }}
          >
            登録
          </LoadingButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default SignUp
