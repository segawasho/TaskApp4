class Company < ApplicationRecord
  has_many :memos, dependent: :destroy

  validates :name, presence: true
  validates :company_code, presence: true, uniqueness: true

  scope :active, -> { where(deleted_at: nil) }
end
