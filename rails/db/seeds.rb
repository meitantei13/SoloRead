ActiveRecord::Base.transaction do
  user1 = User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)

  user2 = User.create!(name: "テスト次郎", email: "test2@example.com", password: "password", confirmed_at: Time.current)

  15.times do |i|
    Book.create!(title: "テストタイトル1-#{i}", author: "テスト著者1-#{i}", content: "テスト本文1-#{i}", read_date: rand(180).days.ago.to_date, status: :finished, user: user1)
    Book.create!(title: "テストタイトル2-#{i}", author: "テスト著者2-#{i}", content: "テスト本文2-#{i}", read_date: rand(180).days.ago.to_date, status: :finished, user: user2)
  end
end
