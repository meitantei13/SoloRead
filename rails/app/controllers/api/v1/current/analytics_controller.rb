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

  private

    def monthly_average(books)
      first_date = books.minimum(:read_date)
      return 0 if first_date.nil?

      months = ((Date.current.year * 12) + Date.current.month) -
               ((first_date.year * 12) + first_date.month) + 1
      (books.count.to_f / months).floor(1)
    end
end
