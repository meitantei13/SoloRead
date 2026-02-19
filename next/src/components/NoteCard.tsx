import { Card, CardContent, Grid, Typography } from "@mui/material";

type TagProps = {
  id: number;
  name: string;
  isDefault: boolean;
};

type NoteCardProps = {
  content: string;
  createdAt: string;
  tags: TagProps[];
};

export default function NoteCard(props: NoteCardProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Card
        sx={{
          height: 120,
          width: "100%",
          backgroundColor: "#fff",
          border: "2px solid #c2d4a7",
          boxShadow: "none",
          borderRadius: "8px",
          position: "relative",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translate(2px, 2px)",
          },
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: 14,
              color: "#3D3D3D",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.content}
          </Typography>
          {props.tags.length > 0 && (
            <Typography
              sx={{
                fontSize: 12,
                color: "#856952",
                position: "absolute",
                left: 16,
                bottom: 10,
              }}
            >
              {props.tags.map((tag) => tag.name).join(", ")}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: 12,
              color: "#999",
              position: "absolute",
              right: 16,
              bottom: 10,
            }}
          >
            作成：{new Date(props.createdAt).toLocaleDateString("ja-JP")}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
