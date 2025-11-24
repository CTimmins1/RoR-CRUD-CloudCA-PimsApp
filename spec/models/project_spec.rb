# spec/models/project_spec.rb
require 'rails_helper'

RSpec.describe Project, type: :model do
  # 1. Test Validations (RED)
  it 'is invalid without a title' do
    project = FactoryBot.build(:project, title: nil)
    expect(project).to_not be_valid
  end

  # 2. Test Associations
  it { should have_many(:tasks).dependent(:destroy) }

  # 3. Test Enums
  it 'is created with a pending status' do
    project = FactoryBot.create(:project)
    expect(project.pending?).to be true
  end
end
