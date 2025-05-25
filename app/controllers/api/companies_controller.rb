class Api::CompaniesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  def index
    render json: current_user.companies
  end

  def create
    company = current_user.companies.build(company_params)
    if company.save
      render json: company, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    company = current_user.companies.find(params[:id])
    if company.update(company_params)
      render json: company
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    company = current_user.companies.find(params[:id])
    company.update(deleted_at: Time.current)
    head :no_content
  end

  private

  def company_params
    params.require(:company).permit(:name, :company_code, :deleted_at)
  end

end
