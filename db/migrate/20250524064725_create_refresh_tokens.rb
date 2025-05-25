class CreateRefreshTokens < ActiveRecord::Migration[7.0]
  def change
    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token, null: false
      t.datetime :expired_at, null: false

      t.timestamps
    end
    add_index :refresh_tokens, :token, unique: true
  end
end
