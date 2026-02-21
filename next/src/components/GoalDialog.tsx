import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useUserState } from "@/hooks/useGlobalState";

type GoalDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: number;
};

export default function GoalDialog({ open, onClose, userId }: GoalDialogProps) {
  const [user, setUser] = useUserState();
  const [goal, setGoal] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"info" | "error">("error");
  const [snackMessage, setSnackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleClose = () => {
    onClose();
    setGoal("");
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/user";

    if (!goal) {
      setErrorMessage("数字を入力してください");
      return;
    }

    try {
      await axios.patch(
        url,
        { user: { yearly_reading_goal: goal } },
        {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        },
      );
      setUser({ ...user, yearly_reading_goal: Number(goal) });
      setSnackSeverity("info");
      setSnackMessage("保存に成功しました");

      handleClose();
    } catch {
      setSnackSeverity("error");
      setErrorMessage("保存に失敗しました");
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>目標設定</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="goal_form">
            <TextField
              placeholder="例：30"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">冊</InputAdornment>
                  ),
                },
              }}
              onChange={(e) => setGoal(e.target.value)}
              error={!!errorMessage}
              helperText={errorMessage}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="goal_form">
            登録
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
    </>
  );
}
