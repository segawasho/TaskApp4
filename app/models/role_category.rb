class RoleCategory < ApplicationRecord
  has_many :roles

  validates :name, presence: true, uniqueness: true, length: { maximum: 20 }
end
