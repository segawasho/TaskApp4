class ChangeUserIdToNotNullOnCompanies < ActiveRecord::Migration[7.0]
  def change
    change_column_null :companies, :user_id, false
  end
end
