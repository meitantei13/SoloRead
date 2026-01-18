class GuestSampleDataService
  include GuestSampleData

  def self.create_for(user)
    today = Time.zone.today
    books = GuestSampleData::BookSamples::DATA.dup

    ActiveRecord::Base.transaction do
      create_this_month_books(user, today, 2, books)
      create_this_year_books(user, today, 5, books)
      create_last_year_books(user, today, 9, books)
      create_draft_books(user)
    end
  end

  # 今月読了済のデータを作成
  def self.create_this_month_books(user, today, count, books)
    books.shift(count).each do |book_sample|
      create_published_book(
        user,
        book_sample[:title],
        book_sample[:author],
        book_sample[:content],
        Faker::Date.between(from: today.beginning_of_month, to: today),
      )
    end
  end

  # 今年読了済のデータを作成
  def self.create_this_year_books(user, today, count, books)
    return if today.month == 1

    books.shift(count).each do |book_sample|
      create_published_book(
        user,
        book_sample[:title],
        book_sample[:author],
        book_sample[:content],
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
      create_published_book(
        user,
        book_sample[:title],
        book_sample[:author],
        book_sample[:content],
        Faker::Date.between(from: from, to: to),
      )
    end
  end

  # 下書きデータを3件作成
  def self.create_draft_books(user)
    GuestSampleData::DraftSamples::DATA.each do |sample|
      Book.create!(
        user: user,
        title: sample[:title],
        author: sample[:author],
        status: :draft,
      )
    end
  end

  def self.create_published_book(user, title, author, content, read_date)
    Book.create!(
      user: user,
      title: title,
      author: author,
      content: content,
      read_date: read_date,
      status: :published,
    )
  end
end
