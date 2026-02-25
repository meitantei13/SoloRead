import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { PieChartIcon } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function GenreChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [mode, setMode] = useState<"yearly" | "monthly">("yearly");

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const yearUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    `/current/analytics/genre_counts?year=${year}`;
  const monthUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    `/current/analytics/genre_counts?year=${year}&month=${month}`;

  const handlePrevMonth = () => {
    if (month === 1) {
      (setMonth(12), setYear((y) => y - 1));
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      (setMonth(1), setYear((y) => y + 1));
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleMode = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "yearly" | "monthly" | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const url = mode === "yearly" ? yearUrl : monthUrl;

  const { data, error } = useSWR(url, fetcher, { keepPreviousData: true });
  if (error) return <p>データの取得に失敗しました</p>;
  if (!data) return <p>読み込み中・・・</p>;

  const genreColors: Record<string, string> = {
    小説: "#9FD1CE",
    エッセイ: "#E0A472",
    自己啓発: "#B5C9A1",
    ビジネス: "#82A3D6",
    専門書: "#D49393",
    漫画: "#E0D174",
    趣味: "#B294C9",
    その他: "#C0C0C0",
    未分類: "#D6D6D6",
  };

  // ユーザージャンルの文字でカラーを決める
  const generateColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360; // 0〜359 の範囲に収める（色相）
    return `hsl(${h}, 55%, 65%)`; // その数値を色に変換
  };

  const pieData = data.counts
    .map((c: { genre: string; count: number }) => ({
      value: c.count,
      label: c.genre,
      color: genreColors[c.genre] || generateColor(c.genre),
    }))
    // count の大きい順に並び替え
    .sort((a: { value: number }, b: { value: number }) => b.value - a.value);

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #e0e6d6",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PieChartIcon size={22} color="#8B6CC1" />
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold", color: "#333" }}
            >
              ジャンル別割合
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleMode}
            aria-label="表示切り替え"
            sx={{ mr: 3.5 }}
          >
            <ToggleButton size="small" value="yearly" aria-label="年表示">
              年別
            </ToggleButton>
            <ToggleButton size="small" value="monthly" aria-label="月表示">
              月別
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() =>
              mode === "yearly" ? setYear((y) => y - 1) : handlePrevMonth()
            }
          >
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
            {mode === "yearly" ? `${year}年` : `${year}年${month}月`}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              mode === "yearly" ? setYear((y) => y + 1) : handleNextMonth()
            }
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </CardContent>
      {pieData.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "#999", py: 4 }}>
          この期間に読了した本はありません
        </Typography>
      ) : (
        <Box sx={{ pb: 2, px: 2, maxWidth: 550, mx: "auto" }}>
          <PieChart
            series={[
              {
                data: pieData,
                arcLabel: (item) => `${item.value}`,
                valueFormatter: (item) => `${item.value}冊`,
                arcLabelRadius: "65%",
              },
            ]}
            height={isSmall ? 200 : 300}
          />
        </Box>
      )}
    </Card>
  );
}
