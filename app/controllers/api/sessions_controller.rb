class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(login_id: params[:login_id])  # ← login_id に変更
    if user&.authenticate(params[:pin])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, is_admin: user.is_admin } }, status: :ok
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
        login_id: user.login_id,
        is_admin: user.is_admin
      }, status: :ok
    else
      render json: { error: '無効なトークン' }, status: :unauthorized
    end
  end
end
