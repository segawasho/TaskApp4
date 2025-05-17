class ChangeUserIdToNotNullOnMemos < ActiveRecord::Migration[7.0]
  def change
    change_column_null :memos, :user_id, false
  end
end
