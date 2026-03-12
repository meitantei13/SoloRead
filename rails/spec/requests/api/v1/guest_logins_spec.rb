require "rails_helper"

RSpec.describe "Api::V1::GuestLogins", type: :request do
  # ゲストアカウントで使用する実際のデータ
  before { Rails.application.load_seed }

  describe "POST api/v1/guest_logins" do
    subject { post(api_v1_guest_logins_path) }

    it "ゲストログインユーザーを作成できる" do
      expect { subject }.to change { User.count }.by(1)
      expect(response).to have_http_status(:ok)

      json = response.parsed_body
      expect(json["data"]["name"]).to eq("ゲストユーザー")
      expect(json["data"]["email"]).to match(/\Aguest_.+@example\.com\z/)
      expect(json["data"]["is_guest"]).to be(true)
    end

    it "ヘッダーが正常に作成できる" do
      subject
      res = response.headers
      expect(res["access-token"]).to be_present
      expect(res["client"]).to be_present
      expect(res["uid"]).to be_present
    end

    it "毎回別のアカウントが作成される" do
      post api_v1_guest_logins_path
      post api_v1_guest_logins_path

      expect(User.count).to eq(2)
    end
  end
end
