class Api::RegistrationsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    user = User.new(user_params)
    if user.save
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
        user: user.slice(:id, :email, :name, :is_admin)
      }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :email, :name, :password, :password_confirmation,
      :role_id, :industry_id, :custom_role_description,
      :prefecture, :city
    )
  end
end
