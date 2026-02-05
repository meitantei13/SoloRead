class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    book = current_user.books.find(params[:id])
    render json: book
  end
end
