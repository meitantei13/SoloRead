class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    unsaved_book = current_user.books.unsaved.first || current_user.books.create!(status: :unsaved)
    render json: unsaved_book
  end

  def update
    book = current_user.books.find(params[:id])
    book.update!(book_params)
    render json: book
  end

  private

    def book_params
      params.require(:book).permit(:title, :author, :content, :read_date, :status)
    end
end
