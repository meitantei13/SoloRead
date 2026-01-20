class Api::V1::Current::GenresController < Api::V1::BaseController
  before_action :authenticate_user!

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
      params.require(:genre).permit(:name)
    end
end
