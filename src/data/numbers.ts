export type NumberCategory =
  | "Numbers"
  | "Time"
  | "Days"
  | "Months"
  | "Dates"
  | "Money";

export interface NumberItem {
  id: number;
  category: NumberCategory;
  japanese: string;
  romaji: string;
  meaning: string;
  value?: string;
}

/* =========================================================
   BASIC DIGITS
   ========================================================= */

const digitJapanese = [
  "零",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
];

const digitRomaji = [
  "zero",
  "ichi",
  "ni",
  "san",
  "yon",
  "go",
  "roku",
  "nana",
  "hachi",
  "kyuu",
];

/* =========================================================
   HUNDREDS
   ========================================================= */

function getHundred(n: number): {
  japanese: string;
  romaji: string;
} {
  switch (n) {
    case 1:
      return { japanese: "百", romaji: "hyaku" };

    case 2:
      return { japanese: "二百", romaji: "nihyaku" };

    case 3:
      return { japanese: "三百", romaji: "sanbyaku" };

    case 4:
      return { japanese: "四百", romaji: "yonhyaku" };

    case 5:
      return { japanese: "五百", romaji: "gohyaku" };

    case 6:
      return { japanese: "六百", romaji: "roppyaku" };

    case 7:
      return { japanese: "七百", romaji: "nanahyaku" };

    case 8:
      return { japanese: "八百", romaji: "happyaku" };

    case 9:
      return { japanese: "九百", romaji: "kyuuhyaku" };

    default:
      return { japanese: "", romaji: "" };
  }
}

/* =========================================================
   THOUSANDS
   ========================================================= */

function getThousand(n: number): {
  japanese: string;
  romaji: string;
} {
  switch (n) {
    case 1:
      return { japanese: "千", romaji: "sen" };

    case 2:
      return { japanese: "二千", romaji: "nisen" };

    case 3:
      return { japanese: "三千", romaji: "sanzen" };

    case 4:
      return { japanese: "四千", romaji: "yonsen" };

    case 5:
      return { japanese: "五千", romaji: "gosen" };

    case 6:
      return { japanese: "六千", romaji: "rokusen" };

    case 7:
      return { japanese: "七千", romaji: "nanasen" };

    case 8:
      return { japanese: "八千", romaji: "hassen" };

    case 9:
      return { japanese: "九千", romaji: "kyuusen" };

    default:
      return { japanese: "", romaji: "" };
  }
}

/* =========================================================
   1 - 99
   ========================================================= */

function getBelow100(n: number): {
  japanese: string;
  romaji: string;
} {
  if (n === 0) {
    return {
      japanese: "",
      romaji: "",
    };
  }

  if (n < 10) {
    return {
      japanese: digitJapanese[n],
      romaji: digitRomaji[n],
    };
  }

  const tens = Math.floor(n / 10);
  const ones = n % 10;

  let japanese = "";
  let romaji = "";

  if (tens === 1) {
    japanese = "十";
    romaji = "juu";
  } else {
    japanese = `${digitJapanese[tens]}十`;
    romaji = `${digitRomaji[tens]}juu`;
  }

  if (ones > 0) {
    japanese += digitJapanese[ones];
    romaji += digitRomaji[ones];
  }

  return {
    japanese,
    romaji,
  };
}

/* =========================================================
   1 - 999
   ========================================================= */

function getBelow1000(n: number): {
  japanese: string;
  romaji: string;
} {
  if (n < 100) {
    return getBelow100(n);
  }

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  const hundred = getHundred(hundreds);

  let japanese = hundred.japanese;
  let romaji = hundred.romaji;

  if (remainder > 0) {
    const rest = getBelow100(remainder);

    japanese += rest.japanese;
    romaji += rest.romaji;
  }

  return {
    japanese,
    romaji,
  };
}

/* =========================================================
   1 - 9,999
   ========================================================= */

function getBelow10000(n: number): {
  japanese: string;
  romaji: string;
} {
  if (n < 1000) {
    return getBelow1000(n);
  }

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;

  const thousand = getThousand(thousands);

  let japanese = thousand.japanese;
  let romaji = thousand.romaji;

  if (remainder > 0) {
    const rest = getBelow1000(remainder);

    japanese += rest.japanese;
    romaji += rest.romaji;
  }

  return {
    japanese,
    romaji,
  };
}

/* =========================================================
   JAPANESE NUMBER CONVERTER
   Supports large numbers using 万 and 億
   ========================================================= */

export function numberToJapanese(
  number: number,
): {
  japanese: string;
  romaji: string;
} {
  if (!Number.isFinite(number) || number < 0) {
    return {
      japanese: "",
      romaji: "",
    };
  }

  if (number === 0) {
    return {
      japanese: "零",
      romaji: "zero",
    };
  }

  if (number < 10000) {
    return getBelow10000(number);
  }

  /* =======================================================
     10,000 - 99,999,999
     ======================================================= */

  if (number < 100000000) {
    const man = Math.floor(number / 10000);
    const remainder = number % 10000;

    const manNumber = numberToJapanese(man);

    let japanese = `${manNumber.japanese}万`;
    let romaji = `${manNumber.romaji}man`;

    if (remainder > 0) {
      const rest = getBelow10000(remainder);

      japanese += rest.japanese;
      romaji += rest.romaji;
    }

    return {
      japanese,
      romaji,
    };
  }

  /* =======================================================
     100,000,000+
     ======================================================= */

  const oku = Math.floor(number / 100000000);
  const remainder = number % 100000000;

  const okuNumber = numberToJapanese(oku);

  let japanese = `${okuNumber.japanese}億`;
  let romaji = `${okuNumber.romaji}oku`;

  if (remainder > 0) {
    const rest = numberToJapanese(remainder);

    japanese += rest.japanese;
    romaji += rest.romaji;
  }

  return {
    japanese,
    romaji,
  };
}

/* =========================================================
   CREATE NUMBER ITEM
   ========================================================= */

function createNumberItem(value: number): NumberItem {
  const result = numberToJapanese(value);

  return {
    id: value,
    category: "Numbers",
    japanese: result.japanese,
    romaji: result.romaji,
    meaning: value.toLocaleString(),
    value: String(value),
  };
}

/* =========================================================
   1 - 100
   EVERY NUMBER
   ========================================================= */

const basicNumbers = Array.from(
  { length: 100 },
  (_, index) => index + 1,
);

/* =========================================================
   101 - 1000
   RANDOM 50 NUMBERS
   ========================================================= */

const randomNumbers = [
  103,
  117,
  129,
  146,
  158,
  173,
  189,
  204,
  218,
  237,
  251,
  269,
  284,
  297,
  315,
  328,
  347,
  361,
  379,
  394,
  412,
  428,
  443,
  467,
  481,
  506,
  523,
  547,
  568,
  584,
  603,
  627,
  641,
  659,
  681,
  704,
  729,
  746,
  763,
  781,
  804,
  827,
  846,
  871,
  889,
  907,
  923,
  941,
  967,
  989,
];

/* =========================================================
   1000+
   USEFUL / VARIED NUMBERS
   ========================================================= */

const largeNumbers = [
  /* 1,000 - 10,000 */
  1000,
  1100,
  1200,
  1500,
  1800,
  2000,
  2200,
  2500,
  2700,
  3000,
  3200,
  3500,
  3800,
  4000,
  4500,
  4800,
  5000,
  5500,
  6000,
  6500,
  7000,
  7500,
  8000,
  8500,
  9000,
  9500,
  10000,

  /* 10,000 - 100,000 */
  12000,
  15000,
  18000,
  20000,
  25000,
  30000,
  35000,
  40000,
  45000,
  50000,
  60000,
  75000,
  80000,
  90000,
  100000,

  /* 100,000 - 1,000,000 */
  120000,
  150000,
  200000,
  250000,
  300000,
  400000,
  500000,
  600000,
  750000,
  800000,
  900000,
  1000000,

  /* 1,000,000+ */
  1200000,
  1500000,
  2000000,
  2500000,
  3000000,
  5000000,
  7500000,
  10000000,

  /* 10,000,000+ */
  12000000,
  15000000,
  20000000,
  25000000,
  30000000,
  50000000,
  75000000,
  100000000,

  /* 100,000,000+ */
  120000000,
  150000000,
  200000000,
  250000000,
  300000000,
  500000000,
  750000000,
  1000000000,
];

/* =========================================================
   NUMBERS DATA
   ========================================================= */

export const numbers: NumberItem[] = [
  ...basicNumbers.map(createNumberItem),

  ...randomNumbers.map(createNumberItem),

  ...largeNumbers.map(createNumberItem),
];

/* =========================================================
   TIME
   ========================================================= */

export const timeExpressions: NumberItem[] = [
  {
    id: 10101,
    category: "Time",
    japanese: "一時",
    romaji: "ichiji",
    meaning: "1 o'clock",
  },
  {
    id: 10102,
    category: "Time",
    japanese: "二時",
    romaji: "niji",
    meaning: "2 o'clock",
  },
  {
    id: 10103,
    category: "Time",
    japanese: "三時",
    romaji: "sanji",
    meaning: "3 o'clock",
  },
  {
    id: 10104,
    category: "Time",
    japanese: "四時",
    romaji: "yoji",
    meaning: "4 o'clock",
  },
  {
    id: 10105,
    category: "Time",
    japanese: "五時",
    romaji: "goji",
    meaning: "5 o'clock",
  },
  {
    id: 10106,
    category: "Time",
    japanese: "六時",
    romaji: "rokuji",
    meaning: "6 o'clock",
  },
  {
    id: 10107,
    category: "Time",
    japanese: "七時",
    romaji: "shichiji",
    meaning: "7 o'clock",
  },
  {
    id: 10108,
    category: "Time",
    japanese: "八時",
    romaji: "hachiji",
    meaning: "8 o'clock",
  },
  {
    id: 10109,
    category: "Time",
    japanese: "九時",
    romaji: "kuji",
    meaning: "9 o'clock",
  },
  {
    id: 10110,
    category: "Time",
    japanese: "十時",
    romaji: "juuji",
    meaning: "10 o'clock",
  },
  {
    id: 10111,
    category: "Time",
    japanese: "十一時",
    romaji: "juuichiji",
    meaning: "11 o'clock",
  },
  {
    id: 10112,
    category: "Time",
    japanese: "十二時",
    romaji: "juuniji",
    meaning: "12 o'clock",
  },
  {
    id: 10113,
    category: "Time",
    japanese: "十五分",
    romaji: "juugofun",
    meaning: "15 minutes",
  },
  {
    id: 10114,
    category: "Time",
    japanese: "三十分",
    romaji: "sanjuppun",
    meaning: "30 minutes",
  },
  {
    id: 10115,
    category: "Time",
    japanese: "四十五分",
    romaji: "yonjuugofun",
    meaning: "45 minutes",
  },
  {
    id: 10116,
    category: "Time",
    japanese: "午前",
    romaji: "gozen",
    meaning: "AM / Morning",
  },
  {
    id: 10117,
    category: "Time",
    japanese: "午後",
    romaji: "gogo",
    meaning: "PM / Afternoon",
  },
  {
    id: 10118,
    category: "Time",
    japanese: "今",
    romaji: "ima",
    meaning: "Now",
  },
  {
    id: 10119,
    category: "Time",
    japanese: "今日",
    romaji: "kyou",
    meaning: "Today",
  },
  {
    id: 10120,
    category: "Time",
    japanese: "明日",
    romaji: "ashita",
    meaning: "Tomorrow",
  },
  {
    id: 10121,
    category: "Time",
    japanese: "昨日",
    romaji: "kinou",
    meaning: "Yesterday",
  },
];

/* =========================================================
   DAYS
   ========================================================= */

export const days: NumberItem[] = [
  {
    id: 10201,
    category: "Days",
    japanese: "月曜日",
    romaji: "getsuyoubi",
    meaning: "Monday",
  },
  {
    id: 10202,
    category: "Days",
    japanese: "火曜日",
    romaji: "kayoubi",
    meaning: "Tuesday",
  },
  {
    id: 10203,
    category: "Days",
    japanese: "水曜日",
    romaji: "suiyoubi",
    meaning: "Wednesday",
  },
  {
    id: 10204,
    category: "Days",
    japanese: "木曜日",
    romaji: "mokuyoubi",
    meaning: "Thursday",
  },
  {
    id: 10205,
    category: "Days",
    japanese: "金曜日",
    romaji: "kinyoubi",
    meaning: "Friday",
  },
  {
    id: 10206,
    category: "Days",
    japanese: "土曜日",
    romaji: "doyoubi",
    meaning: "Saturday",
  },
  {
    id: 10207,
    category: "Days",
    japanese: "日曜日",
    romaji: "nichiyoubi",
    meaning: "Sunday",
  },
  {
    id: 10208,
    category: "Days",
    japanese: "平日",
    romaji: "heijitsu",
    meaning: "Weekday",
  },
  {
    id: 10209,
    category: "Days",
    japanese: "週末",
    romaji: "shuumatsu",
    meaning: "Weekend",
  },
];

/* =========================================================
   MONTHS
   ========================================================= */

export const months: NumberItem[] = [
  {
    id: 10301,
    category: "Months",
    japanese: "一月",
    romaji: "ichigatsu",
    meaning: "January",
  },
  {
    id: 10302,
    category: "Months",
    japanese: "二月",
    romaji: "nigatsu",
    meaning: "February",
  },
  {
    id: 10303,
    category: "Months",
    japanese: "三月",
    romaji: "sangatsu",
    meaning: "March",
  },
  {
    id: 10304,
    category: "Months",
    japanese: "四月",
    romaji: "shigatsu",
    meaning: "April",
  },
  {
    id: 10305,
    category: "Months",
    japanese: "五月",
    romaji: "gogatsu",
    meaning: "May",
  },
  {
    id: 10306,
    category: "Months",
    japanese: "六月",
    romaji: "rokugatsu",
    meaning: "June",
  },
  {
    id: 10307,
    category: "Months",
    japanese: "七月",
    romaji: "shichigatsu",
    meaning: "July",
  },
  {
    id: 10308,
    category: "Months",
    japanese: "八月",
    romaji: "hachigatsu",
    meaning: "August",
  },
  {
    id: 10309,
    category: "Months",
    japanese: "九月",
    romaji: "kugatsu",
    meaning: "September",
  },
  {
    id: 10310,
    category: "Months",
    japanese: "十月",
    romaji: "juugatsu",
    meaning: "October",
  },
  {
    id: 10311,
    category: "Months",
    japanese: "十一月",
    romaji: "juuichigatsu",
    meaning: "November",
  },
  {
    id: 10312,
    category: "Months",
    japanese: "十二月",
    romaji: "juunigatsu",
    meaning: "December",
  },
];

/* =========================================================
   DATES
   ========================================================= */

export const dates: NumberItem[] = [
  {
    id: 10401,
    category: "Dates",
    japanese: "一日",
    romaji: "tsuitachi",
    meaning: "1st day",
  },
  {
    id: 10402,
    category: "Dates",
    japanese: "二日",
    romaji: "futsuka",
    meaning: "2nd day",
  },
  {
    id: 10403,
    category: "Dates",
    japanese: "三日",
    romaji: "mikka",
    meaning: "3rd day",
  },
  {
    id: 10404,
    category: "Dates",
    japanese: "四日",
    romaji: "yokka",
    meaning: "4th day",
  },
  {
    id: 10405,
    category: "Dates",
    japanese: "五日",
    romaji: "itsuka",
    meaning: "5th day",
  },
  {
    id: 10406,
    category: "Dates",
    japanese: "六日",
    romaji: "muika",
    meaning: "6th day",
  },
  {
    id: 10407,
    category: "Dates",
    japanese: "七日",
    romaji: "nanoka",
    meaning: "7th day",
  },
  {
    id: 10408,
    category: "Dates",
    japanese: "八日",
    romaji: "youka",
    meaning: "8th day",
  },
  {
    id: 10409,
    category: "Dates",
    japanese: "九日",
    romaji: "kokonoka",
    meaning: "9th day",
  },
  {
    id: 10410,
    category: "Dates",
    japanese: "十日",
    romaji: "tooka",
    meaning: "10th day",
  },
  {
    id: 10411,
    category: "Dates",
    japanese: "十四日",
    romaji: "juuyokka",
    meaning: "14th day",
  },
  {
    id: 10412,
    category: "Dates",
    japanese: "二十日",
    romaji: "hatsuka",
    meaning: "20th day",
  },
  {
    id: 10413,
    category: "Dates",
    japanese: "二十四日",
    romaji: "nijuuyokka",
    meaning: "24th day",
  },
];

/* =========================================================
   MONEY
   ========================================================= */

export const money: NumberItem[] = [
  {
    id: 10501,
    category: "Money",
    japanese: "一円",
    romaji: "ichien",
    meaning: "¥1",
  },
  {
    id: 10502,
    category: "Money",
    japanese: "百円",
    romaji: "hyakuen",
    meaning: "¥100",
  },
  {
    id: 10503,
    category: "Money",
    japanese: "五百円",
    romaji: "gohyaku-en",
    meaning: "¥500",
  },
  {
    id: 10504,
    category: "Money",
    japanese: "千円",
    romaji: "sen-en",
    meaning: "¥1,000",
  },
  {
    id: 10505,
    category: "Money",
    japanese: "五千円",
    romaji: "gosen-en",
    meaning: "¥5,000",
  },
  {
    id: 10506,
    category: "Money",
    japanese: "一万円",
    romaji: "ichiman-en",
    meaning: "¥10,000",
  },
];

/* =========================================================
   ALL NUMBER DATA
   ========================================================= */

export const allNumberData: NumberItem[] = [
  ...numbers,
  ...timeExpressions,
  ...days,
  ...months,
  ...dates,
  ...money,
];

/* =========================================================
   HELPERS
   ========================================================= */

export function getNumbersByCategory(
  category: NumberCategory,
): NumberItem[] {
  return allNumberData.filter(
    (item) => item.category === category,
  );
}

export function getNumberById(
  id: number,
): NumberItem | undefined {
  return allNumberData.find(
    (item) => item.id === id,
  );
}