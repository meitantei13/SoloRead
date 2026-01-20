class AddGenreToBooks < ActiveRecord::Migration[7.1]
  def change
    add_reference :books, :genre, null: true, foreign_key: true
  end
end
