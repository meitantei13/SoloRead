import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#76f393ff',
    },
    secondary: {
      main: '#76a7ecff',
    },
    error: {
      main: red.A400,
    },
  },
})

export default theme
