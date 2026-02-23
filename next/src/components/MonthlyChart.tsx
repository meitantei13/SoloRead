import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function ManthlyChart() {
  const [year, setYear] = useState(new Date().getFullYear());

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    `/current/analytics/monthly_counts?year=${year}`;
  const { data, error } = useSWR(url, fetcher, { keepPreviousData: true });

  const months = data.counts.map((c: { month: number }) =>
    isSmall ? `${c.month}` : `${c.month}月`,
  );
  const values = data.counts.map((c: { count: number }) => c.count);

  if (error) return <p>データの取得に失敗しました</p>;
  if (!data) return <p>読み込み中・・・</p>;

  return (
    <Box>
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
              gap: 1.5,
              mb: 2,
            }}
          >
            <BarChart3 size={22} color="#4254FB" />
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold", color: "#333" }}
            >
              月別読了数
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={() => setYear((y) => y - 1)}>
              <ChevronLeft />
            </IconButton>
            <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
              {year}年
            </Typography>
            <IconButton onClick={() => setYear((y) => y + 1)}>
              <ChevronRight />
            </IconButton>
          </Box>
          <BarChart
            xAxis={[{ data: months, scaleType: "band" }]}
            yAxis={[
              {
                valueFormatter: (value: number | null) =>
                  value == null ? "" : `${Math.floor(value)}`,
              },
            ]}
            series={[{ data: values, label: "読了数" }]}
            height={300}
            margin={{ left: -20, right: 5 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
