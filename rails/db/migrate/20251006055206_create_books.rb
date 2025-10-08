class CreateBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :books do |t|
      t.string :title, comment: "本のタイトル"
      t.string :author, comment: "著者名"
      t.text :content, comment: "感想・メモ"
      t.date :read_date, comment: "読了日"
      t.integer :status, comment: "ステータス（10:未保存, 20:下書き, 30:投稿中）"
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
