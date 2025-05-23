class AddSortOrderToRoles < ActiveRecord::Migration[7.0]
  def change
    add_column :roles, :sort_order, :integer, default: 0, null: false
    add_index :roles, :sort_order
  end
end
