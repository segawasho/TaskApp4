class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, length: { maximum: 50 }, uniqueness: true
  validates :name, presence: true, length: { maximum: 20 }
  validates :password, presence: true, length: { minimum: 4 }, if: :password_required?
  validates :role, presence: true
  validates :custom_role_description, presence: true, if: -> {
    role&.name == 'その他'
  }

  has_many :tasks
  has_many :progress_comments
  has_many :memos
  has_many :companies
  has_many :categories
  has_many :statuses
  belongs_to :role
  delegate :role_category, to: :role, allow_nil: true
  belongs_to :industry

  private

  def password_required?
    new_record? || !password.nil?
  end
end
