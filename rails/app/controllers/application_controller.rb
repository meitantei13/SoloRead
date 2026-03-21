class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_active_storage_url_options

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

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end

    def set_active_storage_url_options
      ActiveStorage::Current.url_options = {
        protocol: request.protocol,
        host: request.host,
        port: request.port,
      }
    end
end
