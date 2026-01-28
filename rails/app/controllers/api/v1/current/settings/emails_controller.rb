class Api::V1::Current::Settings::EmailsController < Api::V1::BaseController
  TOKEN_EXPIRE_HOURS = 1

  before_action :authenticate_user!, only: :create

  def create
    token = SecureRandom.urlsafe_base64

    current_user.update!(
      unconfirmed_email: params[:email],
      email_change_token: token,
      email_change_sent_at: Time.current,
    )

    UserMailer.
      email_change_confirmation(current_user, token).
      deliver_later

    render json: {
      message: "確認メールを送信しました。",
    }, status: :ok
  end

  def confirm
    user = User.find_by(email_change_token: params[:token])

    return render_invalid_token if invalid_email_change_token?(user)

    user.update!(
      email: user.unconfirmed_email,
      uid: user.unconfirmed_email,
      unconfirmed_email: nil,
      email_change_token: nil,
      email_change_sent_at: nil,
    )

    new_token = user.create_new_auth_token
    render json: {
      message: "メールアドレスを更新しました。",
      "access-token": new_token["access-token"],
      client: new_token["client"],
      uid: new_token["uid"],
    }, status: :ok
  end

  private

    def invalid_email_change_token?(user)
      user.nil? ||
        user.email_change_sent_at < TOKEN_EXPIRE_HOURS.hours.ago ||
        user.unconfirmed_email.blank?
    end

    def render_invalid_token
      render json: {
        message: "このリンクは無効です。",
      }, status: :unprocessable_entity
    end
end
