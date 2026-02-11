require "rails_helper"

RSpec.describe "Api::V1::Current::Genres", type: :request do
  describe "GET api/v1/current/genres" do
    subject { get(api_v1_current_genres_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }

    context "ログインユーザーに紐づく genres レコードが存在するとき" do
      let!(:default_genre) { create(:genre, :default, name: "小説") }
      let!(:user_genre) { create(:genre, name: "スポーツ", user: current_user) }
      let!(:other_user_genre) { create(:genre, name: "料理", user: other_user) }
      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res.length).to eq 2
        expect(res.pluck("name")).to contain_exactly("小説", "スポーツ")
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "POST api/v1/current/genres" do
    subject { post(api_v1_current_genres_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:params) { { genre: { name: "スポーツ" } } }

    it "新しいジャンルが作成される" do
      expect { subject }.to change { current_user.genres.count }.by(1)
      res = response.parsed_body
      expect(res["name"]).to eq "スポーツ"
      expect(response).to have_http_status(:ok)
    end
  end
end
