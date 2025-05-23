class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  def current_user
    return @current_user if defined?(@current_user)
    auth_header = request.headers['Authorization']
    token = auth_header&.split(' ')&.last
    decoded = JsonWebToken.decode(token)
    @current_user = User.find_by(id: decoded[:user_id]) if decoded
  end

  def authenticate_user!
    render json: { error: '認証が必要です' }, status: :unauthorized unless current_user
  end

  def authenticate_admin!
    unless current_user&.is_admin
      render json: { error: '管理者のみアクセス可能です' }, status: :unauthorized
    end
  end

end
