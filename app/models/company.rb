class Company < ApplicationRecord
  belongs_to :user
  has_many :memos, dependent: :destroy

  validates :name, presence: true
  validates :company_code, presence: true, uniqueness: true
  validates :user_id, presence: true

  scope :active, -> { where(deleted_at: nil) }
end
