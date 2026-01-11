import { Box } from '@mui/material'
import { styles } from '@/styles'

const Loading = () => {
  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/loading.svg" width={150} height={150} alt="loading・・・" />
    </Box>
  )
}

export default Loading
