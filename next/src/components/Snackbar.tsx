import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbarState } from "@/hooks/useGlobalState";

export default function SuccessSnackbar() {
  const router = useRouter();
  const pathname = router.pathname;
  const [snackbar, setSnackbar] = useSnackbarState();

  const open = snackbar.severity !== null && snackbar.pathname === pathname;

  const handleClose = (
    _event: unknown,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;

    setSnackbar({ message: null, severity: null, pathname: null });
  };

  if (!snackbar.severity) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ mt: "45px" }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        sx={{
          width: "100%",
          ...(snackbar.severity === "success" && {
            backgroundColor: "#E3F2FD",
            color: "#000",
          }),
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
