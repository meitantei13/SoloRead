import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import useSWR from 'swr'
import { useUserState } from '@/hooks/useGlobalState'
import { fetcher } from '@/utils'

type Genre = {
  id: number
  name: string
}

type GenreSelectProps = {
  selectedGenreId: number | null
  onGenreChange: (genreId: number | null) => void
}

const GenreSelect = ({ selectedGenreId, onGenreChange }: GenreSelectProps) => {
  const [user] = useUserState()

  const genreUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/genres'
  const { data: genresData } = useSWR(
    user.isSignedIn ? genreUrl : null,
    fetcher,
  )
  const genres: Genre[] = genresData || []

  return (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel shrink sx={{ fontWeight: 'bold' }}>
        ジャンル
      </InputLabel>
      <Select
        value={selectedGenreId ?? ''}
        label="ジャンル"
        displayEmpty
        onChange={(e: SelectChangeEvent<number | string>) => {
          const value = e.target.value
          onGenreChange(value === '' ? null : Number(value))
        }}
        sx={{ backgroundColor: '#fff' }}
      >
        <MenuItem value="">すべて</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default GenreSelect
