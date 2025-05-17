class Api::TasksController < ApplicationController
  protect_from_forgery with: :null_session
  # protect_from_forgery with: :null_session とは？
  # protect_from_forgery	本来はCSRF攻撃を防ぐRailsの仕組み
  # with: :null_session	フォームじゃないリクエスト(APIなど)は、セッション無視して素直に受け取る設定
  # 通常の画面操作（フォーム送信とか）はprotect_from_forgeryが守ってくれる
  # APIだけ特別に CSRFチェックを無効にしてあげる感じ
  # セキュリティ的にも、API用なら大丈夫！（これが普通の設定）
  before_action :authorize_request


  def index
    tasks = current_user.tasks.includes(:company, :category, :status)
    tasks = tasks.where(company_id: params[:company_id]) if params[:company_id].present?
    render json: tasks.as_json(include: [:company, :category, :status])
  end
  # .includes(...)：N+1問題を防ぐための Eager Load。
  # .as_json(include: [...])：各関連オブジェクト（company, category, status）の中身を含めて JSON 化。

  def create
    task = current_user.tasks.build(task_params)
    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    task = current_user.tasks.find(params[:id])
    if task.update(task_params)
      render json: task
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def destroy
    task = current_user.tasks.find(params[:id])
    task.destroy
    head :no_content
  end


  private

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :priority, :company_id, :category_id, :status_id, :is_done)
  end
end
