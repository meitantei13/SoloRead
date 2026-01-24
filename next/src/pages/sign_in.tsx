import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useGlobalState'

type SignInFormData = {
  email: string
  password: string
}

const SignIn: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const { handleSubmit, control } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
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
  }

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/sign_in'

    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      localStorage.setItem('access-token', res.headers['access-token'])
      localStorage.setItem('client', res.headers['client'])
      localStorage.setItem('uid', res.headers['uid'])

      setSnackbar({
        message: 'サインインに成功しました',
        severity: 'success',
        pathname: '/current/books',
      })
      router.push('/current/books')
    } catch (e) {
      const err = e as AxiosError<{ error: string }>
      console.error(err.message)

      setSnackbar({
        message: '登録ユーザーが見つかりません',
        severity: 'error',
        pathname: '/sign_in',
      })
    } finally {
      setIsLoading(false)
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
          <Link href="/">
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
            ログイン
          </Typography>
        </Box>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
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
                sx={{ backgroundColor: 'white' }}
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
                sx={{ backgroundColor: 'white' }}
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
            }}
          >
            送信する
          </LoadingButton>
          <Box sx={{ textAlign: "center" }}>
            <Link
              href="/forgot_password"
              style={{ color: "#666", textDecoration: "underline"}}
            >
              パスワードを忘れた方はこちら
            </Link>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default SignIn
