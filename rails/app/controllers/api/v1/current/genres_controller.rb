class Api::V1::Current::GenresController < Api::V1::BaseController
  def index
    genres = Genre.where(is_default: true).or(Genre.where(user: current_user))
    render json: genres
  end

  def create
    genre = current_user.genres.create!(genre_params)
    render json: genre
  end

  private

    def genre_params
      params.expect(genre: [:name])
    end
end
