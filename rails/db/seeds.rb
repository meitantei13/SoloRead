ActiveRecord::Base.transaction do
  # 本番・開発共通: デフォルトジャンルを作成
  default_genres = ["小説", "エッセイ", "自己啓発", "ビジネス", "専門書", "漫画", "趣味", "その他"]
  default_genres.each do |name|
    Genre.find_or_create_by!(name: name, is_default: true)
  end

  # 開発環境のみ: サンプルデータを作成
  if Rails.env.development?
    # ランダムにデフォルトジャンルを取得
    genres = Genre.where(is_default: true)

    user1 = User.find_or_create_by!(email: "test1@example.com") do |u|
      u.name = "テスト太郎"
      u.password = "password"
      u.confirmed_at = Time.current
    end
    user2 = User.find_or_create_by!(email: "test2@example.com") do |u|
      u.name = "テスト次郎"
      u.password = "password"
      u.confirmed_at = Time.current
    end

    15.times do |i|
      Book.find_or_create_by!(title: "テストタイトル1-#{i}", user: user1) do |b|
        b.author = "テスト著者1-#{i}"
        b.content = "テスト本文1-#{i}"
        b.genre = genres.sample
        b.read_date = rand(180).days.ago.to_date
        b.status = :finished
      end
      Book.find_or_create_by!(title: "テストタイトル2-#{i}", user: user2) do |b|
        b.author = "テスト著者2-#{i}"
        b.content = "テスト本文2-#{i}"
        b.genre = genres.sample
        b.read_date = rand(180).days.ago.to_date
        b.status = :finished
      end
    end
  end
end
