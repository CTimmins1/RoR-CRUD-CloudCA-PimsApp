require_relative "boot"

require "rails/all"

require "solid_cache"

Bundler.require(*Rails.groups)

module PimsApp
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
  end
end
