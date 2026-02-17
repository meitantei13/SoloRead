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

type NoteDialogProps = {
  open: boolean;
  onClose: () => void;
  bookId: number;
  onSuccess: () => void;
};

export default function NoteDialog({
  open,
  onClose,
  bookId,
  onSuccess,
}: NoteDialogProps) {
  const [noteContent, setNoteContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setNoteContent("");
    setErrorMessage("");
    onClose();
  };

  const noteUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/notes";

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
        noteUrl,
        { note: { content: noteContent, book_id: bookId } },
        { headers },
      );

      onSuccess();
      handleClose();
    } catch {
      setErrorMessage("ノートの作成に失敗しました");
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>ノートを追加</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="subscription-form">
          <TextField
            autoFocus
            required
            multiline
            value={noteContent}
            id="noteContent"
            name="noteContent"
            onChange={(e) => setNoteContent(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>戻る</Button>
        <Button type="submit" form="subscription-form">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
