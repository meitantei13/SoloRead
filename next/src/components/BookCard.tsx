import { Box, Card, CardContent, Typography } from '@mui/material'

type BookCardProps = {
  title: string
  author: string
  readDate: string
}

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

const labelSx = { fontSize: 18, fontWeight: 'bold', color: '#856952' }
const valueSx = {
  display: 'block',
  pl: 3,
  pt: 1,
  fontSize: 15,
  color: '#3D3D3D',
}

const BookCard = (props: BookCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography
          component="h1"
          sx={{
            md: 2,
            minHeight: 50,
            lineHeight: 1.5,
          }}
        >
          <Box sx={labelSx}>書名</Box>
          <Box sx={valueSx}>{omit(props.title)(45)('...')}</Box>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Typography component="h5">
            <Box sx={labelSx}>著者</Box>
            <Box sx={valueSx}>{omit(props.author)(13)('...')}</Box>
          </Typography>
          <Typography component="h5">
            <Box sx={labelSx}>読了日</Box>
            <Box sx={valueSx}>{props.readDate}</Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BookCard
