Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("VALKEY_URL", "redis://redis:6379/0") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("VALKEY_URL", "redis://redis:6379/0") }
end
