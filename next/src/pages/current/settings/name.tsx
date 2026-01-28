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
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'

type ChangeNameData = {
  name: string
}

const ChangeName: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [, setSnackbar] = useSnackbarState()
  const [user, setUser] = useUserState()

  const { control, handleSubmit } = useForm<ChangeNameData>({
    defaultValues: { name: '' },
  })

  const onSubmit = async (data: ChangeNameData) => {
    setIsLoading(true)
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/settings/name'

    try {
      await axios.patch(
        url,
        { name: data.name },
        {
          headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid'),
          },
        },
      )

      setUser({
        ...user,
        name: data.name,
      })

      setSnackbar({
        message: 'ユーザーネームを更新しました。',
        severity: 'success',
        pathname: '/current/settings',
      })
      router.push('/current/settings')
    } catch (e) {
      const err = e as AxiosError<{ errors: string[] }>
      console.error(err.message)

      setSnackbar({
        message: 'ユーザーネームの更新に失敗しました',
        severity: 'error',
        pathname: '/current/settings/name',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validationRules = {
    name: {
      required: 'ユーザー名を入力してください',
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
              ユーザーネームの変更
            </Typography>
          </Box>
          <Controller
            name="name"
            control={control}
            rules={validationRules.name}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                placeholder="新しいユーザーネーム"
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
            更新
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}

export default ChangeName
