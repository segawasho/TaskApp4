class CreateMemos < ActiveRecord::Migration[7.0]
  def change
    create_table :memos do |t|
      t.references :company, null: false, foreign_key: true
      t.string :title
      t.text :body
      t.date :memo_date
      t.boolean :archived, default: false

      t.timestamps
    end
  end
end
