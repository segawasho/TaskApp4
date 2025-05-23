class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      jwt_token = JsonWebToken.encode(user_id: user.id, exp: 15.minutes.from_now)
      refresh_token = SecureRandom.uuid

      user.refresh_tokens.create!(
        token: refresh_token,
        expired_at: 7.days.from_now
      )

      cookies.encrypted[:refresh_token] = {
        value: refresh_token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :none,
        expires: 7.days.from_now
      }

      render json: {
        jwt: jwt_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          is_admin: user.is_admin
        }
      }, status: :ok
    else
      render json: { error: '認証に失敗しました' }, status: :unauthorized
    end
  end

  def me
    header = request.headers['Authorization']
    token = header&.split(' ')&.last
    decoded = JsonWebToken.decode(token)

    if decoded && (user = User.find_by(id: decoded[:user_id]))
      render json: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }, status: :ok
    else
      render json: { error: '無効なトークン' }, status: :unauthorized
    end
  end

  def logout
    token = cookies.encrypted[:refresh_token]
    RefreshToken.find_by(token: token)&.destroy
    cookies.delete(:refresh_token, secure: Rails.env.production?, same_site: :none)
    head :no_content
  end
end
