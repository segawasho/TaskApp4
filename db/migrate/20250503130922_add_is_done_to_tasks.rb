class AddIsDoneToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :is_done, :boolean
  end
end
