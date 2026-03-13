import { Box, Grid, Pagination, useMediaQuery, useTheme } from "@mui/material";
import camelcaseKeys from "camelcase-keys";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import BookCard from "@/components/BookCard";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";
import { useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";

type ListProps = {
  id: number;
  title: string | null;
  author: string | null;
  readDate: string | null;
  genreName: string | null;
  imageUrl: string | null;
  coverImage: string | null;
};

export default function ReadingList() {
  const [user] = useUserState();
  const router = useRouter();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const page = "page" in router.query ? Number(router.query.page) : 1;

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    "/current/books/reading?page=" +
    page;
  const { data, error } = useSWR(user.isSignedIn ? url : null, fetcher);
  if (error) return <Error />;
  if (!data) return <Loading />;

  const books = camelcaseKeys(data.books);
  const meta = camelcaseKeys(data.meta);
  const contentWidth = isLargeScreen ? "900px" : "460px";

  const handleChange = (_event: unknown, value: number) => {
    router.push("/current/books/reading?page=" + value);
  };

  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Box
        sx={{
          textAlign: "center",
          fontSize: 32,
          fontWeight: "bold",
          pt: 7,
          pb: 7,
        }}
      >
        読書中一覧
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
          desktopMt={-14}
        />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              px: { xs: 2, sm: 6 },
              width: { xs: "100%", lg: contentWidth },
              maxWidth: contentWidth,
            }}
          >
            <Grid container spacing={4}>
              {books.length > 0 ? (
                books.map((book: ListProps, i: number) => (
                  <Grid key={i} size={{ xs: 12, lg: 6 }}>
                    <Link href={"/current/books/" + book.id}>
                      <BookCard
                        title={book.title ?? ""}
                        author={book.author ?? ""}
                        readDate={book.readDate ?? ""}
                        genreName={book.genreName ?? ""}
                        imageUrl={book.imageUrl ?? ""}
                        coverImage={book.coverImage ?? ""}
                      />
                    </Link>
                  </Grid>
                ))
              ) : (
                <Box sx={{ textAlign: "center", width: "100%", py: 6 }}>
                  データがありません
                </Box>
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
