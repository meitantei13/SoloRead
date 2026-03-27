class ChangeBookTitleComment < ActiveRecord::Migration[8.1]
  def change
    change_column_comment :books, :title, from: "タイトル", to: "書名"
  end
end
