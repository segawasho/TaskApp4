class AddDeletedAtToStatuses < ActiveRecord::Migration[7.0]
  def change
    add_column :statuses, :deleted_at, :datetime
  end
end
