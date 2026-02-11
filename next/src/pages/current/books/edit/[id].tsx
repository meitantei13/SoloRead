import ChevronLefitIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios, { isAxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { useSnackbarState, useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";
import "dayjs/locale/ja";

type BookProps = {
  title: string;
  author: string;
  readDate: string;
  content: string;
  status: string;
  genreId: string;
};

type BookFormData = {
  title: string;
  author: string;
  readDate: string;
  content: string;
  genreId: string;
};

export default function CurrntBookEdit() {
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [statusChecked, setStatusChecked] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeStatusChecked = () => {
    setStatusChecked(!statusChecked);
  };

  const router = useRouter();
  const { id } = router.query;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/books/";
  const { data, error } = useSWR(
    user.isSignedIn && id ? url + id : null,
    fetcher,
  );
  const book: BookProps = useMemo(() => {
    if (!data) {
      return {
        title: "",
        author: "",
        readDate: "",
        content: "",
        status: "",
        genreId: "",
      };
    }
    return {
      title: data.title == null ? "" : data.title,
      author: data.author == null ? "" : data.author,
      readDate: data.read_date == null ? "" : data.read_date,
      content: data.content == null ? "" : data.content,
      status: data.status,
      genreId: data.genre_id == null ? "" : String(data.genre_id),
    };
  }, [data]);

  const { handleSubmit, control, reset } = useForm<BookFormData>({
    defaultValues: book,
  });

  useEffect(() => {
    if (data) {
      reset(book);
    }
  }, [data, book, reset]);

  const onSubmit: SubmitHandler<BookFormData> = async (data) => {
    const isFinished = statusChecked;

    if (data.title.trim() === "") {
      return setSnackbar({
        message: "記事の保存にはタイトルが必要です",
        severity: "error",
        pathname: "/current/books/edit/[id]",
      });
    }

    if (isFinished && data.author.trim() === "") {
      return setSnackbar({
        message: "記事の保存には著者名が必要です",
        severity: "error",
        pathname: "/current/books/edit/[id]",
      });
    }

    if (isFinished && data.readDate.trim() === "") {
      return setSnackbar({
        message: "記事の保存には読了日が必要です",
        severity: "error",
        pathname: "/current/books/edit/[id]",
      });
    }

    if (isFinished && data.content.trim() === "") {
      return setSnackbar({
        message: "記事の保存には本の感想が必要です",
        severity: "error",
        pathname: "/current/books/edit/[id]",
      });
    }

    setIsLoading(true);

    const patchUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/current/books/" + id;

    const headers = {
      "Content-Type": "application/json",
      "access-token": localStorage.getItem("access-token"),
      client: localStorage.getItem("client"),
      uid: localStorage.getItem("uid"),
    };

    const status = statusChecked ? "finished" : "reading";

    const patchData = {
      book: {
        title: data.title,
        author: data.author,
        read_date: data.readDate,
        content: data.content,
        status: status,
        genre_id: data.genreId ? Number(data.genreId) : null,
      },
    };

    const pageChange =
      statusChecked === false
        ? "/current/books/reading"
        : "/current/books/list";

    try {
      await axios.patch(patchUrl, patchData, { headers });

      setSnackbar({
        message: "記事を保存しました",
        severity: "success",
        pathname: pageChange,
      });

      router.push(pageChange);
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err.message);

        setSnackbar({
          message: "記事の保存に失敗しました",
          severity: "error",
          pathname: "/current/books/edit/[id]",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          borderTop: "0.5px solid #acbcc7",
        }}
      >
        <Box
          maxWidth="sm"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            mt: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
                    : "記事一覧に移動"
                }
              >
                <IconButton sx={{ backgroundColor: "#ffffff" }}>
                  <ChevronLefitIcon sx={{ color: "#99AAB6" }} />
                </IconButton>
              </Tooltip>
            </Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  mr: 3,
                }}
              >
                <Switch
                  checked={statusChecked}
                  onChange={handleChangeStatusChecked}
                  sx={{
                    "& .Mui-checked": {
                      color: "#A3B18A", // スイッチの丸の色（オン時）
                    },
                    "& .Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#98ad76ff", // バーの色（オン時）
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#ccc", // オフ時のバーの色
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#333", fontSize: "0.85rem" }}
                >
                  読書中 / 読了済
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={isLoading}
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
                  更新する
                </Button>
              </Box>
            </Box>
          </Box>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                placeholder="タイトル"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            )}
          />
          <Controller
            name="author"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                placeholder="著者名"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            )}
          />
          <Controller
            name="readDate"
            control={control}
            render={({ field, fieldState }) => {
              const selectedDate = field.value ? dayjs(field.value) : null;

              return (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ja"
                >
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(newValue.format("YYYY-MM-DD"));
                      } else {
                        field.onChange("");
                      }
                    }}
                    format="YYYY年M月D日"
                    label={selectedDate ? "" : "読了日を選択"}
                    slotProps={{
                      field: {
                        clearable: true,
                      },
                      textField: {
                        fullWidth: true,
                        error: fieldState.invalid,
                        helperText: fieldState.error?.message,
                        sx: {
                          backgroundColor: "white",
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "black",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#A3B18A",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#9e9e9e",
                          },
                        },
                      },
                      calendarHeader: {
                        format: "YYYY年 / M月",
                      },
                    }}
                  />
                </LocalizationProvider>
              );
            }}
          />
          <Controller
            name="genreId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                placeholder="ジャンル"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="text"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                placeholder="感想"
                fullWidth
                multiline
                rows={20}
                sx={{ backgroundColor: "white" }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
