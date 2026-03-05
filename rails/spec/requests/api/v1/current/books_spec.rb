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

      it "正常にレコードを6件取得できる" do
        subject
        res = response.parsed_body
        expect(res.length).to eq 6
        expect(res[0].keys).to eq ["id", "title", "author", "content", "status", "read_date", "genre_id", "genre_name", "image_url", "cover_image", "user"]
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
        expect(res.keys).to eq ["id", "title", "author", "content", "status", "read_date", "genre_id", "genre_name", "image_url", "cover_image", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(res["cover_image"]).to be_nil
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

  describe "POST api/v1/current/books" do
    subject { post(api_v1_current_books_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context "ログインユーザーに紐づく未保存ステータスの記事が０件のとき" do
      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.to change { current_user.books.count }.by(1)
        expect(current_user.books.last).to be_unsaved
        res = response.parsed_body
        expect(res.keys).to eq ["id", "title", "author", "content", "status", "read_date", "genre_id", "genre_name", "image_url", "cover_image", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が１件のとき" do
      before { create(:book, user: current_user, status: :unsaved) }

      it "既存の未保存ステータスの記事を表示する" do
        expect { subject }.not_to change { current_user.books.count }
        res = response.parsed_body
        expect(res.keys).to eq ["id", "title", "author", "content", "status", "read_date", "genre_id", "genre_name", "image_url", "cover_image", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PATCH api/v1/current/books/:id" do
    subject { patch(api_v1_current_book_path(id), headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:other_user) }
    let(:params) { { book: { title: "テストタイトル２", author: "テスト著者２", content: "テスト本文２", read_date: "2026.2.7", status: "finished" } } }

    context ":id がログインユーザーに紐づく book レコードの id であるとき" do
      let(:current_user_book) { create(:book, title: "テストタイトル１", author: "", content: "", read_date: "", status: "reading", user: current_user) }
      let(:id) { current_user_book.id }

      it "正常にレコードを更新できる" do
        expect { subject }.to change { current_user_book.reload.title }.from("テストタイトル１").to("テストタイトル２") and
          change { current_user_book.reload.auther }.from("").to("テスト著者２") and
          change { current_user_book.reload.content }.from("").to("テスト本文２") and
          change { current_user_book.reload.read_date }.from("").to("2026.2.7") and
          change { current_user_book.reload.status }.from("reading").to("finished")
        res = response.parsed_body
        expect(res.keys).to eq ["id", "title", "author", "content", "status", "read_date", "genre_id", "genre_name", "image_url", "cover_image", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PATCH api/v1/current/books/:id （画像アップロード）" do
    subject { patch(api_v1_current_book_path(id), headers:, params:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }
    let(:book) { create(:book, user: current_user) }
    let(:id) { book.id }
    let(:image) { fixture_file_upload(Rails.root.join("spec/fixtures/files/test.jpg"), "image/jpeg") }
    let(:params) { { book: { cover_image: image } } }

    it "画像をアップロードできる" do
      subject
      res = response.parsed_body
      expect(res["cover_image"]).to be_present
      expect(book.reload.cover_image).to be_attached
      expect(response).to have_http_status(:ok)
    end
  end

  describe "DELETE api/v1/current/books/:id" do
    subject { delete(api_v1_current_book_path(id), headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }

    context ":id がログインユーザーに紐づく finished の book レコードの id であるとき" do
      let!(:current_user_book) { create(:book, user: current_user, status: :finished) }
      let(:id) { current_user_book.id }

      it "正常にレコードを削除できる" do
        expect { subject }.to change { current_user.books.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context ":id がログインユーザーに紐づく reading の book レコードの id であるとき" do
      let!(:current_user_book) { create(:book, user: current_user, status: :reading) }
      let(:id) { current_user_book.id }

      it "正常にレコードを削除できる" do
        expect { subject }.to change { current_user.books.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context ":id がログインユーザーに紐づく book レコードの id ではないとき" do
      let(:other_user) { create(:user) }
      let(:other_user_book) { create(:book, user: other_user) }
      let(:id) { other_user_book.id }

      it "404エラーが返る" do
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

    context "正常にリストを取得できる(検索なし)" do
      before { create_list(:book, 13, user: current_user) }

      it "最初の１０件を取得できる" do
        get(list_api_v1_current_books_path, headers:, params: { page: 1 })
        res = response.parsed_body
        expect(res["books"].length).to eq 10
        expect(response).to have_http_status(:ok)
      end

      it "次の3件が取得できる" do
        get(list_api_v1_current_books_path, headers:, params: { page: 2 })
        res = response.parsed_body
        expect(res["books"].length).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "検索ワード（タイトル）が指定されているとき" do
      before do
        create(:book, title: "Ruby入門", author: "伊藤一", read_date: "2026-01-01", status: :finished, user: current_user)
        create(:book, title: "Next.js実践", author: "田中二", status: :finished, user: current_user)
        create(:book, title: "Docker基礎", author: "佐藤三", status: :finished, user: current_user)
      end

      context "タイトルにマッチした記事を取得できる" do
        let(:params) { { q: "Ruby" } }

        it "該当するタイトルの記事を取得" do
          subject
          res = response.parsed_body
          titles = res["books"].map {|b| b["title"] }
          expect(titles).to eq ["Ruby入門"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "著者にマッチした記事を取得できる" do
        let(:params) { { q: "田中" } }
        it "該当する著者の記事を取得" do
          subject
          res = response.parsed_body
          author = res["books"].map {|b| b["author"] }
          expect(author).to eq ["田中二"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "検索ワードに該当する記事が存在しないとき" do
        let(:params) { { q: "HTML" } }
        it "空の配列が返る" do
          subject
          res = response.parsed_body
          expect(res["books"]).to eq []
          expect(response).to have_http_status(:ok)
        end
      end

      context "部分一致になっているか" do
        before { create(:book, title: "Ruby応用", author: "伊藤一", read_date: "2026-02-01", status: :finished, user: current_user) }

        let(:params) { { q: "Ruby" } }
        it "2件のデータを取得" do
          subject
          res = response.parsed_body
          titles = res["books"].map {|b| b["title"] }
          expect(res["books"].length).to eq 2
          expect(titles).to eq ["Ruby応用", "Ruby入門"]
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "ジャンルで絞り込む" do
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
          res = response.parsed_body
          titles = res["books"].map {|b| b["title"] }
          expect(titles).to contain_exactly("小説A", "小説B")
          expect(response).to have_http_status(:ok)
        end
      end

      context "genre_id と検索ワードが両方指定されているとき" do
        let(:params) { { genre_id: novel_genre.id, q: "小説A" } }

        it "両方の条件にマッチする本のみ取得できる" do
          subject
          res = response.parsed_body
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
          res = response.parsed_body
          expect(res["books"]).to eq []
          expect(response).to have_http_status(:ok)
        end
      end

      context "genre_id = null が指定されているとき" do
        before { create(:book, title: "Railsテキスト", genre_id: nil, status: :finished, user: current_user) }

        let(:params) { { genre_id: "null" } }

        it "ジャンル未設定の本のみ取得できる" do
          subject
          res = response.parsed_body
          titles = res["books"].map {|b| b["title"] }
          expect(titles).to contain_exactly("Railsテキスト")
          expect(response).to have_http_status(:ok)
        end
      end

      context "genre_id = null と検索ワードが両方指定されているとき" do
        before { create(:book, title: "Railsテキスト", genre_id: nil, status: :finished, user: current_user) }

        let(:params) { { genre_id: "null", q: "Rails" } }

        it "両方の条件にマッチする本のみ取得できる" do
          subject
          res = response.parsed_body
          titles = res["books"].map {|b| b["title"] }
          expect(res["books"].length).to eq 1
          expect(titles).to eq ["Railsテキスト"]
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "GET api/v1/current/books/reading" do
    subject { get(reading_api_v1_current_books_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:params) { {} }

    before { create_list(:book, 2, status: :reading, user: other_user) }

    context "ログインユーザーに紐づく reading データを取得できる" do
      before do
        create_list(:book, 2, status: :reading, user: current_user)
        create(:book, user: current_user)
      end

      it "レコードを2件取得できる" do
        subject
        res = response.parsed_body
        expect(res["books"].length).to eq 2
        expect(response).to have_http_status(:ok)
      end
    end

    context "ページネーション機能" do
      before { create_list(:book, 12, status: :reading, user: current_user) }

      it "最初の10件を取得できる" do
        get(reading_api_v1_current_books_path, headers:, params: { page: 1 })
        res = response.parsed_body
        expect(res["books"].length).to eq 10
        expect(response).to have_http_status(:ok)
      end

      it "次の2件が取得できる" do
        get(reading_api_v1_current_books_path, headers:, params: { page: 2 })
        res = response.parsed_body
        expect(res["books"].length).to eq 2
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
