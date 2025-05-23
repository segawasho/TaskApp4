class AddCustomRoleDescriptionToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :custom_role_description, :string
  end
end
