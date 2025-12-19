import axios, { isAxiosError } from 'axios'

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'access-token': localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        uid: localStorage.getItem('uid'),
      },
    })
    return res.data
  } catch (err) {
    if (isAxiosError(err)) {
      console.error(err.message)
    }
    throw err
  }
}
