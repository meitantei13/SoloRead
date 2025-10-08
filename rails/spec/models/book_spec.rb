require "rails_helper"

RSpec.describe Book, type: :model do
  context "factoryのデフォルト設定に従ったとき" do
    subject { create(:book) }

    it "正常にレコードを新規作成できる" do
      expect { subject }.to change { Book.count }.by(1)
    end
  end

  describe "Validations" do
    subject { book.valid? }

    let(:book) { build(:book, title:, author:, content:, read_date:, status:, user:) }
    let(:title) { Faker::Lorem.sentence }
    let(:author) { Faker::Name.name }
    let(:content) { Faker::Lorem.paragraph }
    let(:read_date) { Faker::Date.between(from: Time.zone.today - 365, to: Time.zone.today) }
    let(:status) { :published }
    let(:user) { create(:user) }

    context "すべての値が正常なとき" do
      it "検証が通る" do
        expect(subject).to be_truthy
      end
    end

    context "ステータスが投稿済みかつ、著者名が空欄のとき" do
      let(:author) { "" }

      it "検証が通る" do
        expect(subject).to be_truthy
      end
    end

    context "ステータスが投稿済みかつ、タイトルが空のとき" do
      let(:title) { "" }

      it "エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(book.errors.full_messages).to eq ["タイトルを入力してください"]
      end
    end

    context "ステータスが投稿済みかつ、本文が空のとき" do
      let(:content) { "" }

      it "エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(book.errors.full_messages).to eq ["感想を入力してください"]
      end
    end

    context "ステータスが投稿済みかつ、読了日が空のとき" do
      let(:read_date) { "" }

      it "エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(book.errors.full_messages).to eq ["読了日を入力してください"]
      end
    end

    context "ステータスが未保存かつ、すでに同ユーザーが未保存ステータスの記事を所有していたとき" do
      let(:status) { :unsaved }
      before { create(:book, status: :unsaved, user:) }

      it "例外が発生する" do
        expect { subject }.to raise_error(StandardError)
      end
    end
  end
end
