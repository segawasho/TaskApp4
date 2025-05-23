class Api::IndustriesController < ApplicationController
  def index
    industries = Industry.order(:sort_order)
    render json: industries
  end
end
