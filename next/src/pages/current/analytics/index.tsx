import { Box, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import Sidebar from "@/components/Sidebar";
import SummaryCard from "@/components/SummaryCard";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";

export default function Analytics() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + "/current/analytics/summary";
  const { data: summaryData, error } = useSWR(url, fetcher);

  if (error) return <p>データの取得に失敗しました</p>;
  if (!summaryData) return <p>読み込み中・・・</p>;

  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Typography
        sx={{
          textAlign: "center",
          pt: 7,
          mb: 4,
          fontWeight: "bold",
          fontSize: 28,
        }}
      >
        統計＆分析
      </Typography>
      <Box
        sx={{
          display: "flex",
          maxWidth: { md: "700px", lg: "1140px" },
          mx: "auto",
        }}
      >
        <Sidebar
          drawerOpen={drawerOpen}
          onToggle={handleDrawerToggle}
          desktopMt={0}
          showCounts={false}
        />
        <Box sx={{ flex: 1, px: { xs: 2, sm: 6 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <SummaryCard
              finished_this_month={summaryData.finished_this_month}
              finished_this_year={summaryData.finished_this_year}
              total_count={summaryData.total_count}
              monthly_average={summaryData.monthly_average}
            />
          </Box>

          {/* 今後ここにグラフ等を追加 */}
        </Box>
      </Box>
    </Box>
  );
}
