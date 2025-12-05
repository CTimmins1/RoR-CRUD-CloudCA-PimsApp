class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status_int, :status_label, :tasks_count

  has_many :tasks

  # Return the integer stored in DB
  # MUST use object[:status] or object.read_attribute(:status)
  def status_int
    object.read_attribute(:status)
  end

  # Human readable enum name
  def status_label
    object.status.humanize
  end

  def tasks_count
    object.tasks.count
  end
end
