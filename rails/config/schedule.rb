set :output, "log/cron.log"

every 1.day, at: "3:00 am" do
  runner "User.cleanup_guest_users"
end
