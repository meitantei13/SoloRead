import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import NoteDialog from "./NoteDialog";

type TagProps = {
  id: number;
  name: string;
};

type NoteProps = {
  id: number;
  content: string;
  bookId: number;
  bookTitle: string;
  createdAt: string;
  tags: TagProps[];
};

type NoteDetailDialogProps = {
  note: NoteProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function NoteDetailDialog({
  note,
  onClose,
  onSuccess,
}: NoteDetailDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"info" | "error">("error");
  const [editOpetn, setEditOpen] = useState(false);

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/notes/";
  const handleDeleteNote = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    try {
      setIsLoading(true);
      await axios.delete(`${url}${note?.id}`, {
        headers: {
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });

      setSnackSeverity("info");
      setSnackMessage("ノートを削除しました");

      onSuccess();
      onClose();
      setIsLoading(false);
    } catch {
      setSnackSeverity("error");
      setSnackMessage("ノートの削除に失敗しました");
    }
  };

  return (
    <>
      <Dialog open={!!note} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 18 }}>
          ノート詳細
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: "2px solid #c2d4a7",
              borderRadius: "8px",
              backgroundColor: "#fff",
              p: 3,
            }}
          >
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: 15,
                color: "#3D3D3D",
                lineHeight: 1.8,
                minHeight: 80,
              }}
            >
              {note?.content}
            </Box>
            {note?.tags && note.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
                {note.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      borderColor: "#A3B18A",
                      backgroundColor: "#fff",
                      color: "#555",
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            <Typography
              sx={{
                fontSize: 13,
                color: "#999",
                mt: 3,
                textAlign: "right",
              }}
            >
              作成：
              {note?.createdAt &&
                new Date(note.createdAt).toLocaleDateString("ja-JP")}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteNote}
            loading={isLoading}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#e57373",
              color: "#e57373",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              fontSize: 12,
              minWidth: "auto",
              px: 1.5,
              height: 32,
              "&:hover": {
                borderColor: "#e57373",
                backgroundColor: "#e57373",
                color: "#fff",
              },
            }}
          >
            削除
          </Button>
          <Button
            onClick={() => setEditOpen(true)}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#A3B18A",
              color: "#A3B18A",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              fontSize: 12,
              minWidth: "auto",
              px: 1.5,
              height: 32,
              "&:hover": {
                borderColor: "#A3B18A",
                backgroundColor: "#A3B18A",
                color: "#fff",
              },
            }}
          >
            編集
          </Button>
          <Button
            onClick={onClose}
            sx={{
              color: "#999",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                color: "#666",
              },
            }}
          >
            閉じる
          </Button>
        </DialogActions>
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
      {note && (
        <NoteDialog
          open={editOpetn}
          onClose={() => setEditOpen(false)}
          bookId={note.bookId}
          onSuccess={() => {
            onSuccess();
            setEditOpen(false);
            onClose();
          }}
          editNote={{ id: note.id, content: note.content, tags: note.tags }}
        />
      )}
    </>
  );
}
