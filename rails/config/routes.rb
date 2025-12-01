require "sidekiq/web"

Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  if Rails.env.development?
    mount Sidekiq::Web => "/sidekiq"
  end

  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth"

      post "guest_sessions", to: "guest_sessions#create"

      namespace :current do
        resource :user, only: [:show]
        resources :books, only: [:index, :show, :create, :update, :destroy] do
          collection do
            get :counts
            get :list
            get :drafts
          end
        end
      end
    end
  end
end
