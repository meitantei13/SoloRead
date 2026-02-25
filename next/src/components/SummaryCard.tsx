import { Box, Typography } from "@mui/material";
import { Book, BookCopy, CalendarDays, LibraryBig } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
};

type SummaryCardProps = {
  finished_this_month: number;
  finished_this_year: number;
  total_count: number;
  monthly_average: number;
};

const StatCard = ({ label, value, unit, icon }: StatCardProps) => (
  <Box
    sx={{
      backgroundColor: "#fff",
      border: "1px solid #e0e6d6",
      borderRadius: 2,
      p: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box sx={{ flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontSize: 13, color: "#666" }}>{label}</Typography>
      <Typography sx={{ fontSize: 28, fontWeight: "bold" }}>
        {value}
        <Typography component="span" sx={{ fontSize: 14, ml: 0.5 }}>
          {unit}
        </Typography>
      </Typography>
    </Box>
  </Box>
);
export default function SummaryCard(props: SummaryCardProps) {
  return (
    <>
      <StatCard
        label="今月の読了数"
        value={props.finished_this_month}
        unit="冊"
        icon={<Book size={40} color="#333" />}
      />
      <StatCard
        label="今年の読了数"
        value={props.finished_this_year}
        unit="冊"
        icon={<BookCopy size={40} color="#333" />}
      />
      <StatCard
        label="総読了数"
        value={props.total_count}
        unit="冊"
        icon={<LibraryBig size={40} color="#333" />}
      />
      <StatCard
        label="月平均読了数"
        value={props.monthly_average}
        unit="冊"
        icon={<CalendarDays size={40} color="#333" />}
      />
    </>
  );
}
