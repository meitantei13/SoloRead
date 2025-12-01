class CleanupGuestUsersJob < ApplicationJob
  queue_as :cron

  def perform
    User.cleanup_guest_users
    Rails.logger.info "[Sidekiq] cleanup_guest_users executed at #{Time.zone.now}"
  end
end
