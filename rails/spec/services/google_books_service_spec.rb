RSpec.describe GoogleBooksService do
  describe "#search" do
    context "正常にレスポンスが返る場合" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_return(
            status: 200,
            body: { items: [{ volumeInfo: { title: "Ruby入門", authors: ["著者A"], imageLinks: { thumbnail: "http://test.com/image.jpg" } } }] }.to_json,
          )
      end

      it "本の情報を返す&https:// に変換" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result.first[:title]).to eq("Ruby入門")
        expect(result.first[:image_url]).to start_with("https://")
      end
    end

    context "検索結果0件の場合" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Next")).
          to_return(
            status: 200,
            body: { items: [] }.to_json,
          )
      end

      it "検索結果が0件のとき" do
        result = GoogleBooksService.new.search("Next")
        expect(result).to eq []
      end
    end

    context "authors が nil の場合（著者データ無し）" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_return(
            status: 200,
            body: { items: [{ volumeInfo: { title: "Ruby入門", imageLinks: { thumbnail: "http://test.com/image.jpg" } } }] }.to_json,
          )
      end

      it "本の情報を返す" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result.first[:title]).to eq("Ruby入門")
        expect(result.first[:author]).to be_nil
        expect(result.first[:image_url]).to start_with("https://")
      end
    end

    context "imageLinks が nil の場合（表紙データ無し）" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_return(
            status: 200,
            body: { items: [{ volumeInfo: { title: "Ruby入門", authors: ["著者A"] } }] }.to_json,
          )
      end

      it "本の情報を返す" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result.first[:title]).to eq("Ruby入門")
        expect(result.first[:image_url]).to be_nil
      end
    end

    context "API が 500 を返す" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_return(
            status: 500,
          )
      end

      it "エラーメッセージを返す" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result[:error]).to eq("Google Books との通信に失敗しました")
      end
    end

    context "例外が発生したとき（通信失敗）" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_raise(Faraday::ConnectionFailed)
      end

      it "エラーメッセージを返す" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result[:error]).to eq("Google Books との通信に失敗しました")
      end
    end

    context "JSONパスエラーのとき" do
      before do
        stub_request(:get, "https://www.googleapis.com/books/v1/volumes").
          with(query: hash_including(q: "Ruby")).
          to_return(status: 200, body: "JSONではない")
      end

      it "エラーメッセージを返す" do
        result = GoogleBooksService.new.search("Ruby")
        expect(result[:error]).to eq("Google Books との通信に失敗しました")
      end
    end
  end
end
