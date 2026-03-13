module GuestSampleData
  module ReadingBooksData
    READING_BOOKS = [
      { title: "世界の一流は「休日」に何をしているのか",
        author: "越川 慎司",
        image_url: "https://books.google.com/books/content?id=djQtEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        notes: [
          { content: <<~TEXT,
            一流の人ほど、休日をただ休む時間ではなく「回復のための時間」として使っているという話。
            休み方にも工夫があるんだなと感じた。
          TEXT
            tags: ["学び"] },
          { content: <<~TEXT,
            仕事のパフォーマンスは休日の過ごし方で大きく変わるという説明。
            オンとオフの切り替えが大事らしい。
          TEXT
            tags: ["学び", "実践したい"] },
          { content: <<~TEXT,
            休日に新しいことを体験することで、視野が広がるという話。
            旅行や趣味が仕事のアイデアにつながることもあるらしい。
          TEXT
            tags: ["学び", "実践したい"] },
        ] },
      { title: "「好き」を言語化する技術",
        author: "三宅 香帆",
        image_url: "https://books.google.com/books/content?id=KlXU0AEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
      { title: "努力の地図",
        author: "荒木 博行",
        image_url: "https://books.google.com/books/content?id=hQNhEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    ].freeze
  end
end
