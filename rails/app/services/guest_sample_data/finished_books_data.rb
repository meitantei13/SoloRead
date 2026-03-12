module GuestSampleData
  FINISHED_BOOKS = [
    {
      title: "カフネ",
      author: "阿部 暁子",
      content: <<~TEXT,
        静かな日常を舞台に、人との距離や思いやりを丁寧に描く物語。
        派手さはないが、読後に心が軽くなり、静かな読書時間に寄り添う大人におすすめの一冊。
      TEXT
      genre: "小説",
      image_url: "https://books.google.com/books/content?id=xnoHEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "改訂版 本当の自由を手に入れる お金の大学",
      author: "両＠リベ大学長",
      content: <<~TEXT,
        仕事を抱え込みがちな人ほど参考になる内容だった。
        任せることは責任放棄ではなく、相手を信頼する行動だという考え方が印象に残る。
        具体的な伝え方や関わり方も紹介されていて、すぐ実践してみたいと思えた。
      TEXT
      genre: "ビジネス",
      image_url: "https://books.google.com/books/content?id=7kYsEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "任せるコツ",
      author: "山本 渉",
      content: <<~TEXT,
        コーヒーの味や香りがどのように決まるのかを科学的に解説していて、とても興味深かった。
        抽出方法や豆の違いを理解すると、普段飲んでいるコーヒーの味わい方も変わると感じた。
      TEXT
      genre: "ビジネス",
      image_url: "https://books.google.com/books/content?id=8MPHEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "硝子の塔の殺人",
      author: "知念 実希人",
      content: <<~TEXT,
        密室性の高い舞台設定と連続する謎が読者を強く引き込む本格ミステリ。
        伏線の張り方と回収が巧みで、読み進めるほど緊張感が増し、結末まで一気に読ませる一冊。
      TEXT
      genre: "小説",
      image_url: "https://books.google.com/books/content?id=yqY5EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "透明な螺旋",
      author: "東野 圭吾",
      content: <<~TEXT,
        過去と現在が静かに絡み合い、少しずつ真実へ近づく構成が秀逸。
        感情を抑えた筆致が切なさを際立たせ、人の選択と因果の重さが胸に残るミステリー。
      TEXT
      genre: "小説",
      image_url:
"https://books.google.com/books/content?id=VtDL0AEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "僕には鳥の言葉がわかる",
      author: "鈴木 俊貴",
      content: <<~TEXT,
        鳥の鳴き声に意味があることを科学的に解き明かす過程が刺激的。
        身近な自然への見方が一変し、観察する楽しさと研究の面白さが伝わる知的好奇心をくすぐる一冊。
      TEXT
      genre: "専門書",
      image_url: "https://books.google.com/books/content?id=ATMD0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "イン・ザ・メガチャーチ",
      author: "朝井 リョウ",
      content: <<~TEXT,
        巨大な共同体の内側で揺れる信仰と欲望を鋭く描写。
        正しさの名の下に生まれる歪みが生々しく、読後に価値観を問い直させられる挑発的な一冊。
      TEXT
      genre: "小説",
      image_url: "https://books.google.com/books/content?id=c7WBEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "DIE WITH ZERO 人生が豊かになりすぎる究極のルール",
      author: "ビル・パーキンス",
      content: <<~TEXT,
        お金を貯めるだけでなく、最適なタイミングで使う価値を説く一冊。
        経験への投資という視点が新鮮で、人生設計や時間の使い方を見直すきっかけになる。
      TEXT
      genre: "自己啓発",
      image_url: "https://books.google.com/books/content?id=JUT3zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "嫌われる勇気",
      author: "岸見 一郎／古賀 史健",
      content: <<~TEXT,
        他者の期待から自由になるというアドラー心理学を対話形式で解説。
        考え方は厳しいが本質的で、人間関係や生き方を主体的に見直す強いきっかけを与えてくれる一冊。
      TEXT
      genre: "自己啓発",
      image_url: "https://books.google.com/books/content?id=zN5OAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "科学的に証明された すごい習慣大百科",
      author: "堀田 秀吾",
      content: <<~TEXT,
        科学的根拠をもとに、日常ですぐ試せる習慣を多数紹介。
        難しい理論に偏らず実践重視で、生活や仕事の質を少しずつ確実に高められる実用性の高い一冊。
      TEXT
      genre: "専門書",
      image_url: "https://books.google.com/books/content?id=781oEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "静かな人はうまくいく",
      author: "小原 康照",
      content: <<~TEXT,
        過去の選択と向き合う主人公の姿が印象的だった。少し切ない展開もあるが、読み終えた後は前向きな気持ちになれた。
        人生の分岐点について考えさせられる物語だった。
      TEXT
      genre: "小説",
      image_url: "https://books.google.com/books/content?id=no2XEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "夢をかなえるゾウ1",
      author: "水野 敬也",
      content: <<~TEXT,
        ユーモアあふれる語り口で、行動習慣の大切さを分かりやすく伝える自己啓発小説。
        堅苦しさがなく、楽しみながら「まず動く」意識を身につけられる一冊。
      TEXT
      genre: "自己啓発",
      image_url: "https://books.google.com/books/content?id=MEgnEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "7つの習慣",
      author: "スティーブン・R・コヴィー",
      content: <<~TEXT,
        主体性や目的意識など普遍的な原則を体系的に示す名著。
        仕事だけでなく人生全体の判断軸を整え、長期的な成長と人間関係の質を高めてくれる。
      TEXT
      genre: "ビジネス",
      image_url: "https://books.google.com/books/content?id=fcuGQgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "学びを結果に変えるアウトプット大全",
      author: "樺沢 紫苑",
      content: <<~TEXT,
        話す・書く・行動することで学びを定着させる重要性を、科学的根拠と具体例で解説。
        知識を結果につなげたい人にとって、実践意欲を高めてくれる実用的な一冊。
      TEXT
      genre: "自己啓発",
      image_url: "https://books.google.com/books/content?id=NcZmDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "不完全主義 限りある人生を上手に過ごす方法",
      author: "オリバー・バークマン",
      content: <<~TEXT,
        完璧を目指すほど苦しくなるという逆説を通じ、限界を受け入れる大切さを説く一冊。
        時間や人生との向き合い方が変わり、肩の力が抜ける実践的な哲学書。
      TEXT
      genre: "自己啓発",
      image_url: "https://books.google.com/books/content?id=J2do0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "キャリアに迷ったら一人で悩むな",
      author: "柴田 郁夫",
      content: <<~TEXT,
        キャリアの悩みは一人で抱え込まず、対話によって整理する重要性を示す一冊。
        考えを言語化し他者の視点を取り入れることで、自分らしい選択肢が見えてくると教えてくれる。
      TEXT
      genre: "ビジネス",
      image_url: "https://books.google.com/books/content?id=e32DEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "知って得する、すごい法則77",
      author: "清水 克彦",
      content: <<~TEXT,
        仕事や人間関係、日常に活かせる法則をコンパクトに紹介。
        難しい説明は少なく、気になった項目から読めるため、すぐ行動に移したい人に向いた実用書。
      TEXT
      genre: "その他",
      image_url: "https://books.google.com/books/content?id=6ooI0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "今日も一日きみを見てた",
      author: "角田 光代",
      content: <<~TEXT,
        何気ない日常や人との距離感を、柔らかく誠実な言葉で切り取ったエッセイ。
        共感できる場面が多く、忙しい日々の中で気持ちを落ち着かせてくれる一冊だった。
      TEXT
      genre: "エッセイ",
      image_url: "https://books.google.com/books/content?id=2A8_tAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "エリアの騎士",
      author: "伊賀 大晃",
      content: <<~TEXT,
        長く続いた物語がついに完結し、ここまでの成長や仲間との関係を思い返しながら読んだ。
        サッカーへの情熱や努力する姿が最後まで描かれていて、読み終えた後は少し寂しい気持ちと同時に爽やかな達成感も感じられるラストだった。
      TEXT
      genre: "漫画",
      image_url: "https://books.google.com/books/content?id=ptnPDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "考えない練習",
      author: "小池 龍之介",
      content: <<~TEXT,
        思考に振り回されがちな日常から一歩距離を置くヒントが詰まった本。
        難しい理屈ではなく、日々の心の持ち方を静かに整えてくれる内容だった。
      TEXT
      genre: "エッセイ",
      image_url: "https://books.google.com/books/content?id=g--CDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "カメラはじめます！",
      author: "こいし ゆうか",
      content: <<~TEXT,
        カメラの仕組みを難しい言葉を使わずに説明してくれるので、初心者でも理解しやすかった。
        イラストが多く、読みながらすぐに試してみたくなる内容で、写真を撮る楽しさを改めて感じられる一冊。
      TEXT
      genre: "趣味",
      image_url: "https://books.google.com/books/content?id=NFNztAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "コーヒーの科学",
      author: "旦部 幸博",
      content: <<~TEXT,
        コーヒーの味や香りがどのように決まるのかを科学的に解説していて、とても興味深かった。
        抽出方法や豆の違いを理解すると、普段飲んでいるコーヒーの味わい方も変わると感じた。
      TEXT
      genre: "趣味",
      image_url: "https://books.google.com/books/content?id=AQ5tjwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      title: "鬼滅の刃",
      author: "吾峠 呼世晴",
      content: <<~TEXT,
        長く続いた戦いがついに決着し、登場人物それぞれの思いや成長を振り返りながら読んだ。
        悲しさもあるが、仲間や家族の絆の大切さが最後まで丁寧に描かれていて、読み終えたあとに静かな余韻が残るラストだった。
      TEXT
      genre: "漫画",
      image_url: "https://books.google.com/books/content?id=YBwFEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    {
      title: "コンビニ人間",
      author: "村田 沙耶香",
      content: <<~TEXT,
        普通とは何かを考えさせられる物語だった。主人公の視点が独特で最初は戸惑うが、読み進めるうちに社会の価値観について考えさせられる。
        短い作品ながら印象に残る場面が多く、読み終えたあともしばらく余韻が残った。
      TEXT
      genre: "小説",
      image_url: "https://books.google.com/books/content?id=ZgUFvgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
  ].freeze
end
