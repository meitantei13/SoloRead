import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState'

const CurrentUserFetch = () => {
  const [user, setUser] = useUserState()
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()

  const publicPages = ['/', '/sign_in', '/sign_up']
  const isPublicPages = publicPages.includes(router.pathname)

  useEffect(() => {
    if (user.isFetched) {
      return
    }

    if (user.isSignedIn || user.isFetched) {
      return
    }

    const token = localStorage.getItem('access-token')
    const client = localStorage.getItem('client')
    const uid = localStorage.getItem('uid')

    if (!token || !client || !uid) {
      setUser({
        id: 0,
        name: '',
        email: '',
        isSignedIn: false,
        isFetched: false,
      })
      return
    }

    const fetchUser = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/user'
        const res = await axios.get(url, {
          headers: {
            'Content-type': 'application/json',
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid'),
          },
        })

        setUser({
          ...res.data,
          isSignedIn: true,
          isFetched: true,
        })
      } catch (err) {
        localStorage.removeItem('access-token')
        localStorage.removeItem('client')
        localStorage.removeItem('uid')

        setUser({
          ...user,
          isFetched: true,
        })

        setSnackbar({
          message: 'ログインに失敗しました',
          severity: 'error',
          pathname: '/sign_in',
        })
      }
    }

    fetchUser()
    // 依存をすべて入れると無限ループになるため、ESLintの警告を無視
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicPages, user.isFetched])
  return null
}

export default CurrentUserFetch
