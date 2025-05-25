class Api::UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_admin!, only: [:index, :update]
  before_action :authenticate_user!, only: [:update_password]

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
    if current_user.update(password: params[:password], password_confirmation: params[:password_confirmation])
      render json: { message: 'パスワード変更成功' }, status: :ok
    else
      render json: { error: current_user.errors.full_messages || ['更新できませんでした'] }, status: :unprocessable_entity
    end
  end


  private

  def user_params
    params.require(:user).permit(:name, :email, :is_admin, :password)
  end

  def authenticate_admin!
    authenticate_user!
    unless current_user&.is_admin?
      render json: { error: '管理者権限が必要です' }, status: :unauthorized
    end
  end
end
