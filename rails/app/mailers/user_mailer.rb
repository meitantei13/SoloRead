class UserMailer < ApplicationMailer
  def email_change_confirmation(user, token)
    @user = user
    @token = token

    mail(
      to: user.unconfirmed_email,
      subject: t(".subject"),
    )
  end
end
