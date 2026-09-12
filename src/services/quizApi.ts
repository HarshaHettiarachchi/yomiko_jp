export type QuizCategory =
  | "Vocabulary"
  | "Kanji"
  | "Hiragana"
  | "Katakana";

export interface VocabularyItem {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
}

export interface KanjiItem {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  jlpt: number | null;
}

export interface KanaItem {
  character: string;
  romaji: string;
}

const VOCAB_API =
  "https://jlpt-vocab-api.vercel.app/api";

const KANJI_API =
  "https://kanjiapi.dev/v1";

/* =====================================================
   VOCABULARY
===================================================== */

export async function getVocabularyQuizPool(
  level: number,
  amount = 1000,
): Promise<VocabularyItem[]> {
  const response = await fetch(
    `${VOCAB_API}/words?level=${level}&offset=0&limit=${amount}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load vocabulary",
    );
  }

  const data = await response.json();

  return Array.isArray(data.words)
    ? data.words
    : [];
}

/* =====================================================
   KANJI LIST
===================================================== */

export async function getKanjiList(
  level: number,
): Promise<string[]> {
  const response = await fetch(
    `${KANJI_API}/kanji/jlpt-${level}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load kanji list",
    );
  }

  return response.json();
}

/* =====================================================
   KANJI DETAILS
===================================================== */

export async function getKanjiDetails(
  kanji: string,
): Promise<KanjiItem | null> {
  try {
    const response = await fetch(
      `${KANJI_API}/kanji/${encodeURIComponent(
        kanji,
      )}`,
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

/* =====================================================
   KANJI QUIZ POOL
===================================================== */

export async function getKanjiQuizPool(
  level: number,
): Promise<KanjiItem[]> {
  const characters =
    await getKanjiList(level);

  const results: KanjiItem[] = [];

  /*
   * Load in small batches instead of
   * sending hundreds of requests at once.
   */

  const batchSize = 10;

  for (
    let i = 0;
    i < characters.length;
    i += batchSize
  ) {
    const batch =
      characters.slice(
        i,
        i + batchSize,
      );

    const details =
      await Promise.all(
        batch.map((character) =>
          getKanjiDetails(character),
        ),
      );

    results.push(
      ...details.filter(
        (
          item,
        ): item is KanjiItem =>
          item !== null,
      ),
    );
  }

  return results;
}

/* =====================================================
   HIRAGANA
===================================================== */

export const hiragana: KanaItem[] = [
  { character: "あ", romaji: "a" },
  { character: "い", romaji: "i" },
  { character: "う", romaji: "u" },
  { character: "え", romaji: "e" },
  { character: "お", romaji: "o" },

  { character: "か", romaji: "ka" },
  { character: "き", romaji: "ki" },
  { character: "く", romaji: "ku" },
  { character: "け", romaji: "ke" },
  { character: "こ", romaji: "ko" },

  { character: "さ", romaji: "sa" },
  { character: "し", romaji: "shi" },
  { character: "す", romaji: "su" },
  { character: "せ", romaji: "se" },
  { character: "そ", romaji: "so" },

  { character: "た", romaji: "ta" },
  { character: "ち", romaji: "chi" },
  { character: "つ", romaji: "tsu" },
  { character: "て", romaji: "te" },
  { character: "と", romaji: "to" },

  { character: "な", romaji: "na" },
  { character: "に", romaji: "ni" },
  { character: "ぬ", romaji: "nu" },
  { character: "ね", romaji: "ne" },
  { character: "の", romaji: "no" },

  { character: "は", romaji: "ha" },
  { character: "ひ", romaji: "hi" },
  { character: "ふ", romaji: "fu" },
  { character: "へ", romaji: "he" },
  { character: "ほ", romaji: "ho" },

  { character: "ま", romaji: "ma" },
  { character: "み", romaji: "mi" },
  { character: "む", romaji: "mu" },
  { character: "め", romaji: "me" },
  { character: "も", romaji: "mo" },

  { character: "や", romaji: "ya" },
  { character: "ゆ", romaji: "yu" },
  { character: "よ", romaji: "yo" },

  { character: "ら", romaji: "ra" },
  { character: "り", romaji: "ri" },
  { character: "る", romaji: "ru" },
  { character: "れ", romaji: "re" },
  { character: "ろ", romaji: "ro" },

  { character: "わ", romaji: "wa" },
  { character: "を", romaji: "wo" },
  { character: "ん", romaji: "n" },
];

/* =====================================================
   KATAKANA
===================================================== */

export const katakana: KanaItem[] = [
  { character: "ア", romaji: "a" },
  { character: "イ", romaji: "i" },
  { character: "ウ", romaji: "u" },
  { character: "エ", romaji: "e" },
  { character: "オ", romaji: "o" },

  { character: "カ", romaji: "ka" },
  { character: "キ", romaji: "ki" },
  { character: "ク", romaji: "ku" },
  { character: "ケ", romaji: "ke" },
  { character: "コ", romaji: "ko" },

  { character: "サ", romaji: "sa" },
  { character: "シ", romaji: "shi" },
  { character: "ス", romaji: "su" },
  { character: "セ", romaji: "se" },
  { character: "ソ", romaji: "so" },

  { character: "タ", romaji: "ta" },
  { character: "チ", romaji: "chi" },
  { character: "ツ", romaji: "tsu" },
  { character: "テ", romaji: "te" },
  { character: "ト", romaji: "to" },

  { character: "ナ", romaji: "na" },
  { character: "ニ", romaji: "ni" },
  { character: "ヌ", romaji: "nu" },
  { character: "ネ", romaji: "ne" },
  { character: "ノ", romaji: "no" },

  { character: "ハ", romaji: "ha" },
  { character: "ヒ", romaji: "hi" },
  { character: "フ", romaji: "fu" },
  { character: "ヘ", romaji: "he" },
  { character: "ホ", romaji: "ho" },

  { character: "マ", romaji: "ma" },
  { character: "ミ", romaji: "mi" },
  { character: "ム", romaji: "mu" },
  { character: "メ", romaji: "me" },
  { character: "モ", romaji: "mo" },

  { character: "ヤ", romaji: "ya" },
  { character: "ユ", romaji: "yu" },
  { character: "ヨ", romaji: "yo" },

  { character: "ラ", romaji: "ra" },
  { character: "リ", romaji: "ri" },
  { character: "ル", romaji: "ru" },
  { character: "レ", romaji: "re" },
  { character: "ロ", romaji: "ro" },

  { character: "ワ", romaji: "wa" },
  { character: "ヲ", romaji: "wo" },
  { character: "ン", romaji: "n" },
];

/* =====================================================
   SHUFFLE
===================================================== */

export function shuffle<T>(
  items: T[],
): T[] {
  const array = [...items];

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [
      array[i],
      array[j],
    ] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

/* =====================================================
   CREATE OPTIONS
===================================================== */

export function createOptions(
  correct: string,
  pool: string[],
  count = 4,
): string[] {
  const unique = Array.from(
    new Set(
      pool.filter(
        (item) =>
          item !== correct &&
          item.trim() !== "",
      ),
    ),
  );

  const wrongAnswers =
    shuffle(unique).slice(
      0,
      count - 1,
    );

  return shuffle([
    correct,
    ...wrongAnswers,
  ]);
}