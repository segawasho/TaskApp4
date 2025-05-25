class Api::CategoriesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  def index
    render json: current_user.categories
  end

  def create
    category = current_user.categories.build(category_params)
    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    category = current_user.categories.find(params[:id])
    if category.update(category_params)
      render json: category
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    category = current_user.categories.find(params[:id])
    category.update(deleted_at: Time.current)
    head :no_content
  end

  private

  def category_params
    params.require(:category).permit(:name, :deleted_at)
  end

end
