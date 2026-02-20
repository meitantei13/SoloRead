import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import useSWR from "swr";
import { useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/lib/fetcher";

type Tag = {
  id: number;
  name: string;
  isDefault: boolean;
};

type TagSelectProps = {
  selectedTagId: number | "unset" | null;
  onTagChange: (tagId: number | "unset" | null) => void;
};

export default function TagSelect({
  selectedTagId,
  onTagChange,
}: TagSelectProps) {
  const [user] = useUserState();

  const tagUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/tags";
  const { data: tagsData } = useSWR(user.isSignedIn ? tagUrl : null, fetcher);
  const tags: Tag[] = tagsData || [];

  return (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel shrink sx={{ fontWeight: "bold" }}>
        タグ
      </InputLabel>
      <Select
        value={selectedTagId ?? ""}
        label="タグ"
        displayEmpty
        onChange={(e: SelectChangeEvent<number | string>) => {
          const value = e.target.value;
          if (value === "") {
            onTagChange(null);
          } else if (value === "unset") {
            onTagChange("unset");
          } else {
            onTagChange(Number(value));
          }
        }}
        sx={{ backgroundColor: "#fff" }}
      >
        <MenuItem value="">すべて</MenuItem>
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {tag.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
