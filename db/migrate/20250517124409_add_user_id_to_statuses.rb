class AddUserIdToStatuses < ActiveRecord::Migration[7.0]
  def change
    add_reference :statuses, :user, null: true, foreign_key: true
  end
end
