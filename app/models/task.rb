class Task < ApplicationRecord
  has_many :progress_comments, dependent: :destroy

  belongs_to :user
  belongs_to :company
  belongs_to :category
  belongs_to :status

  scope :done, -> { where(is_done: true) }
  scope :not_done, -> { where(is_done: [false, nil]) }
  enum priority: { 高: 1, 中: 2, 低: 3 }

  validates :title, presence: true
  validates :user_id, presence: true
end
