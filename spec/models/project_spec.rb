require 'rails_helper'

RSpec.describe Project, type: :model do
  it "is valid with a title and user" do
    user = FactoryBot.create(:user)
    project = Project.new(title: "Test", user: user)
    expect(project).to be_valid
  end
end
