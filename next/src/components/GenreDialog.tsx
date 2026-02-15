import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

type Genre = {
  id: number;
  name: string;
};

type GenreDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (newGenre: Genre) => void;
};

export default function GenreDialog({
  open,
  onClose,
  onSuccess,
}: GenreDialogProps) {
  const [genreName, setGenreName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setGenreName("");
    setErrorMessage("");
    onClose();
  };

  const genreUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/genres";

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      client: localStorage.getItem("client"),
      uid: localStorage.getItem("uid"),
    };

    try {
      const response = await axios.post(
        genreUrl,
        { genre: { name: genreName } },
        { headers },
      );

      onSuccess(response.data);
      handleClose();
    } catch {
      setErrorMessage("同じ名前のジャンルは追加できません");
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>追加したいジャンルを入力してください</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="subscription-form">
          <TextField
            autoFocus
            required
            value={genreName}
            id="genreId"
            name="genreName"
            onChange={(e) => setGenreName(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>戻る</Button>
        <Button type="submit" form="subscription-form">
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
}
