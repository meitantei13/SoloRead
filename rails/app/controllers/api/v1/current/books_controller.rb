class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    unsaved_book = current_user.books.unsaved.first || current_user.books.create!(status: :unsaved)
    render json: unsaved_book
  end
end
