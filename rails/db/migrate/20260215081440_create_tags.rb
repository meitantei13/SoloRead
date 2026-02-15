class CreateTags < ActiveRecord::Migration[8.1]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.references :user, null: true, foreign_key: true
      t.boolean :is_default, default: false, null: false

      t.timestamps
    end
    
    add_index :tags, [:name, :user_id], unique: true
  end
end
