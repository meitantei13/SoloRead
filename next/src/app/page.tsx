import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -10,
          backgroundImage: 'url("/back.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "#333631",
            p: 2,
          }}
        >
          Solo Read
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          心に残る一冊を、自分だけの本棚に。
          <br />
          Solo Readは、あなただけが開ける秘密の本棚です。
        </Typography>

        <Stack
          spacing={3}
          direction={{ xs: "column", sm: "row" }}
          sx={{ p: 4, alignItems: "center" }}
        >
          <Link href="/sign_in">
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: 140,
                height: 50,
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#8F9D77",
                },
              }}
            >
              ログイン
            </Button>
          </Link>
          <Link href="/sign_up">
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: 140,
                height: 50,
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#8F9D77",
                },
              }}
            >
              新規登録
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 140,
              height: 50,
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#8F9D77",
              },
            }}
          >
            ゲストログイン
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
