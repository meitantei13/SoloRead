require 'rails_helper'

RSpec.describe "Api::V1::Current::Books", type: :request do
  describe "GET api/v1/current/books/:id" do
    subject { get(api_v1_current_book_path(id), headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context ":id がログインユーザーに紐づく books レコードの id であるとき" do
      let(:current_user_book) { create(:book, user: current_user) }
      let(:id) { current_user_book.id }

      it "正常にレコードを取得できる" do
        subject
        res = JSON.parse(response.body)
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
