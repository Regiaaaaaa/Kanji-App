import { shuffleArray } from "../data/kanjiData";

const STORAGE_KEY = "kanji-srs-v1";
// Interval (hari) tiap tingkat: naik satu tingkat setiap kali dijawab "Normal"
const INTERVALS = [1, 3, 7, 14, 30];

// Kunci unik per kartu: kanji + hiragana (aman untuk 開きます / ～中 yang kembar)
export const cardKey = (card) => `${card.kanji}|${card.hiragana}`;

const pad = (n) => String(n).padStart(2, "0");
const formatDate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayStr = () => formatDate(new Date());

const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return formatDate(new Date(y, m - 1, d + n));
};

export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage penuh / diblokir: abaikan, sesi tetap jalan
  }
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
};

/**
 * rating: "again" (Tidak hafal) | "hard" (Sulit) | "good" (Normal)
 *
 * - again : reset ke tingkat awal, muncul lagi besok
 * - hard  : turun satu tingkat, muncul sesuai interval tingkat itu (minimal 1 hari)
 * - good  : naik satu tingkat (1 -> 3 -> 7 -> 14 -> 30 hari)
 */
export const applyRating = (entry, rating) => {
  const prev = entry ?? { step: 0, due: null, lapses: 0 };
  const today = todayStr();
  const last = INTERVALS.length - 1;

  if (rating === "good") {
    const interval = INTERVALS[Math.min(prev.step, last)];
    return { ...prev, step: prev.step + 1, due: addDays(today, interval) };
  }

  if (rating === "hard") {
    const step = Math.max(0, Math.min(prev.step, last + 1) - 1);
    const interval = INTERVALS[Math.min(step, last)];
    return { ...prev, step, due: addDays(today, interval) };
  }

  // again
  return { step: 0, due: addDays(today, 1), lapses: (prev.lapses ?? 0) + 1 };
};

// Hilangkan kartu kembar antar bab (mis. 私 di bab 1 dan 11)
export const dedupeCards = (cards) => {
  const map = new Map();
  cards.forEach((c) => {
    const k = cardKey(c);
    if (!map.has(k)) map.set(k, c);
  });
  return [...map.values()];
};

/**
 * Urutan: jatuh tempo (yang paling sering sulit di depan) -> kartu baru -> belum jatuh tempo.
 * Semua kartu tetap ada, hanya urutannya yang berbeda.
 */
export const buildQueue = (cards, progress) => {
  const today = todayStr();
  const unique = dedupeCards(cards);

  const due = [];
  const fresh = [];
  const later = [];

  unique.forEach((c) => {
    const entry = progress[cardKey(c)];
    if (!entry || !entry.due) fresh.push(c);
    else if (entry.due <= today) due.push(c);
    else later.push(c);
  });

  const lapses = (c) => progress[cardKey(c)]?.lapses ?? 0;
  const dueSorted = shuffleArray(due).sort((a, b) => lapses(b) - lapses(a));

  return [...dueSorted, ...shuffleArray(fresh), ...shuffleArray(later)];
};

export const countDue = (cards, progress) => {
  const today = todayStr();
  return dedupeCards(cards).filter((c) => {
    const e = progress[cardKey(c)];
    return e && e.due && e.due <= today;
  }).length;
};