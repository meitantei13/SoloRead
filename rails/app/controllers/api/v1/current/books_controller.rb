class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    book = current_user.books.finished.order(read_date: :desc).limit(6)
    render json: book
  end

  def show
    book = current_user.books.find(params[:id])
    render json: book
  end
end
