Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects do
        member do
          get :stats        # /api/v1/projects/:id/stats
        end

        resources :tasks, shallow: true
        # gives:
        #   /api/v1/projects/:project_id/tasks
        #   /api/v1/tasks/:id
      end
    end
  end
end
