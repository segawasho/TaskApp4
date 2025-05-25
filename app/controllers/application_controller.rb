class ApplicationController < ActionController::Base
  # デフォルトでCSRF保護が無効のため、protect_from_forgeryはいらない。

  def current_user
    token = cookies.encrypted[:jwt]
    Rails.logger.info "JWT TOKEN: #{token.inspect}"

    decoded = JsonWebToken.decode(token)
    Rails.logger.info "DECODED PAYLOAD: #{decoded.inspect}"

    User.find_by(id: decoded[:user_id])
  rescue => e
    Rails.logger.warn "JWT decode failed: #{e.class} - #{e.message}"
    nil
  end

  def authenticate_user!
    unless current_user
      render json: { error: '認証が必要です' }, status: :unauthorized
    end
  end
end
