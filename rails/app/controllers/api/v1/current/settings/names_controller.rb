class Api::V1::Current::Settings::NamesController < Api::V1::BaseController
  before_action :authenticate_user!

  def update
    current_user.update!(name: params[:name])

    render json: {
      message: "ユーザーネームを更新しました。",
    }, status: :ok
  end
end
