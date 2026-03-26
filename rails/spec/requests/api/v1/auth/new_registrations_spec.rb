require "rails_helper"

RSpec.describe "Api::V1::Auth::NewRefistraton", type: :request do
  describe "POST api/v1/auth" do
    subject { post(api_v1_user_registration_path, params:) }

    context "正常に新規ユーザーを作成できるとき" do
      let(:params) { { email: "test@example.com", password: "password", password_confirmation: "password", confirm_success_url: "http://localhost:3000" } }
      it "正常に新規ユーザーが作成できる" do
        expect { subject }.to change { User.count }.by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context "メールアドレスが重複しているとき" do
      let!(:other_user) { create(:user, email: "test@example.com") }
      let(:params) { { email: "test@example.com", password: "password", password_confirmation: "password", confirm_success_url: "http://localhost:3000" } }

      it "新規ユーザーは作成されない" do
        expect { subject }.not_to change { User.count }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "削除されたアカウントで使用していたメールアドレスでの再登録ができる" do
      let(:params) { { email: "test@example.com", password: "password", password_confirmation: "password", confirm_success_url: "http://localhost:3000" } }

      before do
        user = create(:user, email: "test@example.com")
        user.destroy!
      end

      it "再登録できる" do
        expect { subject }.to change { User.count }.by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context "未認証のユーザーと同じメールアドレスで登録するとき" do
      let!(:user) { create(:user, email: "test@example.com", confirmed_at: nil) }
      let(:params) { { email: "test@example.com", password: "password", password_confirmation: "password", confirm_success_url: "http://localhost:3000" } }

      it "未認証ユーザーを削除し、新規ユーザーが作成される" do
        expect { subject }.not_to change { User.count }
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
