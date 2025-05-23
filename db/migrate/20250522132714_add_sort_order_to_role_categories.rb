class AddSortOrderToRoleCategories < ActiveRecord::Migration[7.0]
  def change
    add_column :role_categories, :sort_order, :integer, default: 0, null: false
    add_index :role_categories, :sort_order
  end
end
