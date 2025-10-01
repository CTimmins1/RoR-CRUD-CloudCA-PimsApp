# app/models/task.rb
class Task < ApplicationRecord
  # A Task belongs to a Project
  belongs_to :project

  # Define enums for status (used for the chart) and priority
  enum :status, { to_do: 0, in_progress: 1, done: 2 }
  enum :priority, { low: 0, medium: 1, high: 2 }

  # Add validations for required fields
  validates :title, presence: true
  validates :status, presence: true
end
