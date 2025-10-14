# app/controllers/tasks_controller.rb

class TasksController < ApplicationController
  # Ensure the parent project is found for every action
  before_action :set_project
  # Ensure the specific task is found for show, edit, update, destroy
  before_action :set_task, only: %i[ show edit update destroy ]

  # GET /projects/:project_id/tasks
  def index
    @tasks = @project.tasks.all
  end

  # GET /projects/:project_id/tasks/1
  def show
    @project = Project.find(params[:project_id])
    @task = @project.tasks.find(params[:id])
  end

  # GET /projects/:project_id/tasks/new
  def new
    @task = @project.tasks.build
  end

  # GET /projects/:project_id/tasks/1/edit
  def edit
    # @task is set by set_task
  end

  # POST /projects/:project_id/tasks
  def create
    @task = @project.tasks.build(task_params)

    if @task.save
      # Redirect to the parent project's show page
      redirect_to @project, notice: "Task was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /projects/:project_id/tasks/1
  def update
    if @task.update(task_params)
      # Redirect to the parent project's show page
      redirect_to @project, notice: "Task was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /projects/:project_id/tasks/1
  def destroy
    @task.destroy!
    redirect_to @project, notice: "Task was successfully deleted.", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.

    # Finds the parent Project
    def set_project
      @project = Project.find(params[:project_id])
    end

    # Finds the specific Task scoped to the parent Project
    def set_task
      @task = @project.tasks.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def task_params
      params.require(:task).permit(:title, :description, :due_date, :priority, :status, :project_id)
    end
end
