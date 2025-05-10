class AddConstraintsToCompanyCode < ActiveRecord::Migration[7.0]
  def change
    change_column_null :companies, :company_code, false
  end
end
