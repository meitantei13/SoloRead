#!/bin/bash
set -e

echo "Start entrypoint.sidekiq.sh"

bundle exec rails db:prepare

exec bundle exec sidekiq -C config/sidekiq.yml
