require "rails_helper"

RSpec.describe "Api::V1::Current::Books", type: :request do
  describe "GET api/v1/current/books" do
    subject { get(api_v1_current_books_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }

    before { create_list(:book, 2, user: other_user) }

    context "ログインユーザーに紐づく books レコードが存在するとき" do
      before { create_list(:book, 7, user: current_user) }

      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res.length).to eq 6
        expect(res[0].keys).to eq ["id", "title", "author", "content", "status", "read_date", "user"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づくbooks レコードが存在しないとき" do
      it "空の配列が返る" do
        subject
        res = response.parsed_body
        expect(res).to eq []
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/v1/current/books/:id" do
    subject { get(api_v1_current_book_path(id), headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context ":id がログインユーザーに紐づく books レコードの id であるとき" do
      let(:current_user_book) { create(:book, user: current_user) }
      let(:id) { current_user_book.id }

      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res.keys).to eq ["id", "title", "author", "content", "status", "read_date", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context ":id がログインユーザーに紐づく books レコードの id ではないとき" do
      let(:other_user_book) { create(:book) }
      let(:id) { other_user_book.id }

      it "404エラーが返る" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
