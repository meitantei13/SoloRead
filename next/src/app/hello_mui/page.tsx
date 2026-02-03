"use client";

import { Button } from "@mui/material";

export default function HelloMui() {
  return (
    <>
      <Button variant="contained" sx={{ padding: "24px" }}>
        Button1
      </Button>
      <Button variant="outlined" sx={{ padding: "24px" }}>
        Button2
      </Button>
      <Button variant="contained" color="error" sx={{ padding: "24px" }}>
        Button3
      </Button>
    </>
  );
}
