class Api::IndustriesController < ApplicationController
  # RailsにおけるCSRF保護（APIでは無効化するためにnull_session指定）
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!

  def index
    industries = Industry.order(:sort_order)
    render json: industries
  end
end
