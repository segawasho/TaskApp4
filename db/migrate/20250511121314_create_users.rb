class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :login_id, null: false, limit: 20
      t.string :name, null: false, limit: 20
      t.string :password_digest, null: false
      t.boolean :is_admin, default: false, null: false

      t.timestamps

      t.index :login_id, unique: true
    end
  end
end
