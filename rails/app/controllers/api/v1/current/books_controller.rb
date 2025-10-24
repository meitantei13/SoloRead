class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    books = current_user.books.published.order(read_date: :desc)
    render json: books
  end

  def show
    book = current_user.books.find(params[:id])
    render json: book
  end

  def create
    unsaved_book = current_user.books.unsaved.first || current_user.books.create!(status: :unsaved)
    render json: unsaved_book
  end

  def update
    book = current_user.books.find(params[:id])
    book.update!(book_params)
    render json: book
  end

  def counts
    user_books = current_user.books
    render json: {
      this_month: user_books.where(read_date: Time.current.beginning_of_month..Time.current.end_of_month).count,
      this_year: user_books.where(read_date: Time.current.beginning_of_year..Time.current.end_of_year).count,
    }
  end

  private

    def book_params
      params.require(:book).permit(:title, :author, :content, :read_date, :status)
    end
end
