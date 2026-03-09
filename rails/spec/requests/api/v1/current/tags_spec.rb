require "rails_helper"

RSpec.describe "Api::V1::Current::Tags", type: :request do
  describe "GET api/v1/current/tags" do
    subject { get(api_v1_current_tags_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    before do
      create(:tag, :default, name: "名言")
      create(:tag, name: "カスタム", user: current_user)
    end

    it "ログインユーザーに紐づく tags レコードを取得できる" do
      subject
      res = response.parsed_body
      expect(res.length).to eq 2
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST api/v1/current/tags" do
    subject { post(api_v1_current_tags_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:params) { { tag: { name: "スポーツ" } } }

    it "新しいタグが作成される" do
      expect { subject }.to change { current_user.tags.count }.by(1)
      res = response.parsed_body
      expect(res["name"]).to eq "スポーツ"
      expect(response).to have_http_status(:ok)
    end

    context "デフォルトタグと同じ名前のとき" do
      before { create(:tag, :default, name: "スポーツ") }

      it "エラーが返る" do
        expect { subject }.not_to change { current_user.tags.count }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "既存タグと同じ名前のとき" do
      before { create(:tag, name: "スポーツ", user: current_user) }

      it "エラーが返る" do
        expect { subject }.not_to change { current_user.tags.count }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE api/v1/current/tags/id" do
    subject { delete(api_v1_current_tag_path(id), headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let!(:current_user_tag) { create(:tag, name: "趣味", user: current_user) }
    let(:id) { current_user_tag.id }

    context "id がログインユーザーに紐づく tag レコードのとき" do
      it "正常に削除できる" do
        expect { subject }.to change { current_user.tags.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "id が他ユーザーの tag レコードのとき" do
      let(:id) do
        other_user = create(:user)
        create(:tag, user: other_user).id
      end

      it "削除できない" do
        expect { subject }.not_to change { current_user.tags.count }
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
