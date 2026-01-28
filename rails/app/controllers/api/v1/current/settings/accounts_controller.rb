class Api::V1::Current::Settings::AccountsController < Api::V1::BaseController
  before_action :authenticate_user!
  skip_after_action :update_auth_header, only: :destroy

  def destroy
    current_user.destroy!

    render json: {
      message: "アカウントを削除しました。",
    }, status: :ok
  end
end
