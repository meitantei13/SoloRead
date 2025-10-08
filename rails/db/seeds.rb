ActiveRecord::Base.transaction do
  user1 = User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)

  15.times do |i|
    Book.create!(
      title: "サンプルタイトル#{ i + 1 }",
      author: "テスト作家#{ i + 1 }",
      content: "サンプル感想です#{ i + 1 }",
      read_date: Faker::Date.between(from: Date.today - 365, to: Date.today),
      status: :published,
      user: user1
      )
  end
end
