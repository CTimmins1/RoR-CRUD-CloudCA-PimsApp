class ApplicationController < ActionController::API
  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last

    if token
      begin
        decoded = JsonWebToken.decode(token)
        @current_user = User.find(decoded[:user_id])
      rescue
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    else
      render json: { error: "Missing token" }, status: :unauthorized
    end
  end
end
