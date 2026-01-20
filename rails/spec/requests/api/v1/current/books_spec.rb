require "rails_helper"

RSpec.describe "Api::V1::Current::Books", type: :request do
  include ActiveSupport::Testing::TimeHelpers

  describe "GET api/v1/current/books" do
    subject { get(api_v1_current_books_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }

    before { create_list(:book, 2, user: other_user) }

    context "ログインユーザーに紐づく books レコードが存在するとき" do
      before { create_list(:book, 10, user: current_user) }

      it "正常にレコードを6件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.length).to eq 6
        expect(res[0].keys).to eq ["id", "title", "author", "content", "read_date", "status", "genre_id", "genre_name", "user"]
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

    context "booksが複数存在するとき" do
      before do
        create(:book, title: "古い本", author: "テスト１", read_date: "2024-01-01", status: :finished, user: current_user)
        create(:book, title: "新しい本", author: "テスト2", read_date: "2025-01-01", status: :finished, user: current_user)
      end

      it "read_dateの新しい順に返す" do
        subject
        res = JSON.parse(response.body)
        titles = res.map {|b| b["title"] }
        expect(titles).to eq ["新しい本", "古い本"]
      end
    end

    context "finished と draft の両方が存在するとき" do
      before do
        create(:book, title: "公開中の本", author: "テスト３", read_date: "2024-03-01", status: :finished, user: current_user)
        create(:book, title: "読書中の本", author: "テスト４", read_date: "2025-03-01", status: :reading, user: current_user)
      end

      it "finished の本のみを返す" do
        subject
        res = JSON.parse(response.body)
        titles = res.map {|b| b["title"] }
        expect(titles).to eq ["公開中の本"]
        expect(res.length).to eq 1
      end
    end

    context "ログインしていないとき" do
      let(:headers) { nil }

      it "401を返す" do
        get(api_v1_current_books_path)
        expect(response).to have_http_status(:unauthorized)
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
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "genre_id", "genre_name", "user"]
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
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "genre_id", "genre_name", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づく未保存ステータスが１件のとき" do
      before { create(:book, user: current_user, status: :unsaved) }

      it "既存の未保存ステータス記事を表示する" do
        expect { subject }.not_to change { current_user.books.count }
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "genre_id", "genre_name", "user"]
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
    let(:params) { { "book": { "title": "テストタイトル２", "author": "テスト著者２", "contect": "テスト本文２", "read_date": "2025.10.10", "status": "finished" } } }

    context "id がログインユーザーに紐づく books レコードの id であるとき" do
      let(:current_user_book) { create(:book, title: "テストタイトル１", author: "", content: "テスト本文１", status: :reading, user: current_user) }
      let(:id) { current_user_book.id }

      it "正常にレコードを更新できる" do
        expect { subject }.to change { current_user_book.reload.title }.from("テストタイトル１").to("テストタイトル２") and
          change { current_user_book.reload.author }.from("").to("テスト著者２") and
          change { current_user_book.reload.content }.from("テスト本文１").to("テスト本文２") and
          change { current_user_book.reload.status }.from("draft").to("finished")
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "author", "content", "read_date", "status", "genre_id", "genre_name", "user"]
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

  describe "GET api/v1/current/books/list" do
    subject { get(list_api_v1_current_books_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:params) { {} }

    before do
      create(:book, title: "Ruby入門", author: "伊藤一", read_date: "2025-01-01", status: :finished, user: current_user)
      create(:book, title: "Next.js実践", author: "田中二", status: :finished, user: current_user)
      create(:book, title: "Rails完全ガイド", author: "佐藤三", status: :finished, user: current_user)
      create(:book, title: "Docker基礎", author: "斎藤四", status: :reading, user: current_user)
    end

    context "検索が入力されていないとき" do
      before { create_list(:book, 10, status: :finished, user: current_user) }

      it "finished記事を10件ずつ取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 10
        expect(response).to have_http_status(:ok)
      end
    end

    context "ページネーション機能" do
      before { create_list(:book, 25, status: :finished, user: current_user) }

      it "最初の10件を取得できる" do
        get list_api_v1_current_books_path, headers:, params: { page: 1 }
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 10
        expect(res["meta"]["current_page"]).to eq 1
        expect(response).to have_http_status(:ok)
      end

      it "次の10件を取得できる" do
        get list_api_v1_current_books_path, headers:, params: { page: 2 }
        res = JSON.parse(response.body)
        expect(res["meta"]["current_page"]).to eq 2
        expect(res["books"].length).to eq 10
        expect(response).to have_http_status(:ok)
      end

      it "残りの8件を取得できる" do
        get list_api_v1_current_books_path, headers:, params: { page: 3 }
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 8
        expect(res["meta"]["current_page"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "検索ワード(タイトル)が指定されているとき" do
      let(:params) { { q: "Ruby" } }

      it "タイトルにマッチした記事を取得できる" do
        subject
        res = JSON.parse(response.body)
        titles = res["books"].map {|b| b["title"] }
        expect(titles).to eq ["Ruby入門"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "検索ワード（著者名）が指定されているとき" do
      let(:params) { { q: "田中" } }

      it "著者名にマッチした記事を取得できる" do
        subject
        res = JSON.parse(response.body)
        authors = res["books"].map {|b| b["author"] }
        expect(authors).to eq ["田中二"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "検索ワードにマッチする記事が存在しないとき" do
      let(:params) { { q: "HTML" } }

      it "空の配列が返る" do
        subject
        res = JSON.parse(response.body)
        expect(res["books"]).to eq []
        expect(response).to have_http_status(:ok)
      end
    end

    context "部分一致になっているか" do
      before { create(:book, title: "Ruby応用", author: "佐々木太郎", read_date: "2025-02-01", status: :finished, user: current_user) }

      let(:params) { { q: "Ruby" } }

      it "2件のデータを取得する" do
        subject
        res = JSON.parse(response.body)
        titles = res["books"].map {|b| b["title"] }
        expect(res["books"].length).to eq 2
        expect(titles).to eq ["Ruby応用", "Ruby入門"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ジャンルで絞り込み" do
      let(:novel_genre) { create(:genre, :default, name: "小説") }
      let(:tech_genre) { create(:genre, :default, name: "技術書") }

      before do
        create(:book, title: "小説A", genre: novel_genre, status: :finished, user: current_user)
        create(:book, title: "小説B", genre: novel_genre, status: :finished, user: current_user)
        create(:book, title: "技術書A", genre: tech_genre, status: :finished, user: current_user)
      end

      context "genre_id が指定されているとき" do
        let(:params) { { genre_id: novel_genre.id } }

        it "指定したジャンルの本のみ取得できる" do
          subject
          res = JSON.parse(response.body)
          titles = res["books"].map {|b| b["title"] }
          expect(titles).to contain_exactly("小説A", "小説B")
          expect(response).to have_http_status(:ok)
        end
      end

      context "genre_id と検索ワードが両方指定されているとき" do
        let(:params) { { genre_id: novel_genre.id, q: "小説A" } }

        it "両方の条件にマッチする本のみ取得できる" do
          subject
          res = JSON.parse(response.body)
          titles = res["books"].map {|b| b["title"] }
          expect(titles).to eq ["小説A"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "genre_id にマッチする本がないとき" do
        let(:manga_genre) { create(:genre, :default, name: "漫画") }
        let(:params) { { genre_id: manga_genre.id } }

        it "空の配列が返る" do
          subject
          res = JSON.parse(response.body)
          expect(res["books"]).to eq []
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "GET api/v1/current/books/reading" do
    subject { get(reading_api_v1_current_books_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:params) { {} }

    before do
      create(:book, title: "Ruby入門", author: "伊藤一", status: :finished, user: current_user)
      create(:book, title: "Next.js実践", author: "田中二", status: :finished, user: current_user)
      create(:book, title: "Rails完全ガイド", author: "佐藤三", status: :finished, user: current_user)
      create(:book, title: "Docker基礎", author: "斎藤四", status: :reading, user: current_user)
    end

    context "readingを正常に取得できる" do
      it "reading記事を1件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 1
        expect(res["books"][0]["status"]).to eq "読書中"
        expect(response).to have_http_status(:ok)
      end
    end

    context "ページネーション機能" do
      before { create_list(:book, 25, status: :reading, user: current_user) }

      it "最初の10件を取得する" do
        get reading_api_v1_current_books_path, headers:, params: { page: 1 }
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 10
        expect(res["meta"]["current_page"]).to eq 1
        expect(response).to have_http_status(:ok)
      end

      it "次の10件を取得できる" do
        get reading_api_v1_current_books_path, headers:, params: { page: 2 }
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 10
        expect(res["meta"]["current_page"]).to eq 2
        expect(response).to have_http_status(:ok)
      end

      it "残りの6件を取得できる" do
        get reading_api_v1_current_books_path, headers:, params: { page: 3 }
        res = JSON.parse(response.body)
        expect(res["books"].length).to eq 6
        expect(res["meta"]["current_page"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "DELETE api/v1/current/books/:id" do
    let!(:current_user) { create(:user) }
    let!(:headers) { current_user.create_new_auth_token }

    context "finishedの記事を削除できる" do
      let!(:book) { create(:book, status: :finished, user: current_user) }
      it "削除できる" do
        expect {
          delete api_v1_current_book_path(book.id), headers: headers
        }.to change { Book.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "draftの記事を削除できる" do
      let!(:book) { create(:book, status: :reading, user: current_user) }
      it "削除できる" do
        expect {
          delete api_v1_current_book_path(book.id), headers: headers
        }.to change { Book.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "ログインしていない場合" do
      let!(:book) { create(:book, status: :finished, user: current_user) }
      it "削除できない" do
        expect {
          delete api_v1_current_book_path(book.id)
        }.not_to change { Book.count }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "他のユーザーの記事" do
      let!(:other_user) { create(:user) }
      let!(:book) { create(:book, status: :finished, user: other_user) }
      it "削除できない" do
        expect {
          delete api_v1_current_book_path(book.id), headers: headers
        }.not_to change { Book.count }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "GET api/v1/current/books/counts" do
    subject { get(counts_api_v1_current_books_path, headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }

    before do
      travel_to Time.zone.local(2025, 6, 15)

      create(:book, user: current_user, read_date: Time.current.beginning_of_month + 1.day)
      create(:book, user: current_user, read_date: 5.months.ago)
      create(:book, user: current_user, read_date: 2.years.ago)
    end

    after do
      travel_back
    end

    it "正しく counts を返す" do
      subject
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["finished_this_month"]).to eq 1
      expect(json["finished_this_year"]).to eq 2
      expect(json["total_count"]).to eq 3
    end
  end
end
