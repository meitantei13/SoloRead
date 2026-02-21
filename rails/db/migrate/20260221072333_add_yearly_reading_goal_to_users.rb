class AddYearlyReadingGoalToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :yearly_reading_goal, :integer
  end
end
