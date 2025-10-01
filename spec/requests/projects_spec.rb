# spec/requests/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :request do
  # --- FactoryBot Helpers ---
  # Helper to get a hash of valid attributes from FactoryBot
  let(:valid_attributes) { FactoryBot.attributes_for(:project) }
  # Helper for invalid attributes (e.g., missing required 'title')
  let(:invalid_attributes) { { title: nil, description: "Missing title" } }
  
  # Ensure an instance exists for tests like show, edit, update, destroy
  let!(:project) { FactoryBot.create(:project) }

  # --- Controller Tests ---
  
  describe "GET /index" do
    it "renders a successful response" do
      get projects_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      get project_url(project)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_project_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      get edit_project_url(project)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Project" do
        expect {
          post projects_url, params: { project: valid_attributes }
        }.to change(Project, :count).by(1)
      end

      it "redirects to the created project" do
        post projects_url, params: { project: valid_attributes }
        expect(response).to redirect_to(project_url(Project.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Project" do
        expect {
          post projects_url, params: { project: invalid_attributes }
        }.to change(Project, :count).by(0)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post projects_url, params: { project: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) { { title: "Updated Title" } }

      it "updates the requested project" do
        patch project_url(project), params: { project: new_attributes }
        project.reload
        expect(project.title).to eq("Updated Title")
      end

      it "redirects to the project" do
        patch project_url(project), params: { project: new_attributes }
        expect(response).to redirect_to(project_url(project))
      end
    end

    context "with invalid parameters" do
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        patch project_url(project), params: { project: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested project" do
      expect {
        delete project_url(project)
      }.to change(Project, :count).by(-1)
    end

    it "redirects to the projects list" do
      delete project_url(project)
      expect(response).to redirect_to(projects_url)
    end
  end
end
