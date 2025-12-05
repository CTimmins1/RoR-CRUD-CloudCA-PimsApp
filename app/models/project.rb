class Project < ApplicationRecord
  # Each project belongs to a user and contains many tasks.
  belongs_to :user
  has_many :tasks, dependent: :destroy

  # ---------------------------------------------------------------------
  # Status Enum
  # Maps project status to integer values stored in the database.
  #
  # These integer values must match what the frontend expects:
  #   0 = pending      (frontend treats as "To Do")
  #   1 = in_progress  (frontend treats as "In Progress")
  #   2 = completed    (frontend treats as "Completed")
  #
  # NOTE:
  # Rails stores the integer, but returns the status name as a string
  # (e.g., project.status => "pending").
  # Frontend consumes project[:status] which returns the integer.
  # ---------------------------------------------------------------------
  enum :status, { pending: 0, in_progress: 1, completed: 2 }

  # Title should always be present
  validates :title, presence: true

  # ---------------------------------------------------------------------
  # Assign a default status to new project objects.
  #
  # This prevents NULL values in the database, which previously caused
  # the pie chart to fail (Recharts cannot group NULL into known buckets).
  #
  # Only executes on NEW records and only if the status column exists.
  # ---------------------------------------------------------------------
  after_initialize do
    # If the record is new and status is nil, assign default state.
    self.status ||= :pending if has_attribute?(:status)
  end

  # ---------------------------------------------------------------------
  # CLASS METHOD:
  # Returns a list of all project status counts formatted for analytics.
  #
  # Example output:
  #   [["Pending", 5], ["In progress", 3], ["Completed", 2]]
  #
  # Useful for general statistics dashboards.
  # ---------------------------------------------------------------------
  def self.status_counts
    raw_counts = group(:status).count
    raw_counts.map do |status_enum_int, count|
      [
        Project.statuses.key(status_enum_int).humanize,  # readable label
        count                                           # number of projects
      ]
    end
  end

  # ---------------------------------------------------------------------
  # INSTANCE METHOD:
  # Returns the count of tasks per status *for this specific project*.
  #
  # Example output:
  #   { 0 => 3, 1 => 2, 2 => 1 }
  #
  # Frontend can translate these integers via Task.statuses.
  # ---------------------------------------------------------------------
  def task_status_counts
    tasks.group(:status).count
  end
end
