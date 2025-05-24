class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)

      cookies.encrypted[:jwt] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?, # 本番環境でのみhttps
        same_site: :lax,
        expires: 15.minutes.from_now
      }

      render json: {
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
    token = cookies.encrypted[:jwt]
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

  def destroy
    cookies.delete(:jwt)
    render json: { message: 'ログアウトしました' }, status: :ok
  end
end
