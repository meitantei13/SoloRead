class CreateGenres < ActiveRecord::Migration[8.1]
  def change
    create_table :genres do |t|
      t.string :name, null: false
      t.references :user, foreign_key: true, null: true
      t.boolean :is_default, default: false, null: false

      t.timestamps
    end

    # ユーザージャンルの重複防止（user_idがNULLでない場合のみ有効）
    add_index :genres, [:user_id, :name], unique: true
  end
end
