class Memo < ApplicationRecord
  belongs_to :company

  validates :title, presence: true, length: { maximum: 30 }
  validates :body, presence: true
  validates :memo_date, presence: true
  validates :company_id, presence: true
end
