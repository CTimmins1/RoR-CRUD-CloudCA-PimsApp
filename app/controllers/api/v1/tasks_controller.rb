class Api::V1::TasksController < ApplicationController
  before_action :authenticate_request
  before_action :set_task, only: [:update, :destroy]

  def create
    project = current_user.projects.find(params[:project_id])
    task = project.tasks.build(task_params.merge(user_id: current_user.id))

    if task.save
      render json: task, status: :created    # <-- AMS takes over
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task                     # <-- AMS takes over
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :priority, :status)
  end
end
