ActiveRecord::Base.transaction do
  # user1 = User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)
  user1 = User.find_by(email: "test1@example.com")

  15.times do |i|
    Book.create!(
      title: "サンプルタイトル#{i + 1}",
      author: "テスト作家#{i + 1}",
      content: "サンプル感想です#{i + 1}",
      read_date: Faker::Date.between(from: Time.zone.today - 365, to: Time.zone.today),
      status: :published,
      user: user1,
    )
  end

  15.times do |i|
    Book.create!(
      title: "下書きサンプルタイトル#{i + 1}",
      author: "テスト作家#{i + 1}",
      content: "サンプル感想です#{i + 1}",
      read_date: Faker::Date.between(from: Time.zone.today - 365, to: Time.zone.today),
      status: :draft,
      user: user1,
    )
  end
end
