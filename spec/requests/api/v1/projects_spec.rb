require 'rails_helper'

RSpec.describe "API::V1::Projects", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let!(:projects) { FactoryBot.create_list(:project, 3, user: user) }
  let(:headers) { auth_headers_for(user) }

  describe "GET /api/v1/projects" do
    it "returns all projects" do
      get "/api/v1/projects", headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe "GET /api/v1/projects/:id" do
    it "returns one project" do
      project = projects.first

      get "/api/v1/projects/#{project.id}", headers: headers

      expect(response).to have_http_status(:ok)
    end
  end
end
