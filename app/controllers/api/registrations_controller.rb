class Api::RegistrationsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  def create
    user = User.new(user_params)
    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      refresh_token = RefreshToken.create!(user: user)

      cookies.encrypted[:jwt] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: 15.minutes.from_now
      }

      cookies.encrypted[:refresh_token] = {
        value: refresh_token.token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: refresh_token.expired_at
      }

      render json: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin
        }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation, :role_id, :industry_id, :custom_role_description, :prefecture, :city)
  end
end
