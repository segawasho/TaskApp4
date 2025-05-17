class AddUserIdToProgressComments < ActiveRecord::Migration[7.0]
  def change
    add_reference :progress_comments, :user, null: true, foreign_key: true
  end
end
