class Status < ApplicationRecord
  belongs_to :user

  validates :user_id, presence: true

  scope :active, -> { where(deleted_at: nil) }
end
