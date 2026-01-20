export const books = [
  {
    id: 1,
    title: "Satranç",
    slug: "stefan-zweig-satranc", // İŞTE SENİN İSTEDİĞİN LİNK YAPISI BURADA
    author: "Stefan Zweig",
    rating: 4.9,
    cover: "/books/stefan-zweig-satranc.webp",
    price: "$12.00",
    description: "New York'tan Buenos Aires'e giden bir yolcu gemisinde, tesadüfen karşılaşan iki zıt karakterin gerilim dolu psikolojik savaşı... \n\nBir yanda satrancın mekanik dahisi, kaba, cahil ve sadece para için oynayan Dünya Şampiyonu Mirko Czentovic; diğer yanda Gestapo'nun tecrit odasında hiçliğe karşı zihnini korumak için satranca sığınmış gizemli Dr. B.\n\nZweig, bu son eserinde sadece bir satranç partisini anlatmaz; aynı zamanda kültür ile barbarlığın, humanizm ile faşizmin çarpışmasını gözler önüne serer.",
    authorBio: "Stefan Zweig (1881-1942), savaşın ve faşizmin gölgesinde yaşamış, Avrupa kültürünün birliğini savunmuş Avusturyalı romancı, oyun yazarı ve biyografi ustasıdır. \n\nNazilerin yükselişiyle eserleri yakıldı ve ülkesini terk etmek zorunda kaldı. 1942 yılında eşi Lotte ile birlikte Brezilya'da intihar etti. Satranç, onun dünyaya bıraktığı son başyapıtıdır.",
    otherBooks: [
      { title: "Bilinmeyen Bir Kadının Mektubu", slug: "stefan-zweig-bilinmeyen-bir-kadinin-mektubu" },
      { title: "Amok Koşucusu", slug: "stefan-zweig-amok-kosucusu" }
    ],
    versions: [
      { name: "Orijinal (Almanca)", type: "original" },
      { name: "Tam Türkçe Çeviri", type: "full_tr" },
      { name: "Basitleştirilmiş Çeviri", type: "simple" },
      { name: "8+ Yaş İçin", type: "kids_8" },
      { name: "12+ Yaş İçin", type: "kids_12" }
    ]
  }
];