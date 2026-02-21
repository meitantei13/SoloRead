class Api::V1::Current::UsersController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    current_user.update!(current_user_params)
    render json: current_user, serializer: CurrentUserSerializer
  end

  private

    def current_user_params
      params.expect(user: [:yearly_reading_goal])
    end
end
