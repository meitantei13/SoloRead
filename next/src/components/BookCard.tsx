import { Box, Card, CardContent, Typography } from '@mui/material'

type BookCardProps = {
  title: string
  author: string
  readDate: string
}

// ログイン承認ができれば、コード変更(そもそも記事登録は空欄では不可)
//const omit = (text: string) => (len: number) => (ellipsis: string) => {
//if (!text) return ''
//return text.length >= len
//? text.slice(0, len - ellipsis.length) + ellipsis
//: text
//}

// ログイン承認が作成できれば上記コードを消して下記コードに変更
const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

const labelSx = { fontSize: 11, fontWeight: 'bold', color: '#555' }
const valueSx = {
  display: 'block',
  pl: 3,
  pt: 1,
  fontSize: 15,
}

const BookCard = (props: BookCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography
          component="h3"
          sx={{
            md: 2,
            minHeight: 48,
            lineHeight: 1.5,
          }}
        >
          <Box sx={{ labelSx }}>書名</Box>
          <Box sx={valueSx}>{omit(props.title)(45)('...')}</Box>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Typography
            component="h5"
            sx={{
              md: 2,
              minHeight: 48,
              lineHeight: 1.5,
            }}
          >
            <Box sx={{ labelSx }}>著者</Box>
            <Box sx={valueSx}>{omit(props.author)(12)('...')}</Box>
          </Typography>
          <Typography>
            <Box sx={{ labelSx }}>読了日</Box>
            <Box sx={valueSx}>{props.readDate}</Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BookCard
