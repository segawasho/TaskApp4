class Api::StatusesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authorize_request

  def index
    render json: current_user.statuses
  end

  def create
    status = current_user.statuses.build(status_params)
    if status.save
      render json: status, status: :created
    else
      render json: { errors: status.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    status = current_user.statuses.find(params[:id])
    if status.update(status_params)
      render json: status
    else
      render json: { errors: status.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    status = current_user.statuses.find(params[:id])
    status.update(deleted_at: Time.current)
    head :no_content
  end

  private

  def status_params
    params.require(:status).permit(:name, :deleted_at)
  end

end
