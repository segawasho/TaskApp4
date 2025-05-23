class Api::UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_admin!, only: [:index, :update]

  def index
    users = User.all.select(:id, :email, :name, :is_admin)
    render json: users
  end

  def update
    user = User.find(params[:id])
    if user.update(user_params)
      render json: { status: 'updated' }, status: :ok
    else
      render json: { error: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_password
    unless current_user
      render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized
      return
    end

    if current_user.update(password: params[:password])
      render json: { message: 'パスワード変更成功' }, status: :ok
    else
      render json: { error: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :is_admin, :password)
  end
end
