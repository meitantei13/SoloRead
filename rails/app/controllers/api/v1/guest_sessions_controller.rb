class Api::V1::GuestSessionsController < ApplicationController
  def create
    guest = User.create!(
      name: "ゲストユーザー",
      email: "guest_#{SecureRandom.uuid}@example.com",
      password: SecureRandom.urlsafe_base64,
      is_guest: true,
    )

    guest.update!(
      email: "guest_#{guest.id}@example.com",
    )

    token = guest.create_new_auth_token

    response.set_header("access-token", token["access-token"])
    response.set_header("client", token["client"])
    response.set_header("uid", token["uid"])

    render json: { data: guest }
  end
end
