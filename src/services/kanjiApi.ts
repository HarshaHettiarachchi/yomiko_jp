export interface Kanji {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  jlpt: number | null;
}

const API_BASE_URL = "https://kanjiapi.dev/v1";

export async function getKanjiByLevel(level: string): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/kanji/jlpt-${level.replace("N", "")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch kanji list");
  }

  return response.json();
}

export async function getKanjiDetails(
  kanji: string
): Promise<Kanji> {
  const response = await fetch(
    `${API_BASE_URL}/kanji/${encodeURIComponent(kanji)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch kanji: ${kanji}`);
  }

  return response.json();
}