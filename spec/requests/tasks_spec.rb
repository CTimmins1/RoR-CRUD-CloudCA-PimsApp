# spec/requests/tasks_spec.rb
require 'rails_helper'

RSpec.describe "Tasks", type: :request do
  # --- FactoryBot Helpers ---
  # Need a parent project for all nested routes
  let!(:project) { FactoryBot.create(:project) } 
  let!(:task) { FactoryBot.create(:task, project: project) } # Task scoped to the project
  
  let(:valid_attributes) { FactoryBot.attributes_for(:task) }
  let(:invalid_attributes) { { title: nil, description: "Missing title" } }

  # --- Controller Tests ---

  describe "GET /index" do
    it "renders a successful response" do
      # Note: Route helper requires the parent project object
      get project_tasks_url(project)
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      get project_task_url(project, task)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_project_task_url(project)
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      get edit_project_task_url(project, task)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Task scoped to the Project" do
        expect {
          post project_tasks_url(project), params: { task: valid_attributes }
        }.to change(project.tasks, :count).by(1)
      end

      it "redirects to the parent project's show page" do
        post project_tasks_url(project), params: { task: valid_attributes }
        expect(response).to redirect_to(project_url(project))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Task" do
        expect {
          post project_tasks_url(project), params: { task: invalid_attributes }
        }.to change(Task, :count).by(0)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post project_tasks_url(project), params: { task: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) { { title: "Updated Task Title" } }

      it "updates the requested task" do
        patch project_task_url(project, task), params: { task: new_attributes }
        task.reload
        expect(task.title).to eq("Updated Task Title")
      end

      it "redirects to the parent project's show page" do
        patch project_task_url(project, task), params: { task: new_attributes }
        expect(response).to redirect_to(project_url(project))
      end
    end

    context "with invalid parameters" do
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        patch project_task_url(project, task), params: { task: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested task" do
      expect {
        delete project_task_url(project, task)
      }.to change(Task, :count).by(-1)
    end

    it "redirects to the parent project's show page" do
      delete project_task_url(project, task)
      expect(response).to redirect_to(project_url(project))
    end
  end
end
