import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";
import { useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/lib/fetcher";

type NoteDialogProps = {
  open: boolean;
  onClose: () => void;
  bookId: number;
  onSuccess: () => void;
};

type TagProps = {
  id: number;
  name: string;
  is_default: boolean;
};

export default function NoteDialog({
  open,
  onClose,
  bookId,
  onSuccess,
}: NoteDialogProps) {
  const [user] = useUserState();
  const [noteContent, setNoteContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [selectTagIds, setSelectTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");

  const handleClose = () => {
    setNoteContent("");
    setErrorMessage("");
    onClose();
    setShowTags(false);
    setSelectTagIds([]);
  };

  const handleTags = () => {
    setShowTags(!showTags);
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
        {
          note: {
            content: noteContent,
            book_id: bookId,
            tag_ids: selectTagIds,
          },
        },
        { headers },
      );

      onSuccess();
      handleClose();
    } catch {
      setErrorMessage("ノートの作成に失敗しました");
    }
  };

  const tagUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/tags";

  const { data: tagsData, mutate: mutateTags } = useSWR(
    user.isSignedIn && open ? tagUrl : null,
    fetcher,
  );

  const handleCreateTag = async () => {
    try {
      await axios.post(
        tagUrl,
        { tag: { name: newTagName } },
        {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        },
      );
      mutateTags();
      setNewTagName("");
    } catch {
      alert("タグの作成に失敗しました");
    }
  };

  const handleDeleteTag = async () => {
    try {
      await Promise.all(
        selectTagIds.map((id) =>
          axios.delete(`${tagUrl}/${id}`, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
              client: localStorage.getItem("client"),
              uid: localStorage.getItem("uid"),
            },
          }),
        ),
      );
      setSelectTagIds([]);
      mutateTags();
    } catch {
      alert("タグの削除に失敗しました");
    }
  };

  const tags: TagProps[] = tagsData || [];

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>ノートを追加</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="subscription-form">
          <TextField
            autoFocus
            required
            multiline
            minRows={6}
            fullWidth
            placeholder={
              "記録したい言葉を入力してください。\n\nタグを追加することで振り返りしやすくなります。"
            }
            value={noteContent}
            id="noteContent"
            name="noteContent"
            onChange={(e) => setNoteContent(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </form>
        {showTags && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#f9faf7",
              borderRadius: "8px",
              border: "1px solid #e0e6d6",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TextField
                placeholder="新しいタグ名"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    fontSize: 13,
                    height: 32,
                  },
                }}
              />
              <Button
                onClick={handleCreateTag}
                variant="outlined"
                size="small"
                disabled={!newTagName.trim()}
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
                    borderColor: "#8F9D77",
                    backgroundColor: "#f0f4eb",
                  },
                }}
              >
                追加
              </Button>
              <Button
                onClick={handleDeleteTag}
                variant="outlined"
                size="small"
                disabled={selectTagIds.length === 0}
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
                    borderColor: "#d32f2f",
                    backgroundColor: "#fce4ec",
                  },
                }}
              >
                削除
              </Button>
            </Box>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  onClick={() => {
                    setSelectTagIds((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id],
                    );
                  }}
                  variant={
                    selectTagIds.includes(tag.id) ? "filled" : "outlined"
                  }
                  sx={{
                    borderColor: "#A3B18A",
                    ...(selectTagIds.includes(tag.id)
                      ? {
                          backgroundColor: "#A3B18A",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#8F9D77" },
                        }
                      : {
                          backgroundColor: "#fff",
                          color: "#555",
                          "&:hover": { backgroundColor: "#f0f4eb" },
                        }),
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} sx={{ color: "#999" }}>
          戻る
        </Button>
        <Button
          onClick={handleTags}
          sx={{
            color: "#A3B18A",
            fontWeight: "bold",
          }}
        >
          {showTags ? "タグを閉じる" : "タグを追加"}
        </Button>
        <Button
          type="submit"
          form="subscription-form"
          variant="contained"
          sx={{
            backgroundColor: "#A3B18A",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 1,
            "&:hover": { backgroundColor: "#8F9D77" },
          }}
        >
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
