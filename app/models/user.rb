class User < ApplicationRecord
  has_secure_password

  validates :login_id, presence: true, length: { maximum: 20 }, uniqueness: true
  validates :name, presence: true, length: { maximum: 20 }
  validates :password, presence: true, length: { minimum: 4 }, if: :password_required?

  private

  def password_required?
    new_record? || !password.nil?
  end
end
