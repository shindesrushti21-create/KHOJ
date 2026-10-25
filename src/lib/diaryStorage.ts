export type DiaryMood = 'calm' | 'okay' | 'low' | 'anxious' | 'tired' | 'hopeful';
export type DiaryEntry = { id: string; date: string; title: string; text: string; mood: DiaryMood | ''; linkedCheckinId?: string; shareToPassport?: boolean };
export type DiaryDraft = Omit<DiaryEntry, 'id'> & { entryId?: string };
export type DiaryPin = { salt: string; hash: string };
export type DiaryData = { entries: DiaryEntry[]; draft?: DiaryDraft; pin?: DiaryPin };

function currentUserId() {
  try { return JSON.parse(localStorage.getItem('khoj_session') || 'null')?.user?.id || 'guest-demo'; }
  catch { return 'guest-demo'; }
}
export const diaryStorageKey = (userId = currentUserId()) => `khoj.diary.${userId}`;
export function readDiaryData(userId?: string): DiaryData {
  try {
    const raw = localStorage.getItem(diaryStorageKey(userId));
    if (!raw) return { entries: [] };
    const value = JSON.parse(raw);
    return { entries: Array.isArray(value.entries) ? value.entries : [], draft: value.draft, pin: value.pin };
  } catch { return { entries: [] }; }
}
export function writeDiaryData(data: DiaryData, userId?: string) {
  try { localStorage.setItem(diaryStorageKey(userId), JSON.stringify(data)); return true; }
  catch { return false; }
}
export function clearDiaryData(userId?: string) {
  try { localStorage.removeItem(diaryStorageKey(userId)); } catch { /* local storage may be unavailable */ }
}
export function exportDiaryData(userId?: string) {
  const { entries, draft } = readDiaryData(userId);
  return { entries, ...(draft ? { draft } : {}) };
}
