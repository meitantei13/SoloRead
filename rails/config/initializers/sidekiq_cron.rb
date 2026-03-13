schedule_file = Rails.root.join("config/schedule.yml")

Sidekiq.configure_server do |config|
  config.on(:startup) do
    schedule = YAML.load(ERB.new(File.read(schedule_file)).result)
    Sidekiq::Cron::Job.load_from_hash(schedule)
  end
end
