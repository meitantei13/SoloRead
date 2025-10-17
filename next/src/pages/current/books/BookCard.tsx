import { Card, CardContent, Typography } from '@mui/material'

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

const BookCard = (props: BookCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography
          component="h3"
          sx={{
            md: 2,
            minHeight: 48,
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.title)(45)('...')}
        </Typography>
        <Typography
          component="h5"
          sx={{
            md: 2,
            minHeight: 48,
            fontSize: 12,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.author)(25)('...')}
        </Typography>
        <Typography sx={{ fontSize: 12 }}>{props.readDate}</Typography>
      </CardContent>
    </Card>
  )
}

export default BookCard
