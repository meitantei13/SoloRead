class GuestSampleDataService
  include GuestSampleData

  def self.create_for(user)
    today = Time.zone.today
    books = GuestSampleData::BookSamples::DATA.dup

    ActiveRecord::Base.transaction do
      create_this_month_books(user, today, 2, books)
      create_this_year_books(user, today, 5, books)
      create_last_year_books(user, today, 13, books)
      create_draft_books(user)
    end
  end

  # 今月読了済のデータを作成
  def self.create_this_month_books(user, today, count, books)
    books.shift(count).each do |book_sample|
      create_finished_book(
        user,
        book_sample,
        Faker::Date.between(from: today.beginning_of_month, to: today),
      )
    end
  end

  # 今年読了済のデータを作成
  def self.create_this_year_books(user, today, count, books)
    return if today.month == 1

    books.shift(count).each do |book_sample|
      create_finished_book(
        user,
        book_sample,
        Faker::Date.between(
          from: today.beginning_of_year,
          to: today.beginning_of_month - 1,
        ),
      )
    end
  end

  # 去年読了済のデータを作成
  def self.create_last_year_books(user, today, count, books)
    from = (today - 1.year).beginning_of_year
    to   = (today - 1.year).end_of_year

    books.shift(count).each do |book_sample|
      create_finished_book(
        user,
        book_sample,
        Faker::Date.between(from: from, to: to),
      )
    end
  end

  # 読書中データを3件作成
  def self.create_draft_books(user)
    GuestSampleData::DraftSamples::DATA.each do |sample|
      genre = Genre.find_by(name: sample[:genre], is_default: true)
      Book.create!(
        user: user,
        title: sample[:title],
        author: sample[:author],
        genre: genre,
        status: :reading,
      )
    end
  end

  def self.create_finished_book(user, book_data, read_date)
    genre = Genre.find_by(name: book_data[:genre], is_default: true)
    Book.create!(
      user: user,
      title: book_data[:title],
      author: book_data[:author],
      content: book_data[:content],
      genre: genre,
      read_date: read_date,
      status: :finished,
    )
  end
end
