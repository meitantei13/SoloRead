class Api::V1::BooksController < ApplicationController
  before_action :authenticate_api_v1_user!
  include Pagination

  def index
    books = current_api_v1_user.books.
              where(status: :published).
              order(read_date: :desc).
              page(params[:page] || 1).
              per(10)
    render json: books, meta: pagination(books), adapter: :json
  end

  def show
    book = current_api_v1_user.books.find_by!(id: params[:id], status: :published)
    render json: book
  end
end
# routes.rbを削除するなら一緒に削除
