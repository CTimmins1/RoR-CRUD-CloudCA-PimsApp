class Api::V1::ProjectsController < ApplicationController
  def index
    render json: current_user.projects
  end

  def create
    project = current_user.projects.build(project_params)
    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    project = current_user.projects.find(params[:id])
    if project.update(project_params)
      render json: project
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.projects.find(params[:id]).destroy
    head :no_content
  end

  private

  def project_params
    params.require(:project).permit(:title, :description)
  end
end
