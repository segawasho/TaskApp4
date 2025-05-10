class Category < ApplicationRecord
  scope :active, -> { where(deleted_at: nil) }
end
