Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post   "/login",   to: "auth#create"

      resources :projects do
        resources :tasks, only: [:create, :update, :destroy]
      end

      resources :projects, only: [:index, :show, :create, :update, :destroy]
      resources :tasks,    only: [:update, :destroy]  # for direct task edits if needed
    end
  end
end
