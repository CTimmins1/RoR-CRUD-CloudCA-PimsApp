class Api::V1::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :update, :destroy, :stats]

  # GET /api/v1/projects
  def index
    render json: Project.all
  end

  # GET /api/v1/projects/:id
  def show
    render json: @project
  end

  # POST /api/v1/projects
  def create
    project = Project.new(project_params)

    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/projects/:id
  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/projects/:id
  def destroy
    @project.destroy
    head :no_content
  end

  # GET /api/v1/projects/:id/stats
  def stats
    project = @project

    tasks_per_day    = project.tasks.group_by_day(:created_at, time_zone: "UTC").count
    status_counts    = project.tasks.group(:status).count
    priority_counts  = project.tasks.group(:priority).count

    render json: {
      total_tasks: project.tasks.count,
      tasks_per_day: tasks_per_day,
      status_counts: status_counts,
      priority_counts: priority_counts
    }
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.permit(:title, :description, :status)
  end
end
