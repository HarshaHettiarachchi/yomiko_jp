import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  Play,
  CheckCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Headphones,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { useLearning } from "@/context/LearningContext";

type Sentence = [
  japanese: string,
  romaji: string,
  meaning: string,
];

interface Lesson {
  id: number;
  set: number;
  lesson: number;
  japanese: string;
  romaji: string;
  meaning: string;
}

const STORAGE_KEY = "yomiko-listening-completed-ids";
const LEGACY_STORAGE_KEY = "yomiko-listening-completed";

/* =========================================================
   20 SETS × 20 LESSONS = 400 LISTENING LESSONS
   ========================================================= */

const set1: Sentence[] = [
  ["おはようございます。", "Ohayou gozaimasu.", "Good morning."],
  ["こんにちは。", "Konnichiwa.", "Hello."],
  ["こんばんは。", "Konbanwa.", "Good evening."],
  ["おやすみなさい。", "Oyasuminasai.", "Good night."],
  ["ありがとうございます。", "Arigatou gozaimasu.", "Thank you very much."],
  ["どういたしまして。", "Dou itashimashite.", "You're welcome."],
  ["すみません。", "Sumimasen.", "Excuse me / Sorry."],
  ["ごめんなさい。", "Gomennasai.", "I'm sorry."],
  ["わかりました。", "Wakarimashita.", "I understand."],
  ["わかりません。", "Wakarimasen.", "I don't understand."],
  ["はい、そうです。", "Hai, sou desu.", "Yes, that's right."],
  ["いいえ、ちがいます。", "Iie, chigaimasu.", "No, that's wrong."],
  ["またあした。", "Mata ashita.", "See you tomorrow."],
  ["またあとで。", "Mata ato de.", "See you later."],
  ["じゃあ、また。", "Jaa, mata.", "See you again."],
  ["はじめまして。", "Hajimemashite.", "Nice to meet you."],
  ["よろしくおねがいします。", "Yoroshiku onegaishimasu.", "Nice to meet you / Please treat me well."],
  ["おげんきですか。", "Ogenki desu ka.", "How are you?"],
  ["げんきです。", "Genki desu.", "I'm fine."],
  ["おなまえはなんですか。", "Onamae wa nan desu ka.", "What is your name?"],
];

const set2: Sentence[] = [
  ["わたしは学生です。", "Watashi wa gakusei desu.", "I am a student."],
  ["わたしは日本人です。", "Watashi wa Nihonjin desu.", "I am Japanese."],
  ["わたしはスリランカ人です。", "Watashi wa Surirankajin desu.", "I am Sri Lankan."],
  ["これは本です。", "Kore wa hon desu.", "This is a book."],
  ["それはペンです。", "Sore wa pen desu.", "That is a pen."],
  ["あれは学校です。", "Are wa gakkou desu.", "That is a school."],
  ["ここは教室です。", "Koko wa kyoushitsu desu.", "Here is the classroom."],
  ["そこは駅です。", "Soko wa eki desu.", "There is the station."],
  ["あそこは銀行です。", "Asoko wa ginkou desu.", "Over there is the bank."],
  ["これは私のかばんです。", "Kore wa watashi no kaban desu.", "This is my bag."],
  ["それは先生の本です。", "Sore wa sensei no hon desu.", "That is the teacher's book."],
  ["日本語を勉強します。", "Nihongo o benkyou shimasu.", "I study Japanese."],
  ["毎日学校へ行きます。", "Mainichi gakkou e ikimasu.", "I go to school every day."],
  ["毎朝コーヒーを飲みます。", "Maiasa koohii o nomimasu.", "I drink coffee every morning."],
  ["夜にテレビを見ます。", "Yoru ni terebi o mimasu.", "I watch TV at night."],
  ["本を読みます。", "Hon o yomimasu.", "I read a book."],
  ["音楽を聞きます。", "Ongaku o kikimasu.", "I listen to music."],
  ["映画を見ます。", "Eiga o mimasu.", "I watch movies."],
  ["日本語を話します。", "Nihongo o hanashimasu.", "I speak Japanese."],
  ["英語も話します。", "Eigo mo hanashimasu.", "I also speak English."],
];

const set3: Sentence[] = [
  ["今日は月曜日です。", "Kyou wa getsuyoubi desu.", "Today is Monday."],
  ["明日は火曜日です。", "Ashita wa kayoubi desu.", "Tomorrow is Tuesday."],
  ["昨日は日曜日でした。", "Kinou wa nichiyoubi deshita.", "Yesterday was Sunday."],
  ["今日は何曜日ですか。", "Kyou wa nan youbi desu ka.", "What day is today?"],
  ["今何時ですか。", "Ima nanji desu ka.", "What time is it now?"],
  ["今は三時です。", "Ima wa sanji desu.", "It is three o'clock now."],
  ["朝七時に起きます。", "Asa shichiji ni okimasu.", "I wake up at seven in the morning."],
  ["八時に学校へ行きます。", "Hachiji ni gakkou e ikimasu.", "I go to school at eight."],
  ["九時から勉強します。", "Kuji kara benkyou shimasu.", "I study from nine."],
  ["十二時に昼ごはんを食べます。", "Juuniji ni hirugohan o tabemasu.", "I eat lunch at twelve."],
  ["一時に休みます。", "Ichiji ni yasumimasu.", "I take a break at one."],
  ["六時に帰ります。", "Rokuji ni kaerimasu.", "I return home at six."],
  ["七時に晩ごはんを食べます。", "Shichiji ni bangohan o tabemasu.", "I eat dinner at seven."],
  ["十時に寝ます。", "Juuji ni nemasu.", "I go to bed at ten."],
  ["週末は休みです。", "Shuumatsu wa yasumi desu.", "I have a holiday on weekends."],
  ["月曜日は忙しいです。", "Getsuyoubi wa isogashii desu.", "Monday is busy."],
  ["土曜日に友達に会います。", "Doyoubi ni tomodachi ni aimasu.", "I meet my friend on Saturday."],
  ["日曜日は家にいます。", "Nichiyoubi wa ie ni imasu.", "I stay home on Sunday."],
  ["毎日六時間寝ます。", "Mainichi rokujikan nemasu.", "I sleep six hours every day."],
  ["今は午後三時です。", "Ima wa gogo sanji desu.", "It is 3 PM now."],
];

const set4: Sentence[] = [
  ["これはいくらですか。", "Kore wa ikura desu ka.", "How much is this?"],
  ["千円です。", "Sen en desu.", "It is 1,000 yen."],
  ["高いですね。", "Takai desu ne.", "It's expensive, isn't it?"],
  ["安いですね。", "Yasui desu ne.", "It's cheap, isn't it?"],
  ["これをください。", "Kore o kudasai.", "Please give me this."],
  ["これをお願いします。", "Kore o onegaishimasu.", "This one, please."],
  ["カードで払えますか。", "Kaado de haraemasu ka.", "Can I pay by card?"],
  ["現金で払います。", "Genkin de haraimasu.", "I will pay in cash."],
  ["レシートをください。", "Reshiito o kudasai.", "Please give me the receipt."],
  ["袋をください。", "Fukuro o kudasai.", "Please give me a bag."],
  ["もう少し安くできますか。", "Mou sukoshi yasuku dekimasu ka.", "Can you make it a little cheaper?"],
  ["何円ですか。", "Nan en desu ka.", "How many yen is it?"],
  ["五百円あります。", "Gohyaku en arimasu.", "I have 500 yen."],
  ["おつりです。", "Otsuri desu.", "Here is your change."],
  ["これは新しいですか。", "Kore wa atarashii desu ka.", "Is this new?"],
  ["これを見せてください。", "Kore o misete kudasai.", "Please show me this."],
  ["別の色がありますか。", "Betsu no iro ga arimasu ka.", "Do you have another color?"],
  ["大きいサイズがありますか。", "Ookii saizu ga arimasu ka.", "Do you have a larger size?"],
  ["小さいサイズがありますか。", "Chiisai saizu ga arimasu ka.", "Do you have a smaller size?"],
  ["これを買います。", "Kore o kaimasu.", "I will buy this."],
];

const set5: Sentence[] = [
  ["水をください。", "Mizu o kudasai.", "Water, please."],
  ["コーヒーをください。", "Koohii o kudasai.", "Coffee, please."],
  ["メニューをお願いします。", "Menyuu o onegaishimasu.", "Menu, please."],
  ["これは何ですか。", "Kore wa nan desu ka.", "What is this?"],
  ["おすすめは何ですか。", "Osusume wa nan desu ka.", "What do you recommend?"],
  ["ラーメンをお願いします。", "Raamen o onegaishimasu.", "Ramen, please."],
  ["ご飯をください。", "Gohan o kudasai.", "Rice, please."],
  ["おいしいです。", "Oishii desu.", "It's delicious."],
  ["とてもおいしいです。", "Totemo oishii desu.", "It's very delicious."],
  ["少し辛いです。", "Sukoshi karai desu.", "It's a little spicy."],
  ["水は無料ですか。", "Mizu wa muryou desu ka.", "Is water free?"],
  ["ここで食べます。", "Koko de tabemasu.", "I will eat here."],
  ["持ち帰りできますか。", "Mochikaeri dekimasu ka.", "Can I take it away?"],
  ["二人です。", "Futari desu.", "There are two people."],
  ["予約しています。", "Yoyaku shiteimasu.", "I have a reservation."],
  ["お会計をお願いします。", "Okaikei o onegaishimasu.", "The bill, please."],
  ["ごちそうさまでした。", "Gochisousama deshita.", "Thank you for the meal."],
  ["お箸をください。", "Ohashi o kudasai.", "Chopsticks, please."],
  ["スプーンをください。", "Supuun o kudasai.", "Spoon, please."],
  ["注文をお願いします。", "Chuumon o onegaishimasu.", "I would like to order."],
];

const set6: Sentence[] = [
  ["駅はどこですか。", "Eki wa doko desu ka.", "Where is the station?"],
  ["トイレはどこですか。", "Toire wa doko desu ka.", "Where is the toilet?"],
  ["コンビニはどこですか。", "Konbini wa doko desu ka.", "Where is the convenience store?"],
  ["右に曲がってください。", "Migi ni magatte kudasai.", "Please turn right."],
  ["左に曲がってください。", "Hidari ni magatte kudasai.", "Please turn left."],
  ["まっすぐ行ってください。", "Massugu itte kudasai.", "Please go straight."],
  ["ここから近いですか。", "Koko kara chikai desu ka.", "Is it close from here?"],
  ["ここから遠いですか。", "Koko kara tooi desu ka.", "Is it far from here?"],
  ["歩いて行けますか。", "Aruite ikemasu ka.", "Can I walk there?"],
  ["地図がありますか。", "Chizu ga arimasu ka.", "Do you have a map?"],
  ["駅までお願いします。", "Eki made onegaishimasu.", "To the station, please."],
  ["ここで降ります。", "Koko de orimasu.", "I get off here."],
  ["次の駅です。", "Tsugi no eki desu.", "It is the next station."],
  ["電車に乗ります。", "Densha ni norimasu.", "I get on the train."],
  ["バスに乗ります。", "Basu ni norimasu.", "I take the bus."],
  ["切符を買います。", "Kippu o kaimasu.", "I buy a ticket."],
  ["東京へ行きます。", "Toukyou e ikimasu.", "I am going to Tokyo."],
  ["京都に住んでいます。", "Kyouto ni sundeimasu.", "I live in Kyoto."],
  ["駅で待ちます。", "Eki de machimasu.", "I wait at the station."],
  ["ここで写真を撮ります。", "Koko de shashin o torimasu.", "I take a photo here."],
];

const set7: Sentence[] = [
  ["学校へ行きます。", "Gakkou e ikimasu.", "I go to school."],
  ["会社へ行きます。", "Kaisha e ikimasu.", "I go to the company."],
  ["仕事をします。", "Shigoto o shimasu.", "I work."],
  ["仕事が終わりました。", "Shigoto ga owarimashita.", "Work is finished."],
  ["今日は忙しいです。", "Kyou wa isogashii desu.", "I am busy today."],
  ["今日は暇です。", "Kyou wa hima desu.", "I am free today."],
  ["会議があります。", "Kaigi ga arimasu.", "There is a meeting."],
  ["授業があります。", "Jugyou ga arimasu.", "There is a class."],
  ["宿題をします。", "Shukudai o shimasu.", "I do homework."],
  ["宿題が終わりました。", "Shukudai ga owarimashita.", "The homework is finished."],
  ["先生に質問します。", "Sensei ni shitsumon shimasu.", "I ask the teacher a question."],
  ["日本語を練習します。", "Nihongo o renshuu shimasu.", "I practice Japanese."],
  ["コンピューターを使います。", "Konpyuutaa o tsukaimasu.", "I use a computer."],
  ["メールを送ります。", "Meeru o okurimasu.", "I send an email."],
  ["電話をします。", "Denwa o shimasu.", "I make a phone call."],
  ["少し休みます。", "Sukoshi yasumimasu.", "I take a short break."],
  ["一緒に勉強しましょう。", "Issho ni benkyou shimashou.", "Let's study together."],
  ["手伝ってください。", "Tetsudatte kudasai.", "Please help me."],
  ["もう一度お願いします。", "Mou ichido onegaishimasu.", "One more time, please."],
  ["ゆっくり話してください。", "Yukkuri hanashite kudasai.", "Please speak slowly."],
];

const set8: Sentence[] = [
  ["今日は暑いです。", "Kyou wa atsui desu.", "It is hot today."],
  ["今日は寒いです。", "Kyou wa samui desu.", "It is cold today."],
  ["天気がいいです。", "Tenki ga ii desu.", "The weather is good."],
  ["雨が降っています。", "Ame ga futteimasu.", "It is raining."],
  ["雪が降っています。", "Yuki ga futteimasu.", "It is snowing."],
  ["風が強いです。", "Kaze ga tsuyoi desu.", "The wind is strong."],
  ["今日は晴れです。", "Kyou wa hare desu.", "It is sunny today."],
  ["明日は雨です。", "Ashita wa ame desu.", "It will rain tomorrow."],
  ["傘を持っています。", "Kasa o motteimasu.", "I have an umbrella."],
  ["傘を忘れました。", "Kasa o wasuremashita.", "I forgot my umbrella."],
  ["春が好きです。", "Haru ga suki desu.", "I like spring."],
  ["夏が好きです。", "Natsu ga suki desu.", "I like summer."],
  ["秋が好きです。", "Aki ga suki desu.", "I like autumn."],
  ["冬が好きです。", "Fuyu ga suki desu.", "I like winter."],
  ["桜がきれいです。", "Sakura ga kirei desu.", "The cherry blossoms are beautiful."],
  ["今日は暖かいです。", "Kyou wa atatakai desu.", "It is warm today."],
  ["外は寒いです。", "Soto wa samui desu.", "It is cold outside."],
  ["窓を閉めてください。", "Mado o shimete kudasai.", "Please close the window."],
  ["窓を開けてください。", "Mado o akete kudasai.", "Please open the window."],
  ["天気予報を見ます。", "Tenki yohou o mimasu.", "I check the weather forecast."],
];

const set9: Sentence[] = [
  ["家に帰ります。", "Ie ni kaerimasu.", "I go home."],
  ["部屋を掃除します。", "Heya o souji shimasu.", "I clean the room."],
  ["洗濯をします。", "Sentaku o shimasu.", "I do laundry."],
  ["料理をします。", "Ryouri o shimasu.", "I cook."],
  ["ご飯を作ります。", "Gohan o tsukurimasu.", "I make a meal."],
  ["テレビを見ます。", "Terebi o mimasu.", "I watch TV."],
  ["音楽を聞きます。", "Ongaku o kikimasu.", "I listen to music."],
  ["本を読みます。", "Hon o yomimasu.", "I read a book."],
  ["シャワーを浴びます。", "Shawaa o abimasu.", "I take a shower."],
  ["お風呂に入ります。", "Ofuro ni hairimasu.", "I take a bath."],
  ["歯を磨きます。", "Ha o migakimasu.", "I brush my teeth."],
  ["顔を洗います。", "Kao o araimasu.", "I wash my face."],
  ["朝ごはんを食べます。", "Asagohan o tabemasu.", "I eat breakfast."],
  ["昼ごはんを食べます。", "Hirugohan o tabemasu.", "I eat lunch."],
  ["晩ごはんを食べます。", "Bangohan o tabemasu.", "I eat dinner."],
  ["コーヒーを飲みます。", "Koohii o nomimasu.", "I drink coffee."],
  ["水を飲みます。", "Mizu o nomimasu.", "I drink water."],
  ["早く寝ます。", "Hayaku nemasu.", "I go to bed early."],
  ["遅く起きました。", "Osoku okimashita.", "I woke up late."],
  ["明日の準備をします。", "Ashita no junbi o shimasu.", "I prepare for tomorrow."],
];

const set10: Sentence[] = [
  ["友達に会います。", "Tomodachi ni aimasu.", "I meet my friend."],
  ["友達と話します。", "Tomodachi to hanashimasu.", "I talk with my friend."],
  ["一緒に行きましょう。", "Issho ni ikimashou.", "Let's go together."],
  ["一緒に食べましょう。", "Issho ni tabemashou.", "Let's eat together."],
  ["一緒に帰りましょう。", "Issho ni kaerimashou.", "Let's go home together."],
  ["何をしますか。", "Nani o shimasu ka.", "What will you do?"],
  ["どこへ行きますか。", "Doko e ikimasu ka.", "Where are you going?"],
  ["誰と行きますか。", "Dare to ikimasu ka.", "Who are you going with?"],
  ["いつ行きますか。", "Itsu ikimasu ka.", "When will you go?"],
  ["何時に会いますか。", "Nanji ni aimasu ka.", "What time shall we meet?"],
  ["駅で会いましょう。", "Eki de aimashou.", "Let's meet at the station."],
  ["明日会いましょう。", "Ashita aimashou.", "Let's meet tomorrow."],
  ["後で電話します。", "Ato de denwa shimasu.", "I will call later."],
  ["また連絡します。", "Mata renraku shimasu.", "I will contact you again."],
  ["元気でね。", "Genki de ne.", "Take care."],
  ["気をつけてください。", "Ki o tsukete kudasai.", "Please take care."],
  ["楽しんでください。", "Tanoshinde kudasai.", "Please enjoy yourself."],
  ["頑張ってください。", "Ganbatte kudasai.", "Please do your best."],
  ["大丈夫です。", "Daijoubu desu.", "It's okay."],
  ["心配しないでください。", "Shinpai shinaide kudasai.", "Please don't worry."],
];

const set11: Sentence[] = [
  ["頭が痛いです。", "Atama ga itai desu.", "I have a headache."],
  ["お腹が痛いです。", "Onaka ga itai desu.", "My stomach hurts."],
  ["熱があります。", "Netsu ga arimasu.", "I have a fever."],
  ["風邪をひきました。", "Kaze o hikimashita.", "I caught a cold."],
  ["病院へ行きます。", "Byouin e ikimasu.", "I am going to the hospital."],
  ["薬を飲みます。", "Kusuri o nomimasu.", "I take medicine."],
  ["医者に会います。", "Isha ni aimasu.", "I see a doctor."],
  ["少し休んでください。", "Sukoshi yasunde kudasai.", "Please rest a little."],
  ["ここが痛いです。", "Koko ga itai desu.", "It hurts here."],
  ["気分が悪いです。", "Kibun ga warui desu.", "I feel sick."],
  ["大丈夫ですか。", "Daijoubu desu ka.", "Are you okay?"],
  ["救急車を呼んでください。", "Kyuukyuusha o yonde kudasai.", "Please call an ambulance."],
  ["助けてください。", "Tasukete kudasai.", "Please help me."],
  ["薬局はどこですか。", "Yakkyoku wa doko desu ka.", "Where is the pharmacy?"],
  ["予約があります。", "Yoyaku ga arimasu.", "I have an appointment."],
  ["保険証があります。", "Hokenshou ga arimasu.", "I have my insurance card."],
  ["名前を書いてください。", "Namae o kaite kudasai.", "Please write your name."],
  ["ここで待ってください。", "Koko de matte kudasai.", "Please wait here."],
  ["ゆっくりしてください。", "Yukkuri shite kudasai.", "Please take it easy."],
  ["お大事に。", "Odaiji ni.", "Take care / Get well soon."],
];

const set12: Sentence[] = [
  ["これは私の部屋です。", "Kore wa watashi no heya desu.", "This is my room."],
  ["机の上に本があります。", "Tsukue no ue ni hon ga arimasu.", "There is a book on the desk."],
  ["椅子の下にかばんがあります。", "Isu no shita ni kaban ga arimasu.", "There is a bag under the chair."],
  ["冷蔵庫に水があります。", "Reizouko ni mizu ga arimasu.", "There is water in the refrigerator."],
  ["部屋にテレビがあります。", "Heya ni terebi ga arimasu.", "There is a TV in the room."],
  ["ベッドの上に猫がいます。", "Beddo no ue ni neko ga imasu.", "There is a cat on the bed."],
  ["家の前に車があります。", "Ie no mae ni kuruma ga arimasu.", "There is a car in front of the house."],
  ["学校の後ろに公園があります。", "Gakkou no ushiro ni kouen ga arimasu.", "There is a park behind the school."],
  ["駅の近くにホテルがあります。", "Eki no chikaku ni hoteru ga arimasu.", "There is a hotel near the station."],
  ["コンビニの隣に銀行があります。", "Konbini no tonari ni ginkou ga arimasu.", "There is a bank next to the convenience store."],
  ["右にあります。", "Migi ni arimasu.", "It is on the right."],
  ["左にあります。", "Hidari ni arimasu.", "It is on the left."],
  ["上にあります。", "Ue ni arimasu.", "It is above."],
  ["下にあります。", "Shita ni arimasu.", "It is below."],
  ["中にあります。", "Naka ni arimasu.", "It is inside."],
  ["外にあります。", "Soto ni arimasu.", "It is outside."],
  ["隣にあります。", "Tonari ni arimasu.", "It is next to it."],
  ["前にあります。", "Mae ni arimasu.", "It is in front."],
  ["後ろにあります。", "Ushiro ni arimasu.", "It is behind."],
  ["近くにあります。", "Chikaku ni arimasu.", "It is nearby."],
];

const set13: Sentence[] = [
  ["日本語を勉強しています。", "Nihongo o benkyou shiteimasu.", "I am studying Japanese."],
  ["今、本を読んでいます。", "Ima, hon o yondeimasu.", "I am reading a book now."],
  ["テレビを見ています。", "Terebi o miteimasu.", "I am watching TV."],
  ["音楽を聞いています。", "Ongaku o kiiteimasu.", "I am listening to music."],
  ["ご飯を食べています。", "Gohan o tabeteimasu.", "I am eating."],
  ["コーヒーを飲んでいます。", "Koohii o nondeimasu.", "I am drinking coffee."],
  ["仕事をしています。", "Shigoto o shiteimasu.", "I am working."],
  ["電話をしています。", "Denwa o shiteimasu.", "I am talking on the phone."],
  ["友達を待っています。", "Tomodachi o matteimasu.", "I am waiting for my friend."],
  ["電車を待っています。", "Densha o matteimasu.", "I am waiting for the train."],
  ["今、家にいます。", "Ima, ie ni imasu.", "I am at home now."],
  ["学校にいます。", "Gakkou ni imasu.", "I am at school."],
  ["東京に住んでいます。", "Toukyou ni sundeimasu.", "I live in Tokyo."],
  ["日本語を話しています。", "Nihongo o hanashiteimasu.", "I am speaking Japanese."],
  ["写真を撮っています。", "Shashin o totteimasu.", "I am taking photos."],
  ["料理を作っています。", "Ryouri o tsukutteimasu.", "I am cooking."],
  ["部屋を掃除しています。", "Heya o souji shiteimasu.", "I am cleaning the room."],
  ["宿題をしています。", "Shukudai o shiteimasu.", "I am doing homework."],
  ["メールを書いています。", "Meeru o kaiteimasu.", "I am writing an email."],
  ["日本へ旅行しています。", "Nihon e ryokou shiteimasu.", "I am traveling in Japan."],
];

const set14: Sentence[] = [
  ["日本へ行ったことがあります。", "Nihon e itta koto ga arimasu.", "I have been to Japan."],
  ["京都へ行ったことがあります。", "Kyouto e itta koto ga arimasu.", "I have been to Kyoto."],
  ["寿司を食べたことがあります。", "Sushi o tabeta koto ga arimasu.", "I have eaten sushi."],
  ["富士山を見たことがあります。", "Fujisan o mita koto ga arimasu.", "I have seen Mount Fuji."],
  ["日本語を勉強したことがあります。", "Nihongo o benkyou shita koto ga arimasu.", "I have studied Japanese."],
  ["この映画を見たことがあります。", "Kono eiga o mita koto ga arimasu.", "I have seen this movie."],
  ["この店に来たことがあります。", "Kono mise ni kita koto ga arimasu.", "I have been to this shop."],
  ["電車に乗ったことがあります。", "Densha ni notta koto ga arimasu.", "I have ridden a train."],
  ["日本料理を作ったことがあります。", "Nihon ryouri o tsukutta koto ga arimasu.", "I have cooked Japanese food."],
  ["日本語の本を読んだことがあります。", "Nihongo no hon o yonda koto ga arimasu.", "I have read a Japanese book."],
  ["まだ食べたことがありません。", "Mada tabeta koto ga arimasen.", "I have never eaten it."],
  ["まだ行ったことがありません。", "Mada itta koto ga arimasen.", "I have never been there."],
  ["一度見たことがあります。", "Ichido mita koto ga arimasu.", "I have seen it once."],
  ["何度も行ったことがあります。", "Nando mo itta koto ga arimasu.", "I have been there many times."],
  ["一度もありません。", "Ichido mo arimasen.", "Not even once."],
  ["去年日本へ行きました。", "Kyonen Nihon e ikimashita.", "I went to Japan last year."],
  ["先月京都へ行きました。", "Sengetsu Kyouto e ikimashita.", "I went to Kyoto last month."],
  ["昨日映画を見ました。", "Kinou eiga o mimashita.", "I watched a movie yesterday."],
  ["今朝コーヒーを飲みました。", "Kesa koohii o nomimashita.", "I drank coffee this morning."],
  ["先週友達に会いました。", "Senshuu tomodachi ni aimashita.", "I met my friend last week."],
];

const set15: Sentence[] = [
  ["日本語が上手になりたいです。", "Nihongo ga jouzu ni naritai desu.", "I want to become good at Japanese."],
  ["日本へ行きたいです。", "Nihon e ikitai desu.", "I want to go to Japan."],
  ["新しい仕事を探しています。", "Atarashii shigoto o sagashiteimasu.", "I am looking for a new job."],
  ["日本語をもっと話したいです。", "Nihongo o motto hanashitai desu.", "I want to speak more Japanese."],
  ["寿司を食べたいです。", "Sushi o tabetai desu.", "I want to eat sushi."],
  ["京都を見たいです。", "Kyouto o mitai desu.", "I want to see Kyoto."],
  ["休みたいです。", "Yasumitai desu.", "I want to rest."],
  ["水を飲みたいです。", "Mizu o nomitai desu.", "I want to drink water."],
  ["映画を見たいです。", "Eiga o mitai desu.", "I want to watch a movie."],
  ["本を読みたいです。", "Hon o yomitai desu.", "I want to read a book."],
  ["明日行きたいです。", "Ashita ikitai desu.", "I want to go tomorrow."],
  ["一緒に行きたいです。", "Issho ni ikitai desu.", "I want to go together."],
  ["日本で働きたいです。", "Nihon de hatarakitai desu.", "I want to work in Japan."],
  ["もっと勉強したいです。", "Motto benkyou shitai desu.", "I want to study more."],
  ["日本語を話せるようになりたいです。", "Nihongo o hanaseru you ni naritai desu.", "I want to become able to speak Japanese."],
  ["将来、日本に住みたいです。", "Shourai, Nihon ni sumitai desu.", "I want to live in Japan in the future."],
  ["旅行したいです。", "Ryokou shitai desu.", "I want to travel."],
  ["新しい友達を作りたいです。", "Atarashii tomodachi o tsukuritai desu.", "I want to make new friends."],
  ["日本文化を知りたいです。", "Nihon bunka o shiritai desu.", "I want to learn about Japanese culture."],
  ["毎日練習したいです。", "Mainichi renshuu shitai desu.", "I want to practice every day."],
];

const set16: Sentence[] = [
  ["これは便利です。", "Kore wa benri desu.", "This is convenient."],
  ["これは簡単です。", "Kore wa kantan desu.", "This is easy."],
  ["これは難しいです。", "Kore wa muzukashii desu.", "This is difficult."],
  ["この本は面白いです。", "Kono hon wa omoshiroi desu.", "This book is interesting."],
  ["この映画は長いです。", "Kono eiga wa nagai desu.", "This movie is long."],
  ["この部屋は広いです。", "Kono heya wa hiroi desu.", "This room is spacious."],
  ["この部屋は狭いです。", "Kono heya wa semai desu.", "This room is small."],
  ["今日は忙しいです。", "Kyou wa isogashii desu.", "I am busy today."],
  ["この店は有名です。", "Kono mise wa yuumei desu.", "This shop is famous."],
  ["この町は静かです。", "Kono machi wa shizuka desu.", "This town is quiet."],
  ["東京はにぎやかです。", "Toukyou wa nigiyaka desu.", "Tokyo is lively."],
  ["この料理はおいしいです。", "Kono ryouri wa oishii desu.", "This food is delicious."],
  ["この水は冷たいです。", "Kono mizu wa tsumetai desu.", "This water is cold."],
  ["お茶は熱いです。", "Ocha wa atsui desu.", "The tea is hot."],
  ["今日は楽しいです。", "Kyou wa tanoshii desu.", "Today is fun."],
  ["この問題は大切です。", "Kono mondai wa taisetsu desu.", "This problem is important."],
  ["日本語は面白いです。", "Nihongo wa omoshiroi desu.", "Japanese is interesting."],
  ["この仕事は大変です。", "Kono shigoto wa taihen desu.", "This work is difficult."],
  ["このホテルはきれいです。", "Kono hoteru wa kirei desu.", "This hotel is clean/beautiful."],
  ["この公園は静かです。", "Kono kouen wa shizuka desu.", "This park is quiet."],
];

const set17: Sentence[] = [
  ["電車が来ました。", "Densha ga kimashita.", "The train has arrived."],
  ["電車が遅れています。", "Densha ga okureteimasu.", "The train is delayed."],
  ["電車が早いです。", "Densha ga hayai desu.", "The train is fast."],
  ["次の電車に乗ります。", "Tsugi no densha ni norimasu.", "I will take the next train."],
  ["この電車は東京へ行きますか。", "Kono densha wa Toukyou e ikimasu ka.", "Does this train go to Tokyo?"],
  ["何番線ですか。", "Nanbansen desu ka.", "Which platform is it?"],
  ["切符を見せてください。", "Kippu o misete kudasai.", "Please show your ticket."],
  ["駅員さんに聞きます。", "Ekiin-san ni kikimasu.", "I ask the station staff."],
  ["ここで乗り換えます。", "Koko de norikaemasu.", "I transfer here."],
  ["次で降ります。", "Tsugi de orimasu.", "I get off at the next stop."],
  ["電車は何時ですか。", "Densha wa nanji desu ka.", "What time is the train?"],
  ["バス停はどこですか。", "Basutei wa doko desu ka.", "Where is the bus stop?"],
  ["バスが来ました。", "Basu ga kimashita.", "The bus has arrived."],
  ["タクシーを呼びます。", "Takushii o yobimasu.", "I will call a taxi."],
  ["空港へ行きたいです。", "Kuukou e ikitai desu.", "I want to go to the airport."],
  ["ホテルまでお願いします。", "Hoteru made onegaishimasu.", "To the hotel, please."],
  ["ここで止めてください。", "Koko de tomete kudasai.", "Please stop here."],
  ["荷物があります。", "Nimotsu ga arimasu.", "I have luggage."],
  ["荷物を預けます。", "Nimotsu o azukemasu.", "I check in my luggage."],
  ["旅行を楽しみます。", "Ryokou o tanoshimimasu.", "I enjoy traveling."],
];

const set18: Sentence[] = [
  ["何をしていますか。", "Nani o shiteimasu ka.", "What are you doing?"],
  ["どこに住んでいますか。", "Doko ni sundeimasu ka.", "Where do you live?"],
  ["どこから来ましたか。", "Doko kara kimashita ka.", "Where did you come from?"],
  ["何歳ですか。", "Nansai desu ka.", "How old are you?"],
  ["何が好きですか。", "Nani ga suki desu ka.", "What do you like?"],
  ["日本語が話せますか。", "Nihongo ga hanasemasu ka.", "Can you speak Japanese?"],
  ["英語が話せますか。", "Eigo ga hanasemasu ka.", "Can you speak English?"],
  ["これは何ですか。", "Kore wa nan desu ka.", "What is this?"],
  ["誰ですか。", "Dare desu ka.", "Who is it?"],
  ["どちらですか。", "Dochira desu ka.", "Which one / where is it?"],
  ["いつですか。", "Itsu desu ka.", "When is it?"],
  ["どうしてですか。", "Doushite desu ka.", "Why?"],
  ["どうですか。", "Dou desu ka.", "How is it?"],
  ["いくらですか。", "Ikura desu ka.", "How much is it?"],
  ["いくつありますか。", "Ikutsu arimasu ka.", "How many are there?"],
  ["何人いますか。", "Nannin imasu ka.", "How many people are there?"],
  ["何時からですか。", "Nanji kara desu ka.", "From what time?"],
  ["何時までですか。", "Nanji made desu ka.", "Until what time?"],
  ["どのくらいかかりますか。", "Dono kurai kakarimasu ka.", "How long does it take?"],
  ["どうやって行きますか。", "Dou yatte ikimasu ka.", "How do I get there?"],
];

const set19: Sentence[] = [
  ["すみません、ちょっといいですか。", "Sumimasen, chotto ii desu ka.", "Excuse me, may I ask something?"],
  ["もう一度言ってください。", "Mou ichido itte kudasai.", "Please say it again."],
  ["ゆっくりお願いします。", "Yukkuri onegaishimasu.", "Slowly, please."],
  ["もう少し大きい声でお願いします。", "Mou sukoshi ookii koe de onegaishimasu.", "A little louder, please."],
  ["日本語がまだ上手ではありません。", "Nihongo ga mada jouzu dewa arimasen.", "My Japanese is not good yet."],
  ["英語で話してもいいですか。", "Eigo de hanashite mo ii desu ka.", "May I speak in English?"],
  ["ここに座ってもいいですか。", "Koko ni suwatte mo ii desu ka.", "May I sit here?"],
  ["写真を撮ってもいいですか。", "Shashin o totte mo ii desu ka.", "May I take a photo?"],
  ["ここで食べてもいいですか。", "Koko de tabete mo ii desu ka.", "May I eat here?"],
  ["入ってもいいですか。", "Haitte mo ii desu ka.", "May I come in?"],
  ["使ってもいいですか。", "Tsukatte mo ii desu ka.", "May I use it?"],
  ["ここで待ってもいいですか。", "Koko de matte mo ii desu ka.", "May I wait here?"],
  ["これはどういう意味ですか。", "Kore wa dou iu imi desu ka.", "What does this mean?"],
  ["日本語で何と言いますか。", "Nihongo de nan to iimasu ka.", "How do you say this in Japanese?"],
  ["英語では何と言いますか。", "Eigo de nan to iimasu ka.", "How do you say this in English?"],
  ["書いてください。", "Kaite kudasai.", "Please write it."],
  ["見せてください。", "Misete kudasai.", "Please show me."],
  ["教えてください。", "Oshiete kudasai.", "Please tell me / teach me."],
  ["確認してください。", "Kakunin shite kudasai.", "Please check."],
  ["ありがとうございます、助かりました。", "Arigatou gozaimasu, tasukarimashita.", "Thank you, that helped me."],
];

const set20: Sentence[] = [
  ["今日はいい一日でした。", "Kyou wa ii ichinichi deshita.", "Today was a good day."],
  ["明日も頑張りましょう。", "Ashita mo ganbarimashou.", "Let's do our best tomorrow too."],
  ["毎日日本語を勉強します。", "Mainichi Nihongo o benkyou shimasu.", "I study Japanese every day."],
  ["日本語をもっと上手になりたいです。", "Nihongo o motto jouzu ni naritai desu.", "I want to get better at Japanese."],
  ["毎日少しずつ練習します。", "Mainichi sukoshi zutsu renshuu shimasu.", "I practice little by little every day."],
  ["新しい言葉を覚えます。", "Atarashii kotoba o oboemasu.", "I learn new words."],
  ["漢字を練習します。", "Kanji o renshuu shimasu.", "I practice kanji."],
  ["ひらがなを勉強します。", "Hiragana o benkyou shimasu.", "I study hiragana."],
  ["カタカナを勉強します。", "Katakana o benkyou shimasu.", "I study katakana."],
  ["日本語を聞く練習をします。", "Nihongo o kiku renshuu o shimasu.", "I practice listening to Japanese."],
  ["日本語を読む練習をします。", "Nihongo o yomu renshuu o shimasu.", "I practice reading Japanese."],
  ["日本語を書く練習をします。", "Nihongo o kaku renshuu o shimasu.", "I practice writing Japanese."],
  ["日本語を話す練習をします。", "Nihongo o hanasu renshuu o shimasu.", "I practice speaking Japanese."],
  ["間違えても大丈夫です。", "Machigaete mo daijoubu desu.", "It's okay to make mistakes."],
  ["少しずつ上手になります。", "Sukoshi zutsu jouzu ni narimasu.", "I will improve little by little."],
  ["あきらめないでください。", "Akiramenai de kudasai.", "Please don't give up."],
  ["一緒に頑張りましょう。", "Issho ni ganbarimashou.", "Let's do our best together."],
  ["今日も勉強できました。", "Kyou mo benkyou dekimashita.", "I was able to study today too."],
  ["明日も日本語を勉強します。", "Ashita mo Nihongo o benkyou shimasu.", "I will study Japanese tomorrow too."],
  ["日本語が大好きです。", "Nihongo ga daisuki desu.", "I love Japanese."],
];

/* =========================================================
   Convert all sets into 400 lessons
   ========================================================= */

const sentenceSets: Sentence[][] = [
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
  set9,
  set10,
  set11,
  set12,
  set13,
  set14,
  set15,
  set16,
  set17,
  set18,
  set19,
  set20,
];

const lessons: Lesson[] = sentenceSets.flatMap(
  (sentenceSet, setIndex) =>
    sentenceSet.map((item, lessonIndex) => ({
      id: setIndex * 20 + lessonIndex + 1,
      set: setIndex + 1,
      lesson: lessonIndex + 1,
      japanese: item[0],
      romaji: item[1],
      meaning: item[2],
    })),
);

function Listening() {
  const { addListeningCompleted } = useLearning();

  const [currentSet, setCurrentSet] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);

  /* Load saved completed lesson IDs */
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);

      if (savedRaw) {
        const saved = JSON.parse(savedRaw);

        if (Array.isArray(saved)) {
          const validIds = saved.filter(
            (id): id is number =>
              typeof id === "number" &&
              Number.isInteger(id) &&
              id >= 1 &&
              id <= lessons.length,
          );

          setCompleted(validIds);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(validIds),
          );
          localStorage.setItem(
            LEGACY_STORAGE_KEY,
            String(validIds.length),
          );
          return;
        }
      }

      /* Migrate the previous version where completed IDs were
         stored in the same key used by LearningContext's count. */
      const legacyRaw = localStorage.getItem(
        LEGACY_STORAGE_KEY,
      );

      if (legacyRaw) {
        try {
          const legacyParsed = JSON.parse(legacyRaw);

          if (Array.isArray(legacyParsed)) {
            const validIds = legacyParsed.filter(
              (id): id is number =>
                typeof id === "number" &&
                Number.isInteger(id) &&
                id >= 1 &&
                id <= lessons.length,
            );

            setCompleted(validIds);
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(validIds),
            );
            localStorage.setItem(
              LEGACY_STORAGE_KEY,
              String(validIds.length),
            );
            return;
          }
        } catch {
          /* Legacy value is a normal numeric count. */
        }
      }

      setCompleted([]);
    } catch {
      setCompleted([]);
    }
  }, []);

  const currentSetLessons = useMemo(
    () =>
      lessons.filter(
        (item) => item.set === currentSet,
      ),
    [currentSet],
  );

  const lesson = currentSetLessons[currentLesson - 1];

  const totalCompleted = completed.length;

  const setCompletedCount = currentSetLessons.filter(
    (item) => completed.includes(item.id),
  ).length;

  const setProgress = Math.round(
    (setCompletedCount / 20) * 100,
  );

  const overallProgress = Math.round(
    (totalCompleted / lessons.length) * 100,
  );

  const speak = () => {
    if (!("speechSynthesis" in window) || !lesson) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        lesson.japanese,
      );

    utterance.lang = "ja-JP";
    utterance.rate = 0.75;

    window.speechSynthesis.speak(
      utterance,
    );
  };

  const saveCompleted = (
    updated: number[],
  ) => {
    const uniqueValidIds = Array.from(
      new Set(
        updated.filter(
          (id) =>
            Number.isInteger(id) &&
            id >= 1 &&
            id <= lessons.length,
        ),
      ),
    );

    setCompleted(uniqueValidIds);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(uniqueValidIds),
    );

    /* Keep LearningContext's numeric count in sync */
    localStorage.setItem(
      LEGACY_STORAGE_KEY,
      String(uniqueValidIds.length),
    );
  };

  const markComplete = () => {
    if (!lesson) {
      return;
    }

    if (completed.includes(lesson.id)) {
      return;
    }

    const updated = [
      ...completed,
      lesson.id,
    ];

    saveCompleted(updated);

    addListeningCompleted();
  };

  const nextLesson = () => {
    if (currentLesson < 20) {
      setCurrentLesson(
        (value) => value + 1,
      );
      return;
    }

    if (currentSet < 20) {
      setCurrentSet(
        (value) => value + 1,
      );
      setCurrentLesson(1);
    }
  };

  const previousLesson = () => {
    if (currentLesson > 1) {
      setCurrentLesson(
        (value) => value - 1,
      );
      return;
    }

    if (currentSet > 1) {
      setCurrentSet(
        (value) => value - 1,
      );
      setCurrentLesson(20);
    }
  };

  const selectSet = (setNumber: number) => {
    setCurrentSet(setNumber);
    setCurrentLesson(1);
    window.speechSynthesis.cancel();
  };

  const resetSet = () => {
    const setIds = currentSetLessons.map(
      (item) => item.id,
    );

    const updated = completed.filter(
      (id) => !setIds.includes(id),
    );

    saveCompleted(updated);

    setCurrentLesson(1);

    window.speechSynthesis.cancel();
  };

  const resetAll = () => {
    saveCompleted([]);
    setCurrentSet(1);
    setCurrentLesson(1);
    window.speechSynthesis.cancel();
  };

  if (!lesson) {
    return null;
  }

  const isCompleted = completed.includes(
    lesson.id,
  );

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-pink-100 p-2.5 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
              <Headphones size={22} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
              Japanese Listening
            </p>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Listening Practice
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Listen, understand and improve your
            Japanese listening skills.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Lessons
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {lessons.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              20 Sets × 20 Lessons
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-pink-500">
              {totalCompleted}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {overallProgress}% overall
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Current Set
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {currentSet}
              <span className="text-lg text-slate-400">
                {" "}
                / 20
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {setCompletedCount}/20 completed
            </p>
          </div>

        </div>

        {/* Overall Progress */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-white">
              Overall Listening Progress
            </span>

            <span className="font-bold text-pink-500">
              {totalCompleted}/{lessons.length}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${overallProgress}%`,
              }}
              className="h-full rounded-full bg-pink-500"
            />
          </div>

        </div>

        {/* Set Selector */}
        <section className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Listening Sets
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose a set of 20 lessons.
              </p>
            </div>

            <button
              onClick={resetAll}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">

            {Array.from(
              { length: 20 },
              (_, index) => {
                const setNumber =
                  index + 1;

                const count =
                  lessons.filter(
                    (item) =>
                      item.set ===
                      setNumber &&
                      completed.includes(
                        item.id,
                      ),
                  ).length;

                const percentage =
                  Math.round(
                    (count / 20) * 100,
                  );

                return (
                  <button
                    key={setNumber}
                    onClick={() =>
                      selectSet(
                        setNumber,
                      )
                    }
                    className={`rounded-2xl border p-3 text-left transition ${
                      currentSet ===
                      setNumber
                        ? "border-pink-300 bg-pink-50 shadow-sm dark:border-pink-800 dark:bg-pink-950/30"
                        : "border-slate-200 bg-white hover:border-pink-200 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${
                          currentSet ===
                          setNumber
                            ? "text-pink-500"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Set {setNumber}
                      </span>

                      {percentage ===
                        100 && (
                        <CheckCircle
                          size={16}
                          className="text-green-500"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {count}/20
                    </p>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-pink-500 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </button>
                );
              },
            )}

          </div>
        </section>

        {/* Current Set Header */}
        <div className="mb-5 rounded-2xl border border-pink-100 bg-pink-50/70 p-5 dark:border-pink-900/50 dark:bg-pink-950/20">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-pink-100 p-2.5 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
                <BookOpen size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Set {currentSet} Lessons
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  20 Japanese listening lessons
                </p>
              </div>
            </div>

            <div className="sm:w-64">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">
                  Set Progress
                </span>

                <span className="font-bold text-pink-500">
                  {setCompletedCount}/20
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-pink-500 transition-all"
                  style={{
                    width: `${setProgress}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Current Lesson */}
        <motion.div
          key={lesson.id}
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-8 text-center shadow-xl sm:p-12"
        >

          <div className="mb-6 flex items-center justify-between">

            <span className="rounded-full bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-400">
              Set {currentSet}
            </span>

            <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
              Lesson {currentLesson}/20
            </span>

          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold leading-relaxed text-white sm:text-5xl">
              {lesson.japanese}
            </h2>

            <p className="mt-5 text-lg text-pink-400">
              {lesson.romaji}
            </p>
          </div>

          {/* Play */}
          <button
            onClick={speak}
            className="mx-auto flex items-center gap-3 rounded-full bg-pink-500 px-8 py-4 font-bold text-white shadow-lg shadow-pink-500/30 transition hover:scale-105 hover:bg-pink-600"
          >
            <Play
              size={22}
              fill="currentColor"
            />
            Play Audio
          </button>

          {/* Meaning */}
          <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Meaning
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {lesson.meaning}
            </p>
          </div>

        </motion.div>

        {/* Navigation */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <button
            onClick={previousLesson}
            disabled={
              currentSet === 1 &&
              currentLesson === 1
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={markComplete}
            disabled={isCompleted}
            className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-4 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle size={20} />

            {isCompleted
              ? "Completed"
              : "Mark as Complete"}
          </button>

          <button
            onClick={nextLesson}
            disabled={
              currentSet === 20 &&
              currentLesson === 20
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Next
            <ChevronRight size={20} />
          </button>

        </div>

        {/* Reset Current Set */}
        <div className="mt-4 text-center">
          <button
            onClick={resetSet}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-pink-500 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <RotateCcw size={17} />
            Reset Set {currentSet}
          </button>
        </div>

        {/* Lesson List */}
        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Set {currentSet} Lessons
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {setCompletedCount}/20 lessons completed
              </p>
            </div>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-500 dark:bg-pink-500/10">
              {setProgress}%
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {currentSetLessons.map(
              (item, index) => {
                const itemCompleted =
                  completed.includes(
                    item.id,
                  );

                const active =
                  item.id ===
                  lesson.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setCurrentLesson(
                        index + 1,
                      )
                    }
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-pink-300 bg-pink-50 dark:border-pink-900 dark:bg-pink-950/20"
                        : "border-slate-200 bg-white hover:border-pink-200 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        itemCompleted
                          ? "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400"
                          : active
                            ? "bg-pink-100 text-pink-500 dark:bg-pink-500/10 dark:text-pink-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {itemCompleted ? (
                        <CheckCircle
                          size={20}
                        />
                      ) : (
                        <Volume2
                          size={20}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Lesson{" "}
                          {index + 1}
                        </span>

                        {itemCompleted && (
                          <span className="text-xs font-semibold text-green-500">
                            Complete
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-slate-800 dark:text-white">
                        {item.japanese}
                      </p>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.romaji}
                      </p>
                    </div>

                  </button>
                );
              },
            )}

          </div>
        </section>

        {/* Bottom Progress */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Yomiko Listening Journey
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep practicing every day.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-pink-500">
                {totalCompleted}/400
              </p>

              <p className="text-xs text-slate-400">
                {overallProgress}% complete
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              animate={{
                width: `${overallProgress}%`,
              }}
              className="h-full rounded-full bg-pink-500"
            />
          </div>

        </div>

      </div>
    </div>
  );
}

export default Listening;