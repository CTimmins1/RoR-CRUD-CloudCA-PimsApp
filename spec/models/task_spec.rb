# spec/models/task_spec.rb
require 'rails_helper'

RSpec.describe Task, type: :model do
  # 1. Test Validations (RED)
  it 'is invalid without a title' do
    task = FactoryBot.build(:task, title: nil)
    expect(task).to_not be_valid
  end

  it 'is invalid without a project reference' do
    task = FactoryBot.build(:task, project: nil)
    expect(task).to_not be_valid
  end

  # 2. Test Associations
  it { should belong_to(:project) }
end
