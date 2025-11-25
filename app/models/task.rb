# app/models/task.rb
class Task < ApplicationRecord
  # A Task belongs to a Project
  belongs_to :project

  # ENUMS — These MUST match the values coming from your frontend
  enum :status, {
    pending: 0,
    in_progress: 1,
    completed: 2
  }

  enum :priority, {
    low: 0,
    medium: 1,
    high: 2
  }

  # Default values for new tasks
  after_initialize :set_defaults, if: :new_record?

  # Validations
  validates :title, presence: true
  validates :status, presence: true
  validates :priority, presence: true

  private

  def set_defaults
    self.priority ||= :medium
    self.status ||= :pending
  end
end
