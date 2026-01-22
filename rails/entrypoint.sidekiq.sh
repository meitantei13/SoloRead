#!/bin/bash
set -e

echo "Start entrypoint.sidekiq.sh"

exec bundle exec sidekiq -C config/sidekiq.yml
