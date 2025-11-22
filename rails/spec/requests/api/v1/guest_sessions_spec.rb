require "rails_helper"

RSpec.describe "Api::V1::GuestSessions", type: :request do
  describe "POST /api/v1/guest_sessons" do
    subject { post(api_v1_guest_sessions_path) }

    it "ゲストユーザーを正常に作成できる" do
      expect { subject }.to change { User.count }.by(1)
      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json["data"]["name"]).to eq("ゲストユーザー")
      expect(json["data"]["email"]).to match(/guest_\d+@example.com/)
    end

    it "ヘッダーが正常に作成できる" do
      subject
      json = JSON.parse(response.body)
      expect(json["auth_headers"]["access-token"]).to be_present
      expect(json["auth_headers"]["client"]).to be_present
      expect(json["auth_headers"]["uid"]).to be_present
    end

    it "複数アカウントを作成された場合" do
      post api_v1_guest_sessions_path
      first_guest = JSON.parse(response.body)["data"]

      post api_v1_guest_sessions_path
      second_guest = JSON.parse(response.body)["data"]

      expect(first_guest["email"]).not_to eq(second_guest["email"])
      expect(first_guest["id"]).not_to eq(second_guest["id"])
    end
  end
end
