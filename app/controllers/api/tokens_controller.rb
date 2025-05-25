class Api::TokensController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  def refresh
    refresh_token = cookies.encrypted[:refresh_token]
    stored = RefreshToken.find_by(token: refresh_token)

    if stored&.expired_at&.future?
      jwt = JsonWebToken.encode(user_id: stored.user_id, exp: 15.minutes.from_now)
      user = User.find_by(id: stored.user_id)

      if user
        render json: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin
        }, status: :ok
      else
        render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized
      end
    else
      render json: { error: '無効なリフレッシュトークン' }, status: :unauthorized
    end
  end
end
