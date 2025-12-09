class Task < ApplicationRecord
  belongs_to :project
  belongs_to :user

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

  after_initialize :set_defaults, if: :new_record?

  validates :title, presence: true
  validates :status, presence: true
  validates :priority, presence: true

  def priority_value
  self[:priority]   # returns integer 0/1/2
  end

  def status_value
  self[:status]     # returns integer 0/1/2
  end

  #Ensure API responses return integer enum values
  def as_json(options = {})
    super(options).merge(
      priority: self[:priority],
      status: self[:status]
    )
  end

  private

  def set_defaults
    self.priority ||= :medium
    self.status ||= :pending
  end
end
