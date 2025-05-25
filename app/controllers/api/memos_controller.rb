class Api::MemosController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  def index
    memos = current_user.memos
    memos = memos.where(company_id: params[:company_id]) if params[:company_id].present?
    memos = memos.where("title LIKE ?", "%#{params[:title]}%") if params[:title].present?
    memos = memos.where("body LIKE ?", "%#{params[:body]}%") if params[:body].present?
    if params[:archived] == 'true'
      memos = memos.where(archived: true)
    else
      memos = memos.where(archived: false)
    end
    render json: memos.order(memo_date: :asc)
  end

  def create
    memo = current_user.memos.build(memo_params)
    if memo.save
      render json: memo, status: :created
    else
      render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    memo = current_user.memos.find(params[:id])
    if memo.update(memo_params)
      render json: memo
    else
      render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    memo = current_user.memos.find(params[:id])
    memo.update(archived: true)
    head :no_content
  end

  private

  def memo_params
    params.require(:memo).permit(:title, :body, :memo_date, :company_id, :archived)
  end
end
