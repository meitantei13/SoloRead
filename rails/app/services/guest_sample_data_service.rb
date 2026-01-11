class GuestSampleDataService
  def self.create_for(user)
    today = Time.zone.today

    ActiveRecord::Base.transaction do
      if today.month == 1
        create_january_sample(user, today)
      else
        create_normal_sample(user, today)
      end

      create_draft_books(user)
    end
  end

  # 1月
  def self.create_january_sample(user, today)
    create_this_month_books(user, today, 3)
    create_last_year_books(user, today, 10)
  end

  # 2月から12月
  def self.create_normal_sample(user, today)
    create_this_month_books(user, today, 2)
    create_this_year_books(user, today, 2)
    create_last_year_books(user, today, 9)
  end

  # 今月読了済のデータを2件作成
  def self.create_this_month_books(user, today, count)
    count.times do |_i|
      create_published_book(
        user,
        "サンプルタイトル",
        "感想サンプル",
        Faker::Date.between(from: today.beginning_of_month, to: today),
      )
    end
  end

  # 今年読了済のデータを2件作成（今月分とは別で）
  def self.create_this_year_books(user, today, count)
    count.times do |_i|
      create_published_book(
        user,
        "サンプルタイトル",
        "感想サンプル",
        Faker::Date.between(
          from: today.beginning_of_year,
          to: today.beginning_of_month - 1,
        ),
      )
    end
  end

  # 去年読了済のデータを9件作成
  def self.create_last_year_books(user, today, count)
    from = (today - 1.year).beginning_of_year
    to   = (today - 1.year).end_of_year

    count.times do |_i|
      create_published_book(
        user,
        "サンプルタイトル",
        "感想サンプル",
        Faker::Date.between(from: from, to: to),
      )
    end
  end

  # 下書きデータを3件作成
  def self.create_draft_books(user)
    3.times do |i|
      Book.create!(
        title: "下書きサンプル#{i + 1}",
        author: "テスト作家",
        status: :draft,
        user: user,
      )
    end
  end

  def self.create_published_book(user, title, content, read_date)
    Book.create!(
      title: title,
      author: "テスト作家",
      content: content,
      read_date: read_date,
      status: :published,
      user: user,
    )
  end
end
