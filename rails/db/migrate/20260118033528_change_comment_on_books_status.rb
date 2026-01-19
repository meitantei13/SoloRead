class ChangeCommentOnBooksStatus < ActiveRecord::Migration[7.1]
  def change
    change_column_comment :books, :status, "ステータス（10:未保存, 20:読書中, 30:読了）"
  end
end
