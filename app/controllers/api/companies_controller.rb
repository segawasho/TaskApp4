class Api::CompaniesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    render json: Company.all
  end

  def create
    company = Company.new(company_params)
    if company.save
      render json: company, status: :created
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    company = Company.find(params[:id])
    if company.update(company_params)
      render json: company
    else
      render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    company = Company.find(params[:id])
    company.update(deleted_at: Time.current)
    head :no_content
  end

  private

  def company_params
    params.require(:company).permit(:name, :company_code, :deleted_at)
  end

end
