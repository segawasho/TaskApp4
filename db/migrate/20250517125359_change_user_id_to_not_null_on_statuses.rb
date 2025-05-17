class ChangeUserIdToNotNullOnStatuses < ActiveRecord::Migration[7.0]
  def change
    change_column_null :statuses, :user_id, false
  end
end
