class Industry < ApplicationRecord
  has_many :users

  validates :name, presence: true, uniqueness: true, length: { maximum: 20 }
end
