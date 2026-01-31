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
  selectedGenreId: number | 'unset' | null
  onGenreChange: (genreId: number | 'unset' | null) => void
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
          if (value === '') {
            onGenreChange(null)
          } else if (value === 'unset') {
            onGenreChange('unset')
          } else {
            onGenreChange(Number(value))
          }
        }}
        sx={{ backgroundColor: '#fff' }}
      >
        <MenuItem value="">すべて</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
        <MenuItem value="unset">未設定</MenuItem>
      </Select>
    </FormControl>
  )
}

export default GenreSelect
