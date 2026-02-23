require "rails_helper"

RSpec.describe "Api::V1::Current::Notes", type: :request do
  describe "GET api/v1/current/notes" do
    subject { get(api_v1_current_notes_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:current_user_book) { create(:book, user: current_user) }
    let(:other_user) { create(:user) }
    let(:other_user_book) { create(:book, user: other_user) }
    let(:params) { {} }

    before { create_list(:note, 2, user: other_user, book: other_user_book) }

    context "ログインユーザーに紐づく notes レコードを取得できる" do
      before { create_list(:note, 3, user: current_user, book: current_user_book) }

      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res["notes"].length).to eq 3
        expect(res["notes"][0].keys).to eq ["id", "content", "book_id", "book_title", "created_at", "tags"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ページネーションが正常に動いている" do
      before { create_list(:note, 20, user: current_user, book: current_user_book) }

      context "1ページ目" do
        let(:params) { { page: 1 } }

        it "1ページ目に10件のデータを取得できる" do
          subject
          res = response.parsed_body
          expect(res["notes"].length).to eq 15
          expect(response).to have_http_status(:ok)
        end
      end

      context "2ページ目" do
        let(:params) { { page: 2 } }
        it "2ページ目に3件のデータを取得できる" do
          subject
          res = response.parsed_body
          expect(res["notes"].length).to eq 5
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "note の内容で検索" do
      before do
        create(:note, content: "サンプル１", user: current_user, book: current_user_book)
        create(:note, content: "サンプル２", user: current_user, book: current_user_book)
      end

      let(:params) { { q: "サンプル１" } }

      it "該当する note レコードが返る" do
        subject
        res = response.parsed_body
        expect(res["notes"].length).to eq 1
        expect(res["notes"][0]["content"]).to eq "サンプル１"
        expect(response).to have_http_status(:ok)
      end

      context "複数該当がある場合" do
        before do
          create(:note, content: "サンプル３", user: current_user, book: current_user_book)
        end

        let!(:params) { { q: "サンプル" } }

        it "複数該当がある場合" do
          subject
          res = response.parsed_body
          expect(res["notes"].length).to eq 3
          expect(res["notes"][0]["content"]).to eq "サンプル３"
          expect(res["notes"][1]["content"]).to eq "サンプル２"
          expect(res["notes"][2]["content"]).to eq "サンプル１"
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "タグで検索" do
      let(:params) { { tag_id: @tag_novel.id } }

      before do
        @tag_sports = create(:tag, name: "スポーツ", user: current_user)
        @tag_novel = create(:tag, name: "小説", user: current_user)

        note1 = create(:note, content: "タグ検索１", user: current_user, book: current_user_book)
        create(:note_tag, note: note1, tag: @tag_sports)

        note2 = create(:note, content: "タグ検索２", user: current_user, book: current_user_book)
        create(:note_tag, note: note2, tag: @tag_novel)
      end

      it "該当するレコードが返る" do
        subject
        res = response.parsed_body
        expect(res["notes"].length).to eq 1
        expect(res["notes"][0]["content"]).to eq "タグ検索２"
        expect(response).to have_http_status(:ok)
      end

      context "内容とタグでの検索" do
        before do
          note3 = create(:note, content: "タグ検索３", user: current_user, book: current_user_book)
          create(:note_tag, note: note3, tag: @tag_sports)
        end

        let(:params) { { q: "検索", tag_id: @tag_sports.id } }

        it "該当するレコードが返る" do
          subject
          res = response.parsed_body
          expect(res["notes"].length).to eq 2
          expect(res["notes"][0]["content"]).to eq "タグ検索３"
          expect(res["notes"][1]["content"]).to eq "タグ検索１"
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "POST api/v1/current/notes" do
    subject { post(api_v1_current_notes_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:params) { { note: { content: "テストメモ", book_id: current_user_book.id } } }
    let(:current_user) { create(:user) }
    let(:current_user_book) { create(:book, user: current_user) }

    it "新規ノートを作成できる" do
      expect { subject }.to change { current_user.notes.count }.by(1)
      res = response.parsed_body
      expect(res.keys).to eq ["id", "content", "book_id", "book_title", "created_at", "tags"]
      expect(res["content"]).to eq "テストメモ"
      expect(res["book_id"]).to eq current_user_book.id
      expect(response).to have_http_status(:ok)
    end

    context "content が空" do
      let(:params) { { note: { content: "", book_id: current_user_book.id } } }

      it "エラーが返る" do
        expect { subject }.not_to change { Note.count }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "PATCH api/v1/current/notes/:id" do
    subject { patch(api_v1_current_note_path(id), headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:current_user_book) { create(:book, user: current_user) }
    let(:note) { create(:note, user: current_user, book: current_user_book, content: "更新前") }
    let(:id) { note.id }
    let(:params) { { note: { content: "更新後", book_id: current_user_book.id } } }

    it "ノートを更新できる" do
      subject
      res = response.parsed_body
      expect(res["content"]).to eq "更新後"
      expect(response).to have_http_status(:ok)
    end
  end

  describe "DELETE api/v1/current/notes/:id" do
    subject { delete(api_v1_current_note_path(id), headers:) }

    let(:current_user) { create(:user) }
    let(:current_user_book) { create(:book, user: current_user) }
    let(:headers) { current_user.create_new_auth_token }
    let!(:current_user_note) { create(:note, user: current_user, book: current_user_book) }
    let(:id) { current_user_note.id }

    context "id がログインユーザーに紐づく note レコードのとき" do
      it "正常に削除できる" do
        expect { subject }.to change { current_user.notes.count }.by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "id が他ユーザーの note レコードのとき" do
      let(:id) do
        other_user = create(:user)
        other_user_book = create(:book, user: other_user)
        create(:note, user: other_user, book: other_user_book).id
      end

      it "削除できない" do
        expect { subject }.not_to change { current_user.notes.count }
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
