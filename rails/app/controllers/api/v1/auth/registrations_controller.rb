class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    email = sign_up_params[:email].to_s.downcase.strip
    existing_user = User.find_by(email: email)
    existing_user.destroy! if existing_user && existing_user.confirmed_at.nil?

    super
  end
end
