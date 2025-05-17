Rails.application.routes.draw do
  # React SPA のベース（すべて home#top を返す）　（非API）
  root 'home#top'

  # React Router対応：SPAが扱うすべてのURLを home#top に返す
  get '/login/*path', to: 'home#top', constraints: ->(req) { req.format.html? }
  get '/admin/*path', to: 'home#top', constraints: ->(req) { req.format.html? }
  get '*path',        to: 'home#top', constraints: ->(req) { req.format.html? }

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
end
