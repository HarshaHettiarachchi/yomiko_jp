export type ExpressionCategory =
  | "Greetings"
  | "Shopping"
  | "Restaurant"
  | "Travel"
  | "Workplace"
  | "Daily Life"
  | "Hospital"
  | "Emergency"
  | "Casual"
  | "Polite";

export interface ExpressionItem {
  id: number;
  category: ExpressionCategory;
  japanese: string;
  romaji: string;
  meaning: string;
  example?: string;
  exampleRomaji?: string;
  exampleMeaning?: string;
}

type ExpressionTuple = [
  japanese: string,
  romaji: string,
  meaning: string,
];

const createExpressions = (
  category: ExpressionCategory,
  startId: number,
  items: ExpressionTuple[],
): ExpressionItem[] =>
  items.map(([japanese, romaji, meaning], index) => ({
    id: startId + index,
    category,
    japanese,
    romaji,
    meaning,
  }));

export const expressionsData: ExpressionItem[] = [
  // =========================
  // GREETINGS - 20
  // =========================
  ...createExpressions("Greetings", 1, [
    ["おはようございます。", "Ohayou gozaimasu.", "Good morning."],
    ["おはよう。", "Ohayou.", "Morning / Good morning. (casual)"],
    ["こんにちは。", "Konnichiwa.", "Hello / Good afternoon."],
    ["こんばんは。", "Konbanwa.", "Good evening."],
    ["おやすみなさい。", "Oyasuminasai.", "Good night."],
    ["おやすみ。", "Oyasumi.", "Good night. (casual)"],
    ["はじめまして。", "Hajimemashite.", "Nice to meet you."],
    [
      "よろしくお願いします。",
      "Yoroshiku onegaishimasu.",
      "Nice to meet you / Please treat me well.",
    ],
    [
      "よろしく。",
      "Yoroshiku.",
      "Nice to meet you / Please treat me well. (casual)",
    ],
    ["お元気ですか。", "Ogenki desu ka.", "How are you?"],
    ["元気です。", "Genki desu.", "I am fine."],
    ["お久しぶりです。", "Ohisashiburi desu.", "Long time no see."],
    ["久しぶり。", "Hisashiburi.", "Long time no see. (casual)"],
    ["また会いましょう。", "Mata aimashou.", "Let's meet again."],
    ["また明日。", "Mata ashita.", "See you tomorrow."],
    ["また今度。", "Mata kondo.", "See you next time."],
    ["行ってきます。", "Ittekimasu.", "I'm leaving now. / See you later."],
    ["行ってらっしゃい。", "Itterasshai.", "See you when you get back."],
    ["ただいま。", "Tadaima.", "I'm home."],
    ["おかえりなさい。", "Okaerinasai.", "Welcome home."],
  ]),

  // =========================
  // SHOPPING - 20
  // =========================
  ...createExpressions("Shopping", 21, [
    ["これはいくらですか。", "Kore wa ikura desu ka.", "How much is this?"],
    ["あれはいくらですか。", "Are wa ikura desu ka.", "How much is that?"],
    ["これをください。", "Kore o kudasai.", "I'll take this, please."],
    ["これをお願いします。", "Kore o onegaishimasu.", "This one, please."],
    ["見てもいいですか。", "Mite mo ii desu ka.", "May I look at it?"],
    [
      "試着してもいいですか。",
      "Shichaku shite mo ii desu ka.",
      "May I try it on?",
    ],
    [
      "別の色はありますか。",
      "Betsu no iro wa arimasu ka.",
      "Do you have another color?",
    ],
    [
      "大きいサイズはありますか。",
      "Ookii saizu wa arimasu ka.",
      "Do you have a larger size?",
    ],
    [
      "小さいサイズはありますか。",
      "Chiisai saizu wa arimasu ka.",
      "Do you have a smaller size?",
    ],
    ["これを探しています。", "Kore o sagashiteimasu.", "I'm looking for this."],
    ["どこにありますか。", "Doko ni arimasu ka.", "Where is it?"],
    ["カードで払えますか。", "Kaado de haraemasu ka.", "Can I pay by card?"],
    ["現金で払います。", "Genkin de haraimasu.", "I'll pay in cash."],
    ["袋をください。", "Fukuro o kudasai.", "A bag, please."],
    ["レシートをください。", "Reshiito o kudasai.", "Receipt, please."],
    ["割引がありますか。", "Waribiki ga arimasu ka.", "Is there a discount?"],
    ["セールですか。", "Seeru desu ka.", "Is it on sale?"],
    ["高すぎます。", "Takasugimasu.", "It's too expensive."],
    ["ちょっと高いです。", "Chotto takai desu.", "It's a little expensive."],
    ["これにします。", "Kore ni shimasu.", "I'll take this one."],
  ]),

  // =========================
  // RESTAURANT - 20
  // =========================
  ...createExpressions("Restaurant", 41, [
    ["メニューをお願いします。", "Menyuu o onegaishimasu.", "Menu, please."],
    ["これをお願いします。", "Kore o onegaishimasu.", "This one, please."],
    ["おすすめは何ですか。", "Osusume wa nan desu ka.", "What do you recommend?"],
    [
      "人気の料理は何ですか。",
      "Ninki no ryouri wa nan desu ka.",
      "What is a popular dish?",
    ],
    ["これは何ですか。", "Kore wa nan desu ka.", "What is this?"],
    ["水をください。", "Mizu o kudasai.", "Water, please."],
    ["お茶をください。", "Ocha o kudasai.", "Tea, please."],
    ["コーヒーをお願いします。", "Koohii o onegaishimasu.", "Coffee, please."],
    ["注文してもいいですか。", "Chuumon shite mo ii desu ka.", "Can I order?"],
    ["これを二つください。", "Kore o futatsu kudasai.", "Two of these, please."],
    [
      "辛くしないでください。",
      "Karaku shinaide kudasai.",
      "Please don't make it spicy.",
    ],
    [
      "辛いものは食べられません。",
      "Karai mono wa taberaremasen.",
      "I cannot eat spicy food.",
    ],
    ["ベジタリアンです。", "Bejitarian desu.", "I'm vegetarian."],
    ["アレルギーがあります。", "Arerugii ga arimasu.", "I have an allergy."],
    ["お会計をお願いします。", "Okaikei o onegaishimasu.", "The bill, please."],
    [
      "別々に払えますか。",
      "Betsubetsu ni haraemasu ka.",
      "Can we pay separately?",
    ],
    ["おいしいです。", "Oishii desu.", "It's delicious."],
    ["ごちそうさまでした。", "Gochisousama deshita.", "Thank you for the meal."],
    [
      "持ち帰りできますか。",
      "Mochikaeri dekimasu ka.",
      "Can I take it to go?",
    ],
    ["予約しています。", "Yoyaku shiteimasu.", "I have a reservation."],
  ]),

  // =========================
  // TRAVEL - 20
  // =========================
  ...createExpressions("Travel", 61, [
    ["駅はどこですか。", "Eki wa doko desu ka.", "Where is the station?"],
    ["トイレはどこですか。", "Toire wa doko desu ka.", "Where is the toilet?"],
    [
      "この電車は東京に行きますか。",
      "Kono densha wa Toukyou ni ikimasu ka.",
      "Does this train go to Tokyo?",
    ],
    [
      "この電車でいいですか。",
      "Kono densha de ii desu ka.",
      "Is this the right train?",
    ],
    ["何番線ですか。", "Nanbansen desu ka.", "Which platform is it?"],
    ["切符を一枚ください。", "Kippu o ichimai kudasai.", "One ticket, please."],
    ["片道です。", "Katamichi desu.", "One-way."],
    ["往復です。", "Oufuku desu.", "Round trip."],
    [
      "次の電車は何時ですか。",
      "Tsugi no densha wa nanji desu ka.",
      "What time is the next train?",
    ],
    [
      "どのくらいかかりますか。",
      "Dono kurai kakarimasu ka.",
      "How long does it take?",
    ],
    [
      "ここから近いですか。",
      "Koko kara chikai desu ka.",
      "Is it close from here?",
    ],
    [
      "ここから遠いですか。",
      "Koko kara tooi desu ka.",
      "Is it far from here?",
    ],
    ["道に迷いました。", "Michi ni mayoimashita.", "I am lost."],
    ["助けてもらえますか。", "Tasukete moraemasu ka.", "Can you help me?"],
    ["ホテルはどこですか。", "Hoteru wa doko desu ka.", "Where is the hotel?"],
    [
      "チェックインをお願いします。",
      "Chekkuin o onegaishimasu.",
      "I'd like to check in.",
    ],
    ["予約があります。", "Yoyaku ga arimasu.", "I have a reservation."],
    [
      "タクシーを呼んでください。",
      "Takushii o yonde kudasai.",
      "Please call a taxi.",
    ],
    [
      "空港までお願いします。",
      "Kuukou made onegaishimasu.",
      "To the airport, please.",
    ],
    [
      "写真を撮ってもらえますか。",
      "Shashin o totte moraemasu ka.",
      "Could you take a photo?",
    ],
  ]),

  // =========================
  // WORKPLACE - 20
  // =========================
  ...createExpressions("Workplace", 81, [
    ["お疲れ様です。", "Otsukaresama desu.", "Thank you for your hard work."],
    ["お疲れ様でした。", "Otsukaresama deshita.", "Thank you for your work today."],
    [
      "よろしくお願いします。",
      "Yoroshiku onegaishimasu.",
      "I look forward to working with you.",
    ],
    ["お願いします。", "Onegaishimasu.", "Please."],
    ["確認お願いします。", "Kakunin onegaishimasu.", "Please check it."],
    ["確認しました。", "Kakunin shimashita.", "I checked it."],
    ["わかりました。", "Wakarimashita.", "I understand."],
    ["承知しました。", "Shouchi shimashita.", "Certainly / Understood."],
    [
      "少々お待ちください。",
      "Shoushou omachi kudasai.",
      "Please wait a moment.",
    ],
    ["今、確認します。", "Ima, kakunin shimasu.", "I'll check now."],
    ["後で確認します。", "Ato de kakunin shimasu.", "I'll check later."],
    ["メールを送りました。", "Meeru o okurimashita.", "I sent the email."],
    [
      "メールを確認してください。",
      "Meeru o kakunin shite kudasai.",
      "Please check the email.",
    ],
    ["会議は何時ですか。", "Kaigi wa nanji desu ka.", "What time is the meeting?"],
    ["会議に参加します。", "Kaigi ni sanka shimasu.", "I will attend the meeting."],
    ["今日は休みです。", "Kyou wa yasumi desu.", "I am off today."],
    ["明日出勤します。", "Ashita shukkin shimasu.", "I will come to work tomorrow."],
    ["手伝いましょうか。", "Tetsudaimashou ka.", "Shall I help?"],
    ["手伝ってください。", "Tetsudatte kudasai.", "Please help me."],
    [
      "お先に失礼します。",
      "Osaki ni shitsurei shimasu.",
      "I'm leaving before you.",
    ],
  ]),

  // =========================
  // DAILY LIFE - 20
  // =========================
  ...createExpressions("Daily Life", 101, [
    ["今何時ですか。", "Ima nanji desu ka.", "What time is it now?"],
    ["今日は忙しいです。", "Kyou wa isogashii desu.", "I am busy today."],
    ["今日は暇です。", "Kyou wa hima desu.", "I am free today."],
    ["何をしていますか。", "Nani o shiteimasu ka.", "What are you doing?"],
    ["どこに行きますか。", "Doko ni ikimasu ka.", "Where are you going?"],
    ["一緒に行きましょう。", "Issho ni ikimashou.", "Let's go together."],
    ["ちょっと待ってください。", "Chotto matte kudasai.", "Please wait a moment."],
    ["大丈夫です。", "Daijoubu desu.", "It's okay / I'm fine."],
    ["大丈夫ですか。", "Daijoubu desu ka.", "Are you okay?"],
    ["ちょっと疲れました。", "Chotto tsukaremashita.", "I'm a little tired."],
    ["お腹がすきました。", "Onaka ga sukimashita.", "I'm hungry."],
    ["喉が渇きました。", "Nodo ga kawakimashita.", "I'm thirsty."],
    ["眠いです。", "Nemui desu.", "I'm sleepy."],
    ["少し休みましょう。", "Sukoshi yasumimashou.", "Let's take a little break."],
    ["気をつけてください。", "Ki o tsukete kudasai.", "Please be careful."],
    ["忘れないでください。", "Wasurenaide kudasai.", "Please don't forget."],
    ["わかりません。", "Wakarimasen.", "I don't understand."],
    ["もう一度お願いします。", "Mou ichido onegaishimasu.", "One more time, please."],
    [
      "ゆっくり話してください。",
      "Yukkuri hanashite kudasai.",
      "Please speak slowly.",
    ],
    ["また後で。", "Mata ato de.", "See you later."],
  ]),

  // =========================
  // HOSPITAL - 20
  // =========================
  ...createExpressions("Hospital", 121, [
    ["病院はどこですか。", "Byouin wa doko desu ka.", "Where is the hospital?"],
    ["具合が悪いです。", "Guai ga warui desu.", "I feel sick."],
    ["気分が悪いです。", "Kibun ga warui desu.", "I feel unwell."],
    ["熱があります。", "Netsu ga arimasu.", "I have a fever."],
    ["頭が痛いです。", "Atama ga itai desu.", "I have a headache."],
    ["お腹が痛いです。", "Onaka ga itai desu.", "I have a stomachache."],
    ["喉が痛いです。", "Nodo ga itai desu.", "I have a sore throat."],
    ["咳が出ます。", "Seki ga demasu.", "I have a cough."],
    ["薬をください。", "Kusuri o kudasai.", "Please give me medicine."],
    ["薬局はどこですか。", "Yakkyoku wa doko desu ka.", "Where is the pharmacy?"],
    ["予約が必要ですか。", "Yoyaku ga hitsuyou desu ka.", "Is an appointment necessary?"],
    ["予約したいです。", "Yoyaku shitai desu.", "I would like to make an appointment."],
    [
      "保険証を持っています。",
      "Hokenshou o motteimasu.",
      "I have my insurance card.",
    ],
    ["英語を話せますか。", "Eigo o hanasemasu ka.", "Can you speak English?"],
    ["ここが痛いです。", "Koko ga itai desu.", "It hurts here."],
    ["いつからですか。", "Itsu kara desu ka.", "Since when?"],
    ["昨日からです。", "Kinou kara desu.", "Since yesterday."],
    ["アレルギーがあります。", "Arerugii ga arimasu.", "I have an allergy."],
    ["薬を飲みました。", "Kusuri o nomimashita.", "I took the medicine."],
    ["診断書をください。", "Shindansho o kudasai.", "Medical certificate, please."],
  ]),

  // =========================
  // EMERGENCY - 20
  // =========================
  ...createExpressions("Emergency", 141, [
    ["助けてください。", "Tasukete kudasai.", "Please help me."],
    ["助けて！", "Tasukete!", "Help!"],
    ["警察を呼んでください。", "Keisatsu o yonde kudasai.", "Please call the police."],
    [
      "救急車を呼んでください。",
      "Kyuukyuusha o yonde kudasai.",
      "Please call an ambulance.",
    ],
    ["火事です。", "Kaji desu.", "There is a fire."],
    ["事故です。", "Jiko desu.", "There has been an accident."],
    ["危ないです。", "Abunai desu.", "It's dangerous."],
    ["逃げてください。", "Nigete kudasai.", "Please escape / Run away."],
    ["ここは安全ですか。", "Koko wa anzen desu ka.", "Is this place safe?"],
    ["財布をなくしました。", "Saifu o nakushimashita.", "I lost my wallet."],
    [
      "携帯電話をなくしました。",
      "Keitai denwa o nakushimashita.",
      "I lost my mobile phone.",
    ],
    [
      "パスポートをなくしました。",
      "Pasupooto o nakushimashita.",
      "I lost my passport.",
    ],
    ["道に迷いました。", "Michi ni mayoimashita.", "I am lost."],
    [
      "警察署はどこですか。",
      "Keisatsusho wa doko desu ka.",
      "Where is the police station?",
    ],
    [
      "救急病院はどこですか。",
      "Kyuukyuu byouin wa doko desu ka.",
      "Where is the emergency hospital?",
    ],
    ["動けません。", "Ugokemasen.", "I cannot move."],
    ["息ができません。", "Iki ga dekimasen.", "I cannot breathe."],
    ["意識がありません。", "Ishiki ga arimasen.", "They are unconscious."],
    ["すぐ来てください。", "Sugu kite kudasai.", "Please come immediately."],
    ["緊急です。", "Kinkyuu desu.", "It's an emergency."],
  ]),

  // =========================
  // CASUAL - 20
  // =========================
  ...createExpressions("Casual", 161, [
    ["元気？", "Genki?", "How are you?"],
    ["どうしたの？", "Dou shita no?", "What happened?"],
    ["本当？", "Hontou?", "Really?"],
    ["すごい！", "Sugoi!", "Amazing!"],
    ["いいね！", "Ii ne!", "Sounds good!"],
    ["いいよ。", "Ii yo.", "Sure / That's okay."],
    ["だめだよ。", "Dame da yo.", "No, that's not okay."],
    ["わかった。", "Wakatta.", "Got it."],
    ["わからない。", "Wakaranai.", "I don't know."],
    ["ちょっと待って。", "Chotto matte.", "Wait a moment."],
    ["大丈夫？", "Daijoubu?", "Are you okay?"],
    ["もちろん。", "Mochiron.", "Of course."],
    ["たぶん。", "Tabun.", "Probably."],
    ["ちょっとね。", "Chotto ne.", "Well, kind of."],
    ["どうかな。", "Dou kana.", "I wonder."],
    ["またね。", "Mata ne.", "See you."],
    ["じゃあね。", "Jaa ne.", "See you then."],
    ["また明日ね。", "Mata ashita ne.", "See you tomorrow."],
    ["気をつけてね。", "Ki o tsukete ne.", "Take care."],
    ["頑張って！", "Ganbatte!", "Good luck / Do your best!"],
  ]),

  // =========================
  // POLITE - 20
  // =========================
  ...createExpressions("Polite", 181, [
    ["ありがとうございます。", "Arigatou gozaimasu.", "Thank you very much."],
    [
      "ありがとうございました。",
      "Arigatou gozaimashita.",
      "Thank you very much. (for something completed)",
    ],
    [
      "どうもありがとうございます。",
      "Doumo arigatou gozaimasu.",
      "Thank you very much.",
    ],
    ["すみません。", "Sumimasen.", "Excuse me / Sorry."],
    [
      "申し訳ありません。",
      "Moushiwake arimasen.",
      "I sincerely apologize.",
    ],
    ["お願いします。", "Onegaishimasu.", "Please."],
    [
      "よろしくお願いします。",
      "Yoroshiku onegaishimasu.",
      "Thank you in advance / Nice to work with you.",
    ],
    [
      "少々お待ちください。",
      "Shoushou omachi kudasai.",
      "Please wait a moment.",
    ],
    ["こちらへどうぞ。", "Kochira e douzo.", "This way, please."],
    [
      "お名前をお願いします。",
      "Onamae o onegaishimasu.",
      "May I have your name, please?",
    ],
    [
      "もう一度お願いします。",
      "Mou ichido onegaishimasu.",
      "One more time, please.",
    ],
    [
      "ゆっくり話してください。",
      "Yukkuri hanashite kudasai.",
      "Please speak slowly.",
    ],
    ["わかりました。", "Wakarimashita.", "Understood."],
    ["承知しました。", "Shouchi shimashita.", "Certainly / Understood."],
    ["大丈夫です。", "Daijoubu desu.", "That's okay."],
    ["結構です。", "Kekkou desu.", "No, thank you / That's fine."],
    ["失礼します。", "Shitsurei shimasu.", "Excuse me."],
    [
      "お先に失礼します。",
      "Osaki ni shitsurei shimasu.",
      "Excuse me for leaving before you.",
    ],
    ["お疲れ様です。", "Otsukaresama desu.", "Thank you for your hard work."],
    [
      "失礼いたします。",
      "Shitsurei itashimasu.",
      "Excuse me. (very polite)",
    ],
  ]),
];

export const expressionCategories: ExpressionCategory[] = [
  "Greetings",
  "Shopping",
  "Restaurant",
  "Travel",
  "Workplace",
  "Daily Life",
  "Hospital",
  "Emergency",
  "Casual",
  "Polite",
];

export function getExpressionsByCategory(
  category: ExpressionCategory | "All",
): ExpressionItem[] {
  if (category === "All") {
    return expressionsData;
  }

  return expressionsData.filter(
    (expression) => expression.category === category,
  );
}

export function getExpressionById(
  id: number,
): ExpressionItem | undefined {
  return expressionsData.find(
    (expression) => expression.id === id,
  );
}