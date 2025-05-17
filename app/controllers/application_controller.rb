class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  def authorize_request
    header = request.headers['Authorization']
    token = header.split(' ').last
    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id])
  rescue
    render json: { error: '認証に失敗しました' }, status: :unauthorized
  end

  def current_user
    @current_user
  end


end
