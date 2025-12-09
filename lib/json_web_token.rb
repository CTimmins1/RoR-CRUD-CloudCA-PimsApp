require 'jwt'

class JsonWebToken
  SECRET = Rails.application.credentials.secret_key_base || "super-secret-dev-key-2025"

  def self.encode(payload)
    JWT.encode(payload.merge(exp: 30.days.from_now.to_i), SECRET)
  end

  def self.decode(token)
  body = JWT.decode(token, SECRET)[0]
  HashWithIndifferentAccess.new(body)
rescue
  nil
end

end
