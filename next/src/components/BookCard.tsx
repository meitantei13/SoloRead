import { Box, Card, CardContent, Typography } from '@mui/material'

type BookCardProps = {
  title: string
  author: string
  readDate: string
  genreName: string
}

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

const hoverSx = {
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translate(2px, 2px)',
    backgroundColor: 'secondary.main',
  },
}
const labelSx = { fontSize: 19, fontWeight: 'bold', color: '#856952' }
const valueSx = {
  display: 'block',
  pl: 3,
  pt: 1,
  fontSize: 17,
  color: '#3D3D3D',
}

const BookCard = (props: BookCardProps) => {
  return (
    <Box sx={hoverSx}>
      <Card sx={{ height: 175, width: 380, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 13,
            fontSize: 15,
            color: '#666',
            backgroundColor: '#f0f0f0',
            letterSpacing: '0.05em',
            px: 1,
            py: 0.3,
            borderRadius: '4px',
          }}
        >
          {props.genreName}
        </Box>
        <CardContent>
          <Typography
            component="h1"
            sx={{
              lineHeight: 1.5,
            }}
          >
            <Box sx={labelSx}>書名</Box>
            <Box sx={valueSx}>{omit(props.title)(19)('...')}</Box>
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
    </Box>
  )
}

export default BookCard
