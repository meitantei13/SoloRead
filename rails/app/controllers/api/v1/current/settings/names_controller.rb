class Api::V1::Current::Settings::NamesController < Api::V1::BaseController
  before_action :authenticate_user!

  def update
    current_user.update!(user_params)
    render json: current_user
  end

  private

    def user_params
      params.expect(user: [:name])
    end
end
