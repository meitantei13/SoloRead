Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth"

      namespace :current do
        resource :user, only: [:show]
        resources :books, only: [:index, :show, :create, :update] do
          collection do
            get "counts"
            get "list"
            get "reading"
          end
        end
        resources :genres, only: [:index, :create]
        namespace :settings do
          resource :name, only: [:update]
        end
      end
    end
  end
end
