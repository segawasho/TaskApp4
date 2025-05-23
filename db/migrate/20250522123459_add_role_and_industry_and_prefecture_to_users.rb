class AddRoleAndIndustryAndPrefectureToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :role_id, :bigint
    add_column :users, :industry_id, :bigint
  end
end
