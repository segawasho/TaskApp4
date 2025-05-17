class ChangeUserIdToNotNullOnProgressComments < ActiveRecord::Migration[7.0]
  def change
    change_column_null :progress_comments, :user_id, false
  end
end
