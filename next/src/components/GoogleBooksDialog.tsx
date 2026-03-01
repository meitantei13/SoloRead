import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type GoogleBooksDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (book: BookDataProps) => void;
};

type BookDataProps = {
  title: string;
  author: string;
  image_url: string;
};

export default function GoogleBooksDialog({
  open,
  onClose,
  onSelect,
}: GoogleBooksDialogProps) {
  const [searchKey, setSearchKey] = useState("");
  const [books, setBooks] = useState<BookDataProps[]>([]);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"info" | "error">("error");
  const handleClose = () => {
    onClose();
    setBooks([]);
  };

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    `/current/books/search_google?q=${searchKey}`;

  const handleSearch = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(url, {
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        },
      });

      const data = await res.json();

      if (data.error) {
        setSnackSeverity("error");
        setSnackMessage(data.error);
        return;
      }

      setBooks(data.items);
    } catch (e) {
      console.error(e);

      setSnackSeverity("error");
      setSnackMessage("Google Books との通信に失敗しました");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>本を検索</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="タイトルを入力してください"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#8F9D77",
                },
                borderRadius: 1,
                px: 3,
                py: 1,
                mt: 1,
                textTransform: "none",
              }}
            >
              検索
            </Button>
          </Box>
          {books.map((book, index) => (
            <Card
              key={index}
              onClick={() => {
                onSelect(book);
                handleClose();
              }}
              sx={{
                mb: 2,
                backgroundColor: "#f9faf7",
                border: "1px solid #e0e6d6",
                boxShadow: "none",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", mt: 1.5 }}>
                  <Box>
                    {book.image_url && (
                      <Image
                        src={book.image_url}
                        alt={book.title}
                        width={100}
                        height={160}
                      />
                    )}
                  </Box>
                  <Box sx={{ ml: 4 }}>
                    <Box sx={{ mt: 1, mb: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        {book.title}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontSize: "13px", color: "#777", mt: 1 }}
                      >
                        {book.author}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!snackMessage}
        autoHideDuration={3000}
        onClose={() => setSnackMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackMessage("")}
          severity={snackSeverity}
          variant="standard"
          icon={false}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
