require "rails_helper"

RSpec.describe "Api::V1::Current::Users", type: :request do
  describe "GET api/v1/current/user" do
    subject { get(api_v1_current_user_path, headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }

    context "ヘッダー情報が正常に送られた時" do
      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res.keys).to eq ["id", "name", "email", "yearly_reading_goal"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ヘッダー情報が空のままリクエストが送信された時" do
      let(:headers) { nil }

      it "unauthorized エラーが返る" do
        subject
        res = response.parsed_body
        expect(res["errors"]).to eq ["ログインもしくはアカウント登録してください。"]
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH api/v1/current/user" do
    subject { patch(api_v1_current_user_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context "ログインユーザーのデータを更新する" do
      let(:params) { { user: { yearly_reading_goal: "30" } } }

      it "正常にデータを更新できる" do
        subject
        res = response.parsed_body
        expect(res["yearly_reading_goal"]).to eq 30
        expect(response).to have_http_status(:ok)
      end
    end

    context "バリデーションエラーの場合" do
      let(:params) { { user: { yearly_reading_goal: 0 } } }

      it "422エラーが返る" do
        expect { subject }.not_to change { current_user.reload.yearly_reading_goal }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
