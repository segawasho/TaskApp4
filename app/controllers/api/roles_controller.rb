class Api::RolesController < ApplicationController
  def index
    roles = Role.includes(:role_category).all.sort_by { |r| [r.role_category.sort_order, r.sort_order] }
    render json: roles.as_json(include: { role_category: { only: [:id, :name, :sort_order] } })
  end
end
