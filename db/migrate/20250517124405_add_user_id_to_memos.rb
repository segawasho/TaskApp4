class AddUserIdToMemos < ActiveRecord::Migration[7.0]
  def change
    add_reference :memos, :user, null: true, foreign_key: true
  end
end
