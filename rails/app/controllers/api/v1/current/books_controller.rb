class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    books = current_user.books.finished.order(read_date: :desc).limit(6)
    render json: books
  end

  def list
    books = current_api_v1_user.books.
              where(status: :finished).
              order(read_date: :desc)

    if params[:q].present?
      books = books.where("title LIKE ? OR author LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%")
      books = books.page(1).per(10)
    else
      books = books.page(params[:page] || 1).per(10)
    end

    render json: books, meta: pagination(books), adapter: :json
  end

  def reading
    books = current_api_v1_user.books.where(status: :reading).order(read_date: :desc).page(params[:page] || 1).per(10)
    render json: books, meta: pagination(books), adapter: :json
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
    user_books = current_user.books.finished
    render json: {
      this_month: user_books.this_month.count,
      this_year: user_books.this_year.count,
      total_count: user_books.count,
    }
  end

  def destroy
    book = current_user.books.find(params[:id])
    book.destroy!
    head :no_content
  end

  private

    def book_params
      params.require(:book).permit(:title, :author, :content, :read_date, :status)
    end
end
