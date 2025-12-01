class AddIsGuestToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :is_guest, :boolean, default: false, null: false
  end
end
