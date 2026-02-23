class Api::V1::Current::AnalyticsController < Api::V1::BaseController
  before_action :authenticate_user!

  def summary
    user_books = current_user.books.finished

    render json: {
      finished_this_month: user_books.finished_this_month.count,
      finished_this_year: user_books.finished_this_year.count,
      total_count: user_books.count,
      monthly_average: monthly_average(user_books),
    }
  end

  def monthly_counts
    year = params[:year].to_i
    year = Date.current.year if year <= 0

    books = current_user.books.finished.
              group_by_month(:read_date, range: Date.new(year, 1, 1)..Date.new(year, 12, 31), time_zone: "Tokyo").
              count

    counts = books.map do |date, count|
      { month: date.month, count: count }
    end

    render json: { year: year, counts: counts }
  end

  def genre_counts
    year = params[:year].to_i
    year = Date.current.year if year <= 0

    books = current_user.books.finished.where(read_date: date_range(year))

    counts = books.left_joins(:genre).group("genres.name").count

    data = counts.map do |genre_name, count|
      { genre: genre_name || "未分類", count: count }
    end
    render json: { year: year, month: params[:month]&.to_i, counts: data }
  end

  private

    def monthly_average(books)
      first_date = books.minimum(:read_date)
      return 0 if first_date.nil?

      months = ((Date.current.year * 12) + Date.current.month) -
               ((first_date.year * 12) + first_date.month) + 1
      (books.count.to_f / months).floor(1)
    end

    def date_range(year)
      if params[:month].present?
        month = params[:month].to_i
        start_date = Date.new(year, month, 1)
        end_date = start_date.end_of_month
        start_date..end_date
      else
        Date.new(year, 1, 1)..Date.new(year, 12, 31)
      end
    end
end
