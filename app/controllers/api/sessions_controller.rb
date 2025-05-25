class Api::SessionsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      refresh_token = RefreshToken.create!(user: user)

      cookies.encrypted[:jwt] = {
        value: token,
        httponly: true,
        secure: false, # 本番環境ではtrue
        same_site: :lax,
        expires: 15.minutes.from_now
      }

      cookies.encrypted[:refresh_token] = {
        value: refresh_token.token,
        httponly: true,
        secure: false, # 本番環境ではtrue
        same_site: :lax,
        expires: refresh_token.expired_at
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
    user = current_user
    unless user
      return render json: { error: '無効なトークン' }, status: :unauthorized
    end

    # オプション：トークン延長発行（将来的に切り替えも考慮）
    refreshed_token = JsonWebToken.encode(user_id: user.id)
    cookies.encrypted[:jwt] = {
      value: refreshed_token,
      httponly: true,
      secure: false, # 本番環境ではtrue
      same_site: :lax,
      expires: 15.minutes.from_now
    }

    render json: {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin
    }, status: :ok
  end

  def destroy
    cookies.delete(:jwt)
    render json: { message: 'ログアウトしました' }, status: :ok
  end
end
