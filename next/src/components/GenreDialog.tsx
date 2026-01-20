import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'

type Genre = {
  id: number
  name: string
}

type GenreDialogProps = {
  open: boolean
  onClose: () => void
  onSuccess: (newGenre: Genre) => void
}

function GenreDialog({ open, onClose, onSuccess }: GenreDialogProps) {
  const [genreName, setGenreName] = useState('')

  const handleClose = () => {
    setGenreName('')
    onClose()
  }

  const genreUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/current/genres'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    }

    const response = await axios.post(
      genreUrl,
      { genre: { name: genreName } },
      { headers },
    )

    onSuccess(response.data)

    handleClose()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>追加したいジャンルを入力してください</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="subscription-form">
          <TextField
            autoFocus
            required
            value={genreName}
            id="genreId"
            name="genreName"
            onChange={(e) => setGenreName(e.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>戻る</Button>
        <Button type="submit" form="subscription-form">
          追加
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenreDialog
