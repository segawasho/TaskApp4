class ChangeNameToNotNullOnRolesAndOthers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :roles, :name, false
    change_column_null :role_categories, :name, false
    change_column_null :industries, :name, false
  end
end
