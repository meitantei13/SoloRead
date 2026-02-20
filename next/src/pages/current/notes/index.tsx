import {
  Box,
  Grid,
  Pagination,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import camelcaseKeys from "camelcase-keys";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Error from "@/components/Error";
import GenreSelect from "@/components/GenreSelect";
import Loading from "@/components/Loading";
import NoteCard from "@/components/NoteCard";
import Sidebar from "@/components/Sidebar";
import { useUserState } from "@/hooks/useGlobalState";
import { useRequireSginedIn } from "@/hooks/useRequireSignedIn";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";

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

export default function NoteList() {
  useRequireSginedIn();
  const [user] = useUserState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const [selectedTagId, setSelectedTagId] = useState<number | "unset" | null>(
    null,
  );

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);
    return () => clearTimeout(timer);
  }, [query]);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isMedium = useMediaQuery(theme.breakpoints.up("sm"));
  const note_page = isLarge ? 15 : isMedium ? 8 : 5;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/notes";
  let url = baseUrl + "?page=" + page + "&note_page=" + note_page;

  if (debounceQuery) {
    url += `&q=${encodeURIComponent(debounceQuery)}`;
  }

  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher);

  const meta = data ? camelcaseKeys(data.meta) : null;
  const handleChange = (_event: unknown, value: number) => {
    setPage(value);
  };

  if (error) return <Error />;
  if (!data) return <Loading />;

  const notes: NoteProps[] = camelcaseKeys(data.notes);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement, Event>) => {
    setQuery(e.target.value);
  };

  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Box
        sx={{
          textAlign: "center",
          fontSize: 32,
          fontWeight: "bold",
          pt: 7,
        }}
      >
        ノート一覧＆検索
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 5,
          mb: 8,
        }}
      >
        <TextField
          placeholder="ノートの内容で検索"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          sx={{
            width: "50%",
            maxWidth: "500px",
            backgroundColor: "#fff",
          }}
          slotProps={{ inputLabel: { shrink: false } }}
        />
        <GenreSelect
          selectedGenreId={selectedTagId}
          onGenreChange={setSelectedTagId}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          maxWidth: { md: "700px", lg: "1140px" },
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        <Sidebar
          drawerOpen={drawerOpen}
          onToggle={handleDrawerToggle}
          desktopMt={-10}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: { xs: "center", lg: "flex-start" },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: { xs: "560px", lg: "830px" } }}>
            <Grid container spacing={2}>
              {notes.length > 0 ? (
                notes.map((note: NoteProps) => (
                  <Grid key={note.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <NoteCard
                      content={note.content}
                      createdAt={note.createdAt}
                      tags={note.tags}
                      onClick={() => {}}
                    />
                  </Grid>
                ))
              ) : (
                <Typography>データがありません</Typography>
              )}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
