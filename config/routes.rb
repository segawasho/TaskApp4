Rails.application.routes.draw do
  # React SPA のルートたち（非API）
  root 'home#top'
  get '/tasks',             to: 'home#tasks'
  get '/memos',             to: 'home#memos'
  get '/company_master',    to: 'home#company_master'
  get '/category_master',   to: 'home#category_master'
  get '/status_master',     to: 'home#status_master'
  get '/company_dashboard', to: 'home#company_dashboard'

  # APIエンドポイント
  namespace :api do
    post '/login', to: 'sessions#create'
    get '/me',     to: 'sessions#me'

    resources :users, only: [:index, :update]
    patch '/password', to: 'users#update_password'

    resources :tasks, only: [:index, :create, :update, :destroy]
    get 'tasks/:task_id/progress_comments', to: 'progress_comments#index'

    resources :companies, only: [:index, :create, :update, :destroy]
    resources :categories, only: [:index, :create, :update, :destroy]
    resources :statuses, only: [:index, :create, :update, :destroy]
    resources :memos, only: [:index, :create, :update, :destroy]
    resources :progress_comments, only: [:create, :update, :destroy]
  end

  # React Router対応： `/login/1` や `/anything/here` でも `home#top` を返す
  get '/login/*path', to: 'home#top', constraints: ->(req) { req.format == :html }
  get '/admin/*path', to: 'home#top', constraints: ->(req) { req.format.html? }
  get '*path',        to: 'home#top', constraints: ->(req) { req.format.html? }
end
