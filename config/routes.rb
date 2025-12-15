Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create"

      resources :projects do
        resources :tasks, only: [ :index, :create ]
      end

      # added these to enable to me to edit tasks
      resources :tasks, only: [ :update, :destroy ]
    end
  end
end
