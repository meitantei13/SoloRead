require "rails_helper"

RSpec.describe "Api::V1::Current::Settings::Accounts", type: :request do
  describe "DELETE api/v1/current/settings/account" do
    subject { delete(api_v1_current_settings_account_path, headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }
    let!(:book) { create(:book, user: current_user) }

    context "正常にアカウントが削除される" do
      it "アカウントが削除される" do
        subject
        expect(User.find_by(id: current_user.id)).to be_nil
        expect(response).to have_http_status(:ok)
      end

      it "削除ユーザーに紐づく本のデータも削除される" do
        subject
        expect(Book.find_by(id: book.id)).to be_nil
      end
    end
  end
end
