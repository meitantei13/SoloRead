class GoogleBooksService
  def search(query)
    uri = "https://www.googleapis.com/books/v1/volumes"
    res = Faraday.get(uri, q: query, maxResults: 10, langRestrict: "ja", key: Settings.google_books_api_key)

    # 200 〜 299 以外は空の配列を返す
    # return { error: "Google Books との通信に失敗しました" } unless res.success?

    unless res.success?
      Rails.logger.error("Google Books API error: status=#{res.status}, body=#{res.body}")
      return { error: "Google Books との通信に失敗しました" }
    end


    data = JSON.parse(res.body)

    (data["items"] || []).map do |item|
      info = item["volumeInfo"]
      {
        title: info["title"],
        author: info["authors"]&.join(", "),
        image_url: extract_image(info),
      }
    end
  rescue Faraday::Error => e
    Rails.logger.error("Faraday error: #{e.message}")
    { error: "Google Books との通信に失敗しました" }
  rescue JSON::ParserError => e
    Rails.logger.error("JSON parse error: #{e.message}")
    { error: "Google Books との通信に失敗しました" }
  end

  private

    def extract_image(info)
      image = info.dig("imageLinks", "thumbnail") || info.dig("imageLinks", "smallThumbnail")

      image&.gsub("http://", "https://")
    end
end
