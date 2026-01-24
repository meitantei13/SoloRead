import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useSnackbarState } from '@/hooks/useGlobalState'
import { LoadingButton } from '@mui/lab'
import { Box, Container, IconButton, Link, Stack, TextField, Tooltip, Typography } from '@mui/material'
import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'


type ForgotPasswordData = {
    email: string
}

const ForgotPassword: NextPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [, setSnackbar] = useSnackbarState()

    const { control, handleSubmit } = useForm<ForgotPasswordData>({
        defaultValues: { email: "" },
    })

    const onSubmit = async (data: ForgotPasswordData) => {
        setIsLoading(true)
        const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/password"

        try {
            await axios.post(
                url,
                {
                    email: data.email,
                    redirect_url: process.env.NEXT_PUBLIC_FRONT_BASE_URL + "/reset_password",
                },
                {
                    headers: {
                        "Content-type": "application/json",
                        Accept: "application/json",
                    },
                },
            )


           setSnackbar({
            message: "パスワードリセット用のメールを送信しました",
            severity: "success",
            pathname: "/forgot_password",
           })
        } catch (e) {
            const err = e as AxiosError<{ errors: string[] }>
            console.error(err.message)

            setSnackbar({
                message: "メールの送信に失敗しました",
                severity: "error",
                pathname: "/forgot_password",
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
                                パスワードの再設定
                        </Typography>
                    </Box>
                    <Typography
                        align='center'
                        sx={{ mt:3, mb:6, whiteSpace: "pre-line", lineHeight: 2 }}
                    >
                        登録済みのメールアドレスを入力してください。
                        {"\n"}
                        パスワード再設定用のリンクをお送りします。
                    </Typography>
                    <Controller
                        name="email"
                        control={control}
                        rules={validationRules.email}
                        render={({ field, fieldState }) => (
                            <TextField 
                                {...field}
                                type="text"
                                placeholder="登録済みのメールアドレス"
                                fullWidth
                                sx={{ backgroundColor: "white" }}
                            />
                        )}
                    />
                    <LoadingButton
                        variant='contained'
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
                        送信
                    </LoadingButton>
                </Box>
            </Container>
        </Box>
    )
}

export default ForgotPassword