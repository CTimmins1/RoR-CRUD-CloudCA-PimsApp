class ApplicationController < ActionController::API
  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    # Rails normalizes headers → "Authorization" becomes "HTTP_AUTHORIZATION"
    header = request.headers["HTTP_AUTHORIZATION"]
    token  = header&.split(" ")&.last

    unless token
      return render json: { error: "Missing token" }, status: :unauthorized
    end

    decoded = JsonWebToken.decode(token)
    unless decoded
      return render json: { error: "Invalid token" }, status: :unauthorized
    end

    # decoded keys might be strings or symbols
    user_id = decoded["user_id"] || decoded[:user_id]

    @current_user = User.find_by(id: user_id)
    unless @current_user
      return render json: { error: "User not found" }, status: :unauthorized
    end
  end
end
