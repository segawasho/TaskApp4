class AddRoleCategoryToRoles < ActiveRecord::Migration[7.0]
  def change
    add_reference :roles, :role_category, foreign_key: true
  end
end
