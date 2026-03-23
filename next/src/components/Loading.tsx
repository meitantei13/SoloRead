import { Box } from "@mui/material";
import Image from "next/image";
import { styles } from "@/styles";

export default function Loading() {
  return (
    <Box
      sx={{
        ...styles.pageMinHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src="/loading.svg"
        width={150}
        height={150}
        alt="loading・・・"
        priority
      />
    </Box>
  );
}
