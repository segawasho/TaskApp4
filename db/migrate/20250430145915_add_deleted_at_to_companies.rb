class AddDeletedAtToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :deleted_at, :datetime
  end
end
