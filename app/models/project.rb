class Project < ApplicationRecord
  # A Project can have many Tasks, and destroying a project destroys its tasks.
  has_many :tasks, dependent: :destroy

  # Define the integer status column as a readable enum
  # NOTE: The Project status is separate from the Task status.
  enum :status, { pending: 0, in_progress: 1, completed: 2 }

  # TDD: Add validation for a presence of a title
  validates :title, presence: true

  # -------------------------------------------------------------
  # 1. CLASS METHOD: Gets the status counts for *ALL* Projects
  # (Less common for dashboards, more useful for high-level reports)
  # -------------------------------------------------------------
  def self.status_counts
    # 1. Query the database for counts of all projects grouped by status integer
    raw_counts = group(:status).count

    # 2. Format the data for Chartkick: convert the integer key back to a human-readable string.
    raw_counts.map do |status_enum_int, count|
      # Project.statuses is the enum map, .key() gets the symbol name, .humanize makes it readable
      [ Project.statuses.key(status_enum_int).humanize, count ]
    end
  end

  # -------------------------------------------------------------
  # 2. INSTANCE METHOD: Gets the status counts for *THIS PROJECT'S TASKS*
  # (CRUCIAL for the Project Dashboard Chart)
  # -------------------------------------------------------------
  def task_status_counts
    # Use the 'tasks' association to scope the query
    # NOTE: This assumes your Task model also has a status enum defined (e.g., Task.statuses)
    tasks.group(:status).count
    # Since tasks.group(:status).count returns the map in the format {integer => count},
    # Chartkick can often handle this directly if the Task model is consistent.
    # If not, you might need to map it similarly to self.status_counts, using Task.statuses.
  end
end
