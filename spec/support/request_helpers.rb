module RequestHelpers
  def auth_headers_for(user)
    token = JsonWebToken.encode(user_id: user.id)

    {
      "Authorization" => "Bearer #{token}",
      "Content-Type" => "application/json",
      "Accept" => "application/json"
    }
  end
end
