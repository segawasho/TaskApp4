class Api::RolesController < ApplicationController
  # RailsにおけるCSRF保護（APIでは無効化するためにnull_session指定）
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!

  def index
    roles = Role.includes(:role_category).all.sort_by { |r| [r.role_category.sort_order, r.sort_order] }
    render json: roles.as_json(include: { role_category: { only: [:id, :name, :sort_order] } })
  end
end
