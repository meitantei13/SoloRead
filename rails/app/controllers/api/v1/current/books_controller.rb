class Api::V1::Current::BooksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    books = current_user.books.includes(:genre).finished.order(read_date: :desc).limit(6)
    render json: books
  end

  def list
    books = current_api_v1_user.books.
              includes(:genre).
              where(status: :finished).
              order(read_date: :desc)

    if params[:q].present?
      books = books.where("title LIKE ? OR author LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%")
    end

    if params[:genre_id].present?
      books = if params[:genre_id] == "null"
                books.where(genre_id: nil)
              else
                books.where(genre_id: params[:genre_id])
              end
    end

    books = books.page(params[:page] || 1).per(10)

    render json: books, meta: pagination(books), adapter: :json
  end

  def reading
    books = current_api_v1_user.books.includes(:genre).where(status: :reading).order(read_date: :desc).page(params[:page] || 1).per(10)
    render json: books, meta: pagination(books), adapter: :json
  end

  def show
    book = current_user.books.includes(:genre).find(params[:id])
    render json: book
  end

  def create
    unsaved_book = current_user.books.includes(:genre).unsaved.first || current_user.books.create!(status: :unsaved)
    render json: unsaved_book
  end

  def update
    book = current_user.books.includes(:genre).find(params[:id])
    book.update!(book_params)
    render json: book
  end

  def counts
    user_books = current_user.books.finished
    render json: {
      finished_this_month: user_books.finished_this_month.count,
      finished_this_year: user_books.finished_this_year.count,
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
      params.require(:book).permit(:title, :author, :content, :read_date, :status, :genre_id)
    end
end
