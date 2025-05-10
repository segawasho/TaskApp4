class AddCompanyCodeToCompanies < ActiveRecord::Migration[7.0]
  def change
    add_column :companies, :company_code, :string
    add_index :companies, :company_code, unique: true
  end
end
