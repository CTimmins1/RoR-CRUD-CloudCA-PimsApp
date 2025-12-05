class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :priority, :status, :created_at, :updated_at

  def priority
    object[:priority]  # returns integer (0/1/2)
  end

  def status
    object[:status]    # returns integer
  end
end
