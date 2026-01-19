# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solo Read is a private reading management app where users track their reading records without public exposure. The app uses a separated architecture: Rails API backend + Next.js frontend.

## Development Commands

### Docker Development Environment

```bash
# Start all services (db, rails, next, sidekiq, redis)
docker compose up -d

# Access Rails container
docker compose exec rails bash

# Access Next.js container
docker compose exec next bash
```

### Rails Backend (run inside rails container or `rails/` directory)

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/book_spec.rb

# Run specific test by line number
bundle exec rspec spec/models/book_spec.rb:10

# Lint code
bundle exec rubocop

# Auto-fix lint issues
bundle exec rubocop -a

# Database operations
bundle exec rails db:migrate
bundle exec rails db:seed
```

### Next.js Frontend (run inside next container or `next/` directory)

```bash
# Install dependencies
npm install

# Run development server (port 3000 inside container, 8000 on host)
npm run dev

# Build production
npm run build

# Lint code
npm run lint

# Auto-fix lint issues
npm run format
```

## Architecture

### Directory Structure

- `rails/` - Rails API backend (port 3000)
- `next/` - Next.js frontend (port 8000 on host)
- `nginx/` - Nginx configuration

### Backend (Rails API)

- **API Namespace**: All endpoints under `/api/v1/`
- **Authentication**: Devise Token Auth with token-based authentication
- **Key Controllers**:
  - `api/v1/current/books_controller.rb` - Book CRUD for authenticated user
  - `api/v1/guest_sessions_controller.rb` - Guest login handling
- **Models**:
  - `User` - has_many :books, includes guest user cleanup logic
  - `Book` - belongs_to :user, enum status: { unsaved: 10, reading: 20, finished: 30 }
- **Background Jobs**: Sidekiq with sidekiq-cron for scheduled tasks (e.g., guest user cleanup)

### Frontend (Next.js)

- **Pages Structure**:
  - `/` - Landing page
  - `/sign_in`, `/sign_up` - Authentication
  - `/current/books/` - Book listing and management
  - `/current/books/[id]` - Book detail
  - `/current/books/edit/[id]` - Book editing
  - `/current/books/drafts` - Reading in progress
- **State Management**: SWR for data fetching and caching, custom hooks in `src/hooks/`
- **API Communication**: Axios with token auth headers stored in localStorage
- **UI Libraries**: MUI (Material-UI) and shadcn/ui components

### Authentication Flow

Frontend stores three values in localStorage after login:
- `access-token`
- `client`
- `uid`

These are sent with every API request via headers.

### Book Status Workflow

1. `unsaved` (10) - Draft created but not saved
2. `reading` (20) - Currently reading
3. `finished` (30) - Completed with read_date

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- `ci.yml` - Runs rspec, rubocop, eslint on push (except main)
- `cd.yml` - Deployment to AWS ECS

## Contribution Rules for AI Agents

- Do NOT modify production code unless explicitly instructed.
- Prefer adding or improving tests over refactoring existing code.
- Follow existing architectural patterns; do not introduce new abstractions without approval.
- Keep changes minimal and scoped to the requested task.
- Avoid touching both frontend and backend in a single change unless required.
- When unsure, ask clarifying questions before making changes.