class ChangeUserIdToNotNullOnCategories < ActiveRecord::Migration[7.0]
  def change
    change_column_null :categories, :user_id, false
  end
end
