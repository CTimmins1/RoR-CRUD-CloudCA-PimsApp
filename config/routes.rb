Rails.application.routes.draw do
  devise_for :users

  namespace :api do
    namespace :v1 do
      post "/signup", to: "registrations#create"
      post "/login",  to: "auth#create"

      resources :projects do
        resources :tasks
        get "stats", on: :member
      end
    end
  end
end
