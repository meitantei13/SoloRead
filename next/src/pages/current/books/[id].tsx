import { Box, Container, Typography } from '@mui/material'
import Error from 'next/error'
import Loading from '@/components/Loading'

type BookProps = {
  title: string
  author: string
  content: string
  read_date: string
  user: {
    name: string
  }
}

return (
  <Box>
    <Typography> {title}</Typography>
    <Typography> {author}</Typography>
    <Typography> {read_date}</Typography>
    <Typography> {content}</Typography>
  </Box>
)
