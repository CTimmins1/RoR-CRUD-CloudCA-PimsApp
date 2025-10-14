# config/routes.rb (The correct structure)

Rails.application.routes.draw do
  # NEST TASKS INSIDE PROJECTS
  resources :projects do
    resources :tasks  # This creates URLs like /projects/:project_id/tasks/:id
  end

  # Define the root path (Home page)
  root "projects#index"

  # ... rest of the boilerplate ...
end
