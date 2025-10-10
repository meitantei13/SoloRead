require "rails_helper"

RSpec.describe "Api::V1::Current::Books", type: :request do
  describe "GET api/v1/current/books" do
    subject { get(api_v1_current_books_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }

    before { create_list(:book, 2, user: other_user) }

    context "ログインユーザーに紐づく books レコードが存在するとき" do
      before { create_list(:book, 3, user: current_user) }

      it "正常にレコードを取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.length).to eq 3
        expect(res[0].keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res[0]["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づく books レコードが存在しないとき" do
      it "空の配列が返る" do
        subject
        res = JSON.parse(response.body)
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
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context ":id がログインユーザーに紐づく books レコードの id ではないとき" do
      let(:other_user_book) { create(:book) }
      let(:id) { other_user_book.id }

      it "例外が発生する" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST api/v1/current/books" do
    subject { post(api_v1_current_books_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context "ログインユーザーに紐づく未保存ステータスの記事が0件のとき" do
      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.to change { current_user.books.count }.by(1)
        expect(current_user.books.last).to be_unsaved
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づく未保存ステータスが１件のとき" do
      before { create(:book, user: current_user, status: :unsaved) }

      it "既存の未保存ステータス記事を表示する" do
        expect { subject }.not_to change { current_user.books.count }
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PATCH api/v1/current/books" do
    subject { patch(api_v1_current_book_path(id), headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:params) { { "book": { "title": "テストタイトル２", "author": "テスト著者２", "contect": "テスト本文２", "read_date": "2025.10.10", "status": "published" } } }

    context "id がログインユーザーに紐づく books レコードの id であるとき" do
      let(:current_user_book) { create(:book, title: "テストタイトル１", author: "", content: "テスト本文１", status: :draft, user: current_user) }
      let(:id) { current_user_book.id }

      it "正常にレコードを更新できる" do
        expect { subject }.to change { current_user_book.reload.title }.from("テストタイトル１").to("テストタイトル２") and
          change { current_user_book.reload.author }.from("").to("テスト著者２") and
          change { current_user_book.reload.content }.from("テスト本文１").to("テスト本文２") and
          change { current_user_book.reload.status }.from("draft").to("published")
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context ":id がログインユーザーに紐づく book レコードの id ではないとき" do
      let(:other_user_book) { create(:book, user: other_user) }
      let(:id) { other_user_book.id }

      it "例外が発生する" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
