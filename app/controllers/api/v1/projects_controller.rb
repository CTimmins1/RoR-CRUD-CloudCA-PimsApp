class Api::V1::ProjectsController < ApplicationController
  before_action :authenticate_request

  # -------------------------------------------------------------
  # Index:
  # AMS does not automatically apply serializers for collections
  # when using the :attributes adapter. If we don't specify one,
  # Rails returns raw model objects and bypasses our serializer.
  # Explicit serializer usage ensures consistent API output.
  # -------------------------------------------------------------
  def index
    render json: current_user.projects,
           each_serializer: ProjectSerializer
  end

  # -------------------------------------------------------------
  # Show:
  # Single-record responses *can* infer the serializer, but making
  # it explicit avoids ambiguity and keeps behavior predictable.
  # -------------------------------------------------------------
  def show
    project = current_user.projects.find(params[:id])
    render json: project,
           serializer: ProjectSerializer
  end

  # -------------------------------------------------------------
  # Create:
  # Return the serialized record so the frontend receives all
  # derived fields (status_label, status_int, tasks_count, etc.).
  # -------------------------------------------------------------
  def create
    project = current_user.projects.build(project_params)

    if project.save
      render json: project,
             serializer: ProjectSerializer,
             status: :created
    else
      render json: { errors: project.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # -------------------------------------------------------------
  # Update:
  # Same reasoning as above — without the serializer, the API
  # would return raw DB values instead of structured output.
  # -------------------------------------------------------------
  def update
    project = current_user.projects.find(params[:id])

    if project.update(project_params)
      render json: project,
             serializer: ProjectSerializer
    else
      render json: { errors: project.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # -------------------------------------------------------------
  # Destroy:
  # Nothing special here — just remove the record if owned by user.
  # -------------------------------------------------------------
  def destroy
    current_user.projects.find(params[:id]).destroy
    head :no_content
  end

  private

  # -------------------------------------------------------------
  # Strong params:
  # Status must be permitted since it's now part of the enum
  # and required for dashboard charts.
  # -------------------------------------------------------------
  def project_params
    params.require(:project).permit(:title, :description, :status)
  end
end
