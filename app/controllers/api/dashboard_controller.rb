class Api::DashboardController < ApplicationController
  protect_from_forgery with: :null_session

  def summary
    user_id = current_user.id
    today = Time.zone.today

    # 未完了タスク（期限が本日以前）
    tasks = Task.where(user_id: user_id, is_done: false).where("due_date <= ?", today)
    status_counts = tasks.group(:status_id).count
    statuses = Status.where(id: status_counts.keys).pluck(:id, :name).to_h
    status_chart = status_counts.map do |id, count|
      {
        label: statuses[id] || '未定義',
        value: count
      }
    end

    # 期限分類（未完了）
    all_tasks = Task.where(user_id: user_id, is_done: false)
    due_bar_chart = [
      { label: '期限切れ', value: all_tasks.where("DATE(due_date) < ?", today).count },
      { label: '本日', value: all_tasks.where("DATE(due_date) = ?", today).count },
      { label: '明日以降', value: all_tasks.where("DATE(due_date) > ?", today).count }
    ]

    # 企業ごとの件数（未完了）
    company_counts = all_tasks.group(:company_id).count
    companies = Company.where(id: company_counts.keys).pluck(:id, :company_code, :name)
    company_map = companies.to_h { |id, code, name| [id, { code: code, name: name }] }

    company_task_table = company_counts.map do |company_id, count|
      tasks = all_tasks.where(company_id: company_id).pluck(:title, :due_date) || []
      {
        company_code: company_map[company_id]&.dig(:code) || '不明',
        name: company_map[company_id]&.dig(:name) || '不明',
        count: count,
        tasks: tasks.map { |title, due| { title: title, due_date: due } }
      }
    end

    render json: {
      status_chart: status_chart,
      due_bar_chart: due_bar_chart,
      company_task_table: company_task_table
    }
  end
end
