class DeleteGuestUsersJob < ApplicationJob
  queue_as :cron

  def perform
    User.where(is_guest: true).
      where(created_at: ...24.hours.ago).
      find_each(&:destroy)
  end
end
