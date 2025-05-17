class ProgressComment < ApplicationRecord
  belongs_to :user
  belongs_to :task

  validates :user_id, presence: true
end
