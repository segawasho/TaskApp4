Rails.application.routes.draw do
  root 'home#top'
  get '/tasks', to: 'home#tasks'
  get '/memos', to: 'home#memos'
  get '/company_master', to: 'home#company_master'
  get '/category_master', to: 'home#category_master'
  get '/status_master', to: 'home#status_master'
  get '/company_dashboard', to: 'home#company_dashboard'



  namespace :api do
    resources :tasks, only: [:index, :create, :update, :destroy]
    # GET /api/tasks
    # POST /api/tasks
    # DELETE /api/tasks/:id
    resources :companies, only: [:index, :create, :update, :destroy]
    resources :categories, only: [:index, :create, :update, :destroy]
    resources :statuses, only: [:index, :create, :update, :destroy]
    resources :progress_comments, only: [:create, :update, :destroy]
    get 'tasks/:task_id/progress_comments', to: 'progress_comments#index'

    resources :memos, only: [:index, :create, :update, :destroy]
  end

end
