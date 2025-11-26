Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "/signup", to: "users#create"
      post "/login", to: "authentication#login"

      resources :projects do
        resources :tasks
        get "stats", on: :member
      end
    end
  end
end
