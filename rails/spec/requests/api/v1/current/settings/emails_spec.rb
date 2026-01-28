require "rails_helper"

RSpec.describe "Api::V1::Current::Settings::Emails", type: :request do
  describe "POST api/v1/current/settings/email" do
    subject { post(api_v1_current_settings_email_path, params:, headers:) }

    let(:current_user) { create(:user) }
    let(:params) { { email: "new@example.com" } }
    let(:headers) { current_user.create_new_auth_token }

    context "メールアドレスが入力された時" do
      it "確認メールが送信される" do
        subject
        current_user.reload
        expect(current_user.unconfirmed_email).to eq "new@example.com"
        expect(current_user.email_change_token).to be_present
        expect(current_user.email_change_sent_at).to be_present
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/v1/current/settings/email/confirm" do
    subject { get(confirm_api_v1_current_settings_email_path, params: params) }

    let(:current_user) { create(:user, unconfirmed_email: "new@example.com") }
    let(:params) { { token: token } }
    let(:token) { "test-token" }

    before do
      current_user.update!(
        email_change_token: token,
        email_change_sent_at: Time.current,
      )
    end

    context "正しい情報の場合" do
      it "メールアドレスが更新される" do
        subject
        current_user.reload
        expect(current_user.email).to eq "new@example.com"
      end

      it "トークンが削除される" do
        subject
        current_user.reload
        expect(current_user.email_change_token).to be_nil
      end

      it "認証情報が返る" do
        subject
        json = JSON.parse(response.body)
        expect(json["access-token"]).to be_present
        expect(json["client"]).to be_present
        expect(json["uid"]).to be_present
      end
    end

    context "異常がある場合" do
      let(:params) { { token: "invalid-token" } }
      it "無効なトークンの場合は422エラーが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "期限切れトークンの場合" do
      before { current_user.update!(email_change_sent_at: 2.hours.ago) }

      it "422エラーが返る" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
