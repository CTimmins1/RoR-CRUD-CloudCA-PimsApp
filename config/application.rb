require_relative "boot"

require "rails/all"

require "solid_cache"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module PimsApp
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.autoload_paths << Rails.root.join('app/lib')
  end
ENV["PGUSER"] = "pims_user"
ENV["PGPASSWORD"] = "password123"
ENV["PGHOST"] = "localhost"

end
