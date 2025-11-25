Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects do
        resources :tasks
        get "stats", on: :member
      end
    end
  end
end
