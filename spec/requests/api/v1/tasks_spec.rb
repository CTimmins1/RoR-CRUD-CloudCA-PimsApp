require 'rails_helper'

RSpec.describe "API::V1::Tasks", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let!(:project) { FactoryBot.create(:project, user: user) }
  let!(:task) { FactoryBot.create(:task, project: project, user: user) }
  let(:headers) { auth_headers_for(user) }

  describe "GET /api/v1/projects/:project_id/tasks" do
    it "returns all tasks for the project" do
      get "/api/v1/projects/#{project.id}/tasks", headers: headers
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1/projects/:project_id/tasks/:id" do
    it "returns one task" do
      get "/api/v1/projects/#{project.id}/tasks/#{task.id}", headers: headers
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /api/v1/projects/:project_id/tasks" do
    it "creates a task" do
      expect {
        post "/api/v1/projects/#{project.id}/tasks",
             params: { task: { title: "New Task", priority: "medium", status: "pending" } }.to_json,
             headers: headers
      }.to change(Task, :count).by(1)
    end
  end

  describe "PATCH /api/v1/projects/:project_id/tasks/:id" do
    it "updates a task" do
      patch "/api/v1/projects/#{project.id}/tasks/#{task.id}",
            params: { task: { title: "Updated Title" } }.to_json,
            headers: headers

      expect(response).to have_http_status(:ok)
    end
  end

  describe "DELETE /api/v1/projects/:project_id/tasks/:id" do
    it "deletes the task" do
      expect {
        delete "/api/v1/projects/#{project.id}/tasks/#{task.id}", headers: headers
      }.to change(Task, :count).by(-1)
    end
  end
end
