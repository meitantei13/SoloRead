import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Target } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import GenreChar from "@/components/GenreChart";
import GoalDialog from "@/components/GoalDialog";
import MonthlyChart from "@/components/MonthlyChart";
import Sidebar from "@/components/Sidebar";
import SummaryCard from "@/components/SummaryCard";
import { useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/lib/fetcher";
import { styles } from "@/styles";

export default function Analytics() {
  const [user] = useUserState();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + "/current/analytics/summary";
  const { data: summaryData, error } = useSWR(url, fetcher);

  if (error) return <p>データの取得に失敗しました</p>;
  if (!summaryData) return <p>読み込み中・・・</p>;

  const finished = summaryData.finished_this_year;
  const goal = user.yearly_reading_goal;
  const progress = goal ? Math.round((finished / goal) * 100) : 0;

  return (
    <Box sx={{ ...styles.pageMinHeight, backgroundColor: "secondary.main" }}>
      <Typography
        sx={{
          textAlign: "center",
          pt: 7,
          mb: 4,
          fontWeight: "bold",
          fontSize: 28,
          color: "#333",
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
        <Box sx={{ flex: 1, px: { xs: 2, sm: 6 }, pb: 6 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <SummaryCard
              finished_this_month={summaryData.finished_this_month}
              finished_this_year={summaryData.finished_this_year}
              total_count={summaryData.total_count}
              monthly_average={summaryData.monthly_average}
            />
          </Box>
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
                <Target size={22} color="#D4915E" />
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold", color: "#333" }}
                >
                  年間読書目標
                </Typography>
              </Box>
              {goal ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: "#666" }}>
                      達成率：
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "#D4915E",
                        }}
                      >
                        {progress}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ fontSize: 14, color: "#666", ml: 0.3 }}
                      >
                        %
                      </Typography>
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#999" }}>
                      {finished} / {goal} 冊
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(progress, 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#f0e0d0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#D4915E",
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography sx={{ fontSize: 14, color: "#999", mb: 1 }}>
                  目標を設定して、読書の進捗を可視化しましょう
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontSize: 16,
                    borderRadius: 2,
                    boxShadow: "none",
                    color: "#A3B18A",
                    border: "1.5px solid #A3B18A",
                    "&:hover": {
                      border: "1.5px solid #A3B18A",
                      backgroundColor: "#A3B18A",
                      color: "#fff",
                    },
                  }}
                >
                  {goal ? "目標を変更" : "目標を登録"}
                </Button>
              </Box>
              <GoalDialog
                open={open}
                onClose={() => setOpen(false)}
                userId={summaryData.id}
              />
            </CardContent>
          </Card>
          <Box sx={{ mt: 5 }}>
            <MonthlyChart />
          </Box>
          <Box sx={{ mt: 5 }}>
            <GenreChar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
