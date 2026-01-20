class AddDefaultGenres < ActiveRecord::Migration[7.1]
  def up
    default_genres = %w[小説 エッセイ 自己啓発 ビジネス 専門書 漫画 趣味 その他]
    default_genres.each do |genre_name|
      Genre.find_or_create_by!(name: genre_name, is_default: true)
    end
  end

  def down
    Genre.where(is_default: true).destroy_all
  end
end
