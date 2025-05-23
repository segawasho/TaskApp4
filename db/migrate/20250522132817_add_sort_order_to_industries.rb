class AddSortOrderToIndustries < ActiveRecord::Migration[7.0]
  def change
    add_column :industries, :sort_order, :integer, default: 0, null: false
    add_index :industries, :sort_order
  end
end
