# app/models/task.rb
class Task < ApplicationRecord
  # A Task belongs to a Project
  belongs_to :project

  # Define enums for status (used for the chart) and priority
  enum :status, { to_do: 0, in_progress: 1, restarted: 2, completed: 3 }
  enum :priority, { low: 0, medium: 1, high: 2 }

  # Default values for new records
  after_initialize :set_defaults, if: :new_record?

  # Add validations for required fields
  validates :title, presence: true
  validates :status, presence: true
  validates :priority, presence: true

  private

  def set_defaults
    self.priority ||= :medium
    self.status ||= :to_do
  end
end
