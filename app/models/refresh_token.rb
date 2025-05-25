class RefreshToken < ApplicationRecord
  belongs_to :user

  before_create :generate_token, :set_expiry

  private

  def generate_token
    self.token = SecureRandom.urlsafe_base64(64)
  end

  def set_expiry
    self.expired_at ||= 30.days.from_now
  end
end
