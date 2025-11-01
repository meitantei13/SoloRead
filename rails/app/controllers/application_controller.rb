class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession

  private

    def pagination(records)
      {
        current_page: records.current_page,
        next_page: records.next_page,
        prev_page: records.prev_page,
        total_pages: records.total_pages,
        total_count: records.total_count,
      }
    end
end
