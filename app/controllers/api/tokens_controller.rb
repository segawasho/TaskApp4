class Api::TokensController < ApplicationController
  # POST /api/refresh_token
  def refresh
    refresh_token = cookies.signed[:refresh_token]
    payload = JsonWebToken.decode(refresh_token)

    if payload && payload["sub"]
      user = User.find_by(id: payload["sub"])

      if user
        access_token = JsonWebToken.encode({ sub: user.id }, exp: 15.minutes.from_now)
        cookies.signed[:access_token] = {
          value: access_token,
          httponly: true,
          expires: 15.minutes.from_now
        }
        render json: { message: "トークンを再発行しました" }, status: :ok
      else
        render json: { error: "ユーザーが見つかりません" }, status: :unauthorized
      end
    else
      render json: { error: "リフレッシュトークンが無効です" }, status: :unauthorized
    end
  rescue JWT::DecodeError => e
    render json: { error: "トークン解析に失敗しました: #{e.message}" }, status: :unauthorized
  end

  # DELETE /api/logout
  def destroy
    cookies.delete(:access_token)
    cookies.delete(:refresh_token)
    render json: { message: "ログアウトしました" }, status: :ok
  end
end
