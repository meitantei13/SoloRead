import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v16-pagesRouter";
import CurrentUserFetch from "@/components/CurrentUserFetch";
import Header from "@/components/Header";
import SuccessSnackbar from "@/components/Snackbar";
import theme from "@/styles/theme";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CurrentUserFetch />
        <Header />
        <SuccessSnackbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppCacheProvider>
  );
}
