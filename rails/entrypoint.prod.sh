#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# echo "bundle exec rails db:create RAILS_ENV=production"
# bundle exec rails db:create RAILS_ENV=production

# echo "bundle exec rails db:migrate RAILS_ENV=production"
# bundle exec rails db:migrate RAILS_ENV=production

# DB が存在すれば何もしない / なければ作る & migrate
bundle exec rails db:prepare

# echo "bundle exec rails db:seed RAILS_ENV=production"
# bundle exec rails db:seed RAILS_ENV=production

# echo "exec pumactl start"
# bundle exec pumactl start

exec bundle exec puma -C config/puma.rb
