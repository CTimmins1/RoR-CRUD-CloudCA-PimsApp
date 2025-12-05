class Api::V1::AuthController < ApplicationController
  def create
    user = User.find_by(email: params[:email]&.downcase.strip)

    if user&.valid_password?(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { jwt: token, user: { id: user.id, email: user.email } }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end
end
