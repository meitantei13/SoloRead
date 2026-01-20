class CreateGenres < ActiveRecord::Migration[7.1]
  def change
    create_table :genres do |t|
      t.string :name
      t.references :user, null: true, foreign_key: true
      t.boolean :is_default, default: false

      t.timestamps
    end
  end
end
