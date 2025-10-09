require "rails_helper"

RSpec.describe "Api::V1::Books", type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    create_list(:book, 25, status: :published, user: user)
    create_list(:book, 8, status: :draft, user: user)
  end

  describe "GET api/v1/books" do
    subject { get(api_v1_books_path(params), headers: auth_headers) }

    context "page を params で送信しないとき" do
      let(:params) { nil }

      it "1ページ目のレコードを取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["books", "meta"]
        expect(res["books"].length).to eq 10
        expect(res["books"][0].keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["books"][0]["user"].keys).to eq ["name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 1
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "page をparams で送信したとき" do
      let(:params) { { page: 2 } }

      it "2ページ目のレコードを取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["books", "meta"]
        expect(res["books"].length).to eq 10
        expect(res["books"][0].keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
        expect(res["books"][0]["user"].keys).to eq ["name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 2
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/v1/books/:id" do
    subject { get(api_v1_book_path(book_id), headers: auth_headers) }

    let(:book) { create(:book, status:, user: user) }

    context "book_id に対応する books レコードが存在するとき" do
      let(:book_id) { book.id }

      context "books レコードのステータスが投稿済みのとき" do
        let(:status) { :published }

        it "正常にレコードを取得できる" do
          subject
          res = JSON.parse(response.body)
          expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "user"]
          expect(res["user"].keys).to eq ["name"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "books レコードのステータスが下書きのとき" do
        let(:status) { :draft }

        it "投稿済みのみ表示させたいので、エラーが返る" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "book_id に対する book レコードが存在しないとき" do
      let(:book_id) { 10_000_000_000 }

      it "エラーが返る" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
