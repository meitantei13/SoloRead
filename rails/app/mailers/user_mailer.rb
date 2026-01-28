class UserMailer < ApplicationMailer
  def email_change_confirmation(user, token)
    @user = user
    @token = token

    mail(
      to: user.unconfirmed_email,
      subject: "【Solo Read】メールアドレス変更の確認",
    )
  end
end
