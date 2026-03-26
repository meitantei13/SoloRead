import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

type BookCardProps = {
  title: string;
  author: string;
  readDate: string;
  genreName: string;
  imageUrl: string;
  coverImage: string;
};

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text;

const hoverSx = {
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translate(2px, 2px)",
    backgroundColor: "secondary.main",
  },
};
const labelSx = { fontSize: 19, fontWeight: "bold", color: "#856952" };
const valueSx = {
  display: "block",
  pl: 3,
  pt: 1,
  fontSize: 17,
  color: "#3D3D3D",
};

export default function BookCard(props: BookCardProps) {
  return (
    <Box sx={hoverSx}>
      <Card
        sx={{
          height: 175,
          width: "100%",
          maxWidth: 380,
          mx: "auto",
          position: "relative",
          border: "1px solid #e0e6d6",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 13,
            fontSize: 15,
            color: "#666",
            backgroundColor: "#f0f0f0",
            letterSpacing: "0.05em",
            px: 1,
            py: 0.3,
            borderRadius: "4px",
          }}
        >
          {props.genreName}
        </Box>
        <CardContent>
          <Box sx={{ display: "flex" }}>
            {(props.coverImage || props.imageUrl) && (
              <Box sx={{ mt: 1, mr: 2, flexShrink: 0 }}>
                <Image
                  src={props.coverImage || props.imageUrl}
                  alt={props.title}
                  width={90}
                  height={130}
                  style={{ objectFit: "cover" }}
                />
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography component="h1" sx={{ lineHeight: 1.5 }}>
                <Box sx={labelSx}>書名</Box>
                <Box sx={valueSx}>{omit(props.title)(12)("...")}</Box>
              </Typography>
              <Typography component="h5" sx={{ pt: 2 }}>
                <Box sx={labelSx}>著者</Box>
                <Box sx={valueSx}>{omit(props.author)(12)("...")}</Box>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
