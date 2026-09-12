export interface Vocabulary {
  word: string;
  reading: string;
  meanings: string[];
  partsOfSpeech: string[];
  level: number;
}

interface ApiWord {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
}

interface ApiResponse {
  total: number;
  offset: number;
  limit: number;
  words: ApiWord[];
}

const API_BASE_URL = "https://jlpt-vocab-api.vercel.app/api/words";

const levelMap: Record<string, number> = {
  N5: 5,
  N4: 4,
  N3: 3,
  N2: 2,
  N1: 1,
};

export async function getVocabularyByLevel(
  level: string,
): Promise<Vocabulary[]> {
  const apiLevel = levelMap[level];

  if (!apiLevel) {
    throw new Error("Invalid JLPT level");
  }

  const response = await fetch(
    `${API_BASE_URL}?level=${apiLevel}&limit=100`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vocabulary");
  }

  const result: ApiResponse = await response.json();

  return result.words.map((item) => ({
    word: item.word,
    reading: item.furigana,
    meanings: [item.meaning],
    partsOfSpeech: [],
    level: item.level,
  }));
}