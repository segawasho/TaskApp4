class Api::TokensController < ApplicationController
  def refresh
    refresh_token = cookies.encrypted[:refresh_token]
    stored = RefreshToken.find_by(token: refresh_token)

    if stored&.expired_at&.future?
      jwt = JsonWebToken.encode(user_id: stored.user_id, exp: 15.minutes.from_now)
      render json: { jwt: jwt }, status: :ok
    else
      render json: { error: '無効なリフレッシュトークン' }, status: :unauthorized
    end
  end
end
