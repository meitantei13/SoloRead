import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Container,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbarState } from '@/hooks/useGlobalState'

type ResetPasswordData = {
  password: string
  passwordConfirmation: string
}

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()

  const { control, handleSubmit, watch } = useForm<ResetPasswordData>({
    defaultValues: { password: '', passwordConfirmation: '' },
  })

  const password = watch('password')

  // URLパラメータから認証情報を取得
  const accessToken = router.query['access-token'] as string | undefined
  const client = router.query['client'] as string | undefined
  const uid = router.query['uid'] as string | undefined

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/password'

    try {
      await axios.put(
        url,
        {
          password: data.password,
          password_confirmation: data.passwordConfirmation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'access-token': accessToken,
            client: client,
            uid: uid,
          },
        },
      )

      setSnackbar({
        message: 'パスワードを更新しました',
        severity: 'success',
        pathname: '/sign_in',
      })
      router.push('/sign_in')
    } catch (e) {
      const err = e as AxiosError<{ errors: string[] }>
      console.error(err.message)

      setSnackbar({
        message: 'パスワードの更新に失敗しました',
        severity: 'error',
        pathname: '/reset_password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validationRules = {
    password: {
      required: 'パスワードを入力してください。',
      minLength: {
        value: 6,
        message: 'パスワードは6文字以上で入力してください。',
      },
    },
    passwordConfirmation: {
      required: 'パスワード（確認）を入力してください',
      validate: (value: string) =>
        value === password || 'パスワードが一致しません。',
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
              パスワードの更新
            </Typography>
          </Box>
          <Controller
            name="password"
            control={control}
            rules={validationRules.password}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                placeholder="新しいパスワード"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                sx={{ backgroundColor: 'white', mb: 3 }}
              />
            )}
          />
          <Controller
            name="passwordConfirmation"
            control={control}
            rules={validationRules.passwordConfirmation}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                placeholder="新しいパスワード（確認）"
                fullWidth
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
              mt: 3,
            }}
          >
            更新
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}

export default ResetPassword
