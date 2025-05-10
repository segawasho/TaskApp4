class Api::StatusesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: Status.all
  end

  def create
    status = Status.new(status_params)
    if status.save
      render json: status, status: :created
    else
      render json: { errors: status.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    status = Status.find(params[:id])
    if status.update(status_params)
      render json: status
    else
      render json: { errors: status.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    status = Status.find(params[:id])
    status.update(deleted_at: Time.current)
    head :no_content
  end

  private

  def status_params
    params.require(:status).permit(:name, :deleted_at)
  end

end
