class Role < ApplicationRecord
  belongs_to :role_category
  has_many :users

  validates :name, presence: true, uniqueness: true, length: { maximum: 20 }
end
