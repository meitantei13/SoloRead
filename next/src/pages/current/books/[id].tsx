import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import camelcaseKeys from "camelcase-keys";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useSWR from "swr";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import NoteCard from "@/components/NoteCard";
import NoteDetailDialog from "@/components/NoteDetailDialog";
import NoteDialog from "@/components/NoteDialog";
import { useUserState, useSnackbarState } from "@/hooks/useGlobalState";
import { useRequireSginedIn } from "@/hooks/useRequireSignedIn";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";

type CurrentBookProps = {
  id: number;
  title: string | null;
  author: string | null;
  content: string | null;
  readDate: string | null;
  status: string | null;
  genreName: string | null;
  imageUrl: string | null;
  coverImage: string | null;
};

type TagProps = {
  id: number;
  name: string;
  isDefault: boolean;
};

type NoteProps = {
  id: number;
  content: string;
  bookId: number;
  bookTitle: string;
  createdAt: string;
  tags: TagProps[];
};

const CurrentBookDetail = () => {
  useRequireSginedIn();
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteProps | null>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { id } = router.query;

  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/books/";

  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  );

  const [page, setPage] = useState(1);

  const notesUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/notes";
  const { data: notesData, mutate: mutateNotes } = useSWR(
    user.isSignedIn && id
      ? `${notesUrl}?book_id=${id}&page=${page}&note_page=10`
      : null,
    fetcher,
  );
  const meta = notesData ? camelcaseKeys(notesData.meta) : null;

  if (error) return <Error />;
  if (!data) return <Loading />;

  const handleDelete = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/books/${book.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            client: localStorage.getItem("client") || "",
            uid: localStorage.getItem("uid") || "",
          },
        },
      );

      if (!res.ok) throw new window.Error("削除失敗");

      const deleteStatus =
        book.status === "読書中"
          ? "/current/books/reading"
          : "/current/books/list";

      setSnackbar({
        message: "記事を削除しました",
        severity: "success",
        pathname: deleteStatus,
      });
      router.push(deleteStatus);
    } catch (error) {
      setSnackbar({
        message: "記事の削除に失敗しました",
        severity: "error",
        pathname: `/current/books/${book.id}`,
      });
    }
  };

  const fieldBoxSx = {
    padding: {
      xs: "0 24px 24px 24px",
      sm: "0 30px 20px 30px",
    },
    marginTop: "20px",
  };

  const labelSx = { fontSize: 14, fontWeight: "bold", color: "#555" };
  const valueSx = {
    display: "block",
    pl: 3,
    pt: 1,
    fontSize: 16,
    fontWeight: "medium",
  };

  const handleChange = (_event: unknown, value: number) => {
    setPage(value);
    notesSectionRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const book: CurrentBookProps = camelcaseKeys(data);
  const notes: NoteProps[] = notesData ? camelcaseKeys(notesData.notes) : [];

  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Box
        sx={{
          borderTop: "0.5px solid #acbcc7",
          pb: 7,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            pt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3.5,
            }}
          >
            <Link
              href={
                book.status === "読書中"
                  ? "/current/books/reading"
                  : "/current/books/list"
              }
            >
              <Tooltip
                title={
                  book.status === "読書中"
                    ? "読書中一覧に移動"
                    : "読了済一覧に移動"
                }
              >
                <IconButton sx={{ backgroundColor: "#ffffff" }}>
                  <ChevronLeftIcon sx={{ color: "#99AAB6" }} />
                </IconButton>
              </Tooltip>
            </Link>
            {(book.coverImage || book.imageUrl) && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Image
                  src={book.coverImage || book.imageUrl || ""}
                  alt="preview"
                  width={80}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </Box>
            )}
            <Box>
              <Link href={"/current/books/edit/" + book.id}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#8F9D77",
                    },
                    borderRadius: 1,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                  }}
                >
                  編集
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#8F9D77",
                  },
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  ml: 2,
                  textTransform: "none",
                }}
              >
                削除
              </Button>
            </Box>
          </Box>
        </Container>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            mt: 4,
          }}
        >
          <Card
            sx={{
              boxShadow: "none",
              dorderRadius: "12px",
              maxWidth: 840,
              width: "100%",
            }}
          >
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: "1px solid #e0e6d6",
              }}
            >
              <Box sx={labelSx}>書名</Box>
              <Box sx={valueSx}>{book.title}</Box>
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: "1px solid #e0e6d6",
              }}
            >
              <Box sx={labelSx}>著者</Box>
              <Box sx={valueSx}>{book.author}</Box>{" "}
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: "1px solid #e0e6d6",
              }}
            >
              <Box sx={labelSx}>ジャンル</Box>
              <Box sx={valueSx}>{book.genreName}</Box>{" "}
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                borderBottom: "1px solid #e0e6d6",
              }}
            >
              <Box sx={labelSx}>読了日</Box>
              <Box sx={valueSx}>{book.readDate}</Box>
            </Box>
            <Box
              sx={{
                ...fieldBoxSx,
                whiteSpace: "pre-wrap",
              }}
            >
              <Box sx={labelSx}>感想</Box>
              <Box sx={valueSx}>{book.content}</Box>{" "}
            </Box>
          </Card>
        </Container>
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Box
            ref={notesSectionRef}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 3,
              pb: 2,
            }}
          >
            <Typography sx={{ fontSize: 24, fontWeight: "bokd" }}>
              ノート
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: "bold",
                color: "#fff",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#8F9D77",
                },
              }}
              onClick={() => setOpen(true)}
            >
              新規作成
            </Button>
          </Box>
          <Grid container spacing={2}>
            {notes.map((note: NoteProps) => (
              <Grid key={note.id} size={{ xs: 12, sm: 6 }}>
                <NoteCard
                  onClick={() => setSelectedNote(note)}
                  content={note.content}
                  tags={note.tags}
                  createdAt={note.createdAt}
                />
              </Grid>
            ))}
          </Grid>
          {meta && meta.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <Pagination
                count={meta.totalPages}
                page={meta.currentPage}
                onChange={handleChange}
              />
            </Box>
          )}
          <NoteDialog
            open={open}
            onClose={() => setOpen(false)}
            bookId={book.id}
            onSuccess={() => mutateNotes()}
          />
          <NoteDetailDialog
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onSuccess={() => mutateNotes()}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default CurrentBookDetail;
