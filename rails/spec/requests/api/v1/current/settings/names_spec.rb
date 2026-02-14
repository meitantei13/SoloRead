require "rails_helper"

RSpec.describe "Api::V1::Current::Settings::Name", type: :request do
  describe "PATCH api/v1/current/settings/name" do
    subject { patch(api_v1_current_settings_name_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:params) { { user: { name: "new_name" } } }

    it "ユーザーネームが更新される" do
      subject
      current_user.reload
      expect(current_user["name"]).to eq "new_name"
      expect(response).to have_http_status(:ok)
    end
  end
end
