import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, LockKeyhole, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DemoCheckin } from '../lib/api';
import { DIARY_SELF_HARM_KEYWORDS, TELE_MANAS_NUMBER } from '../lib/config';
import { clearDiaryData, readDiaryData, writeDiaryData, type DiaryData, type DiaryDraft, type DiaryEntry, type DiaryMood } from '../lib/diaryStorage';
import '../diary.css';
import { EmptyState } from './PageStates';

const moods: DiaryMood[] = ['calm', 'okay', 'low', 'anxious', 'tired', 'hopeful'];
const todayISO = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; };
const blankDraft = (): DiaryDraft => ({ date: todayISO(), title: '', text: '', mood: '' });
const hasContent = (draft: DiaryDraft) => Boolean(draft.title.trim() || draft.text.trim() || draft.mood);
const containsSafetyWords = (value: string) => {
  const normalized = value.toLocaleLowerCase().replace(/[‐‑‒–—]/g, '-');
  return DIARY_SELF_HARM_KEYWORDS.some(keyword => normalized.includes(keyword.toLocaleLowerCase()));
};
const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value));
const decode = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));
async function pinHash(pin: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' }, key, 256);
  return new Uint8Array(bits);
}
function sameBytes(a: Uint8Array, b: Uint8Array) { return a.length === b.length && a.every((value, index) => value === b[index]); }

export default function DiaryPanel({ checkins }: { checkins: DemoCheckin[] }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DiaryData>(() => readDiaryData());
  const [unlocked, setUnlocked] = useState(() => !readDiaryData().pin);
  const [draft, setDraft] = useState<DiaryDraft>(() => readDiaryData().draft || blankDraft());
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState<DiaryMood | ''>('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [pinSetup, setPinSetup] = useState(false);
  const [forgotPin, setForgotPin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinWorking, setPinWorking] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const todayCheckin = checkins.find(entry => entry.recordedAt === todayISO());

  const commit = (next: DiaryData) => { setData(next); writeDiaryData(next); };
  const updateDraft = (next: DiaryDraft) => {
    setDraft(next);
    commit({ ...data, draft: hasContent(next) ? next : undefined });
    setBannerDismissed(false);
    setPinError('');
  };
  useEffect(() => {
    if (data.pin && !unlocked) return;
    if (data.draft && !editing) setDraft(data.draft);
  }, [data.draft, data.pin, editing, unlocked]);

  const currentText = editing ? `${draft.title}\n${draft.text}` : selectedEntry ? `${selectedEntry.title}\n${selectedEntry.text}` : '';
  const showSafetyBanner = !bannerDismissed && containsSafetyWords(currentText);
  const visibleEntries = useMemo(() => data.entries.filter(entry => {
    const query = search.trim().toLocaleLowerCase();
    return (!query || `${entry.title} ${entry.text}`.toLocaleLowerCase().includes(query)) &&
      (!moodFilter || entry.mood === moodFilter) && (!dateFilter || entry.date === dateFilter);
  }).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)), [data.entries, dateFilter, moodFilter, search]);

  const openWriter = () => {
    const savedDraft = data.draft;
    if (savedDraft?.entryId) {
      setDraft(savedDraft);
      setSelectedEntry(null);
    } else {
      setDraft(savedDraft || blankDraft());
      setSelectedEntry(null);
    }
    setBannerDismissed(false);
    setEditing(true);
  };
  const editEntry = (entry: DiaryEntry) => {
    setSelectedEntry(null);
    const next: DiaryDraft = { ...entry, entryId: entry.id };
    setDraft(next);
    commit({ ...data, draft: next });
    setEditing(true);
    setBannerDismissed(false);
  };
  const saveEntry = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.text.trim()) { setPinError(t('diaryTextRequired')); return; }
    const entry: DiaryEntry = { id: draft.entryId || crypto.randomUUID(), date: draft.date || todayISO(), title: draft.title.trim(), text: draft.text.trim(), mood: draft.mood, linkedCheckinId: draft.linkedCheckinId, shareToPassport: Boolean(draft.shareToPassport) };
    const entries = draft.entryId ? data.entries.map(item => item.id === draft.entryId ? entry : item) : [entry, ...data.entries];
    commit({ ...data, entries, draft: undefined });
    setDraft(blankDraft());
    setPinError('');
    setEditing(false);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    commit({ ...data, entries: data.entries.filter(entry => entry.id !== deleteTarget), draft: data.draft?.entryId === deleteTarget ? undefined : data.draft });
    if (selectedEntry?.id === deleteTarget) setSelectedEntry(null);
    setDeleteTarget(null);
  };
  const unlockDiary = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{4}$/.test(pin) || !data.pin) { setPinError(t('diaryPinInvalid')); return; }
    setPinWorking(true);
    try {
      const matched = sameBytes(await pinHash(pin, decode(data.pin.salt)), decode(data.pin.hash));
      if (!matched) { setPinError(t('diaryPinIncorrect')); return; }
      setUnlocked(true); setPin(''); setPinError('');
    } catch { setPinError(t('diaryPinError')); }
    finally { setPinWorking(false); }
  };
  const setConveniencePin = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{4}$/.test(pin)) { setPinError(t('diaryPinInvalid')); return; }
    if (pin !== pinConfirm) { setPinError(t('diaryPinMismatch')); return; }
    setPinWorking(true);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const hash = await pinHash(pin, salt);
      const next = { ...data, pin: { salt: encode(salt), hash: encode(hash) } };
      commit(next); setUnlocked(true); setPin(''); setPinConfirm(''); setPinSetup(false); setPinError('');
    } catch { setPinError(t('diaryPinError')); }
    finally { setPinWorking(false); }
  };
  const clearForgottenPin = () => {
    clearDiaryData();
    setData({ entries: [] }); setDraft(blankDraft()); setUnlocked(true); setEditing(false); setSelectedEntry(null); setForgotPin(false); setPin(''); setPinError('');
  };
  const dateLabel = (date: string) => new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(`${date}T12:00:00`));

  if (data.pin && !unlocked) return <section className="card diary-unlock"><div className="diary-privacy-line"><LockKeyhole size={16}/><span>{t('diaryOnlyYou')}</span></div><h2>{t('diaryLockedTitle')}</h2><p>{t('diaryConvenienceNotice')}</p><form onSubmit={unlockDiary}><label className="field-label" htmlFor="diary-unlock-pin">{t('diaryPinLabel')}</label><input id="diary-unlock-pin" className="diary-pin-input" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="one-time-code" value={pin} onChange={event => { setPin(event.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}/>{pinError && <p className="diary-error" role="alert">{pinError}</p>}<button className="button primary full" disabled={pinWorking}>{t(pinWorking ? 'diaryUnlocking' : 'diaryUnlock')}</button></form><button type="button" className="text-link" onClick={() => { setForgotPin(true); setPinError(''); }}>{t('diaryForgotPin')}</button></section>;

  return <section className="diary-area">
    <div className="diary-privacy-line"><LockKeyhole size={16}/><span>{t('diaryOnlyYou')}</span></div>
    <p className="diary-local-only">{t('diaryLocalOnly')}</p>
    <p className="diary-convenience-note">{t('diaryConvenienceNotice')}</p>
    {showSafetyBanner && <aside className="diary-safety-banner" role="status"><button type="button" className="diary-banner-close" onClick={() => setBannerDismissed(true)} aria-label={t('diaryDismissSafety')}>×</button><ShieldAlert/><p>{t('diarySafetyBanner', { number: TELE_MANAS_NUMBER })}</p><div><a href={`tel:${TELE_MANAS_NUMBER}`}>{t('selfCareTelemanas', { number: TELE_MANAS_NUMBER })}</a><a href="tel:112">{t('call112')} · 112</a></div></aside>}
    {!data.pin && <button type="button" className="diary-pin-toggle" onClick={() => { setPinSetup(true); setPinError(''); }}>{t('diarySetPin')}</button>}
    {data.pin && <p className="diary-pin-active">{t('diaryPinEnabled')}</p>}
    {!editing ? <>
      <div className="diary-heading"><div><h2>{t('diaryHeading')}</h2><p>{t('diaryPrompt')}</p><small className="diary-autosave-hint">{t('diaryDraftAutosave')}</small></div><button type="button" className="button primary" onClick={openWriter}>{t('diaryWriteToday')}</button></div>
      {selectedEntry && <article className="card diary-entry-detail"><button type="button" className="text-link" onClick={() => setSelectedEntry(null)}><ArrowLeft size={16}/>{t('diaryBackToEntries')}</button><p className="eyebrow">{dateLabel(selectedEntry.date)}</p>{selectedEntry.title && <h2>{selectedEntry.title}</h2>}<p className="diary-entry-text">{selectedEntry.text}</p>{selectedEntry.mood && <span className="diary-mood-pill">{t(`diaryMood_${selectedEntry.mood}`)}</span>}{selectedEntry.shareToPassport && <p className="diary-shared-note">{t('diaryIncludedInPassport')}</p>}<div className="diary-entry-actions"><button type="button" className="button secondary" onClick={() => editEntry(selectedEntry)}>{t('diaryEdit')}</button><button type="button" className="button danger" onClick={() => setDeleteTarget(selectedEntry.id)}><Trash2 size={16}/>{t('diaryDelete')}</button></div></article>}
      {!selectedEntry && <><div className="diary-filters"><label className="diary-search"><Search size={17}/><span className="visually-hidden">{t('diarySearch')}</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={t('diarySearch')}/></label><label className="field-label">{t('diaryFilterMood')}<select value={moodFilter} onChange={event => setMoodFilter(event.target.value as DiaryMood | '')}><option value="">{t('diaryAllMoods')}</option>{moods.map(mood => <option key={mood} value={mood}>{t(`diaryMood_${mood}`)}</option>)}</select></label><label className="field-label">{t('diaryFilterDate')}<input type="date" value={dateFilter} onChange={event => setDateFilter(event.target.value)}/></label></div>
        {visibleEntries.length ? <div className="diary-entry-list">{visibleEntries.map(entry => <article className="card diary-entry-card" key={entry.id}><button type="button" className="diary-entry-open" onClick={() => setSelectedEntry(entry)}><span className="eyebrow">{dateLabel(entry.date)}</span><strong>{entry.title || t('diaryUntitled')}</strong><span>{entry.text}</span>{entry.mood && <small>{t(`diaryMood_${entry.mood}`)}</small>}{entry.shareToPassport && <small>{t('diaryIncludedInPassport')}</small>}</button><button type="button" className="icon-button diary-delete-icon" onClick={() => setDeleteTarget(entry.id)} aria-label={t('diaryDeleteEntry',{date:dateLabel(entry.date)})}><Trash2 size={17}/></button></article>)}</div> : <section className="card diary-empty"><EmptyState icon={LockKeyhole} title={t(data.entries.length ? 'diaryNoResultsTitle' : 'diaryEmpty')} description={t(data.entries.length ? 'diaryNoResults' : 'diaryLocalOnly')} action={!data.entries.length ? <button type="button" className="button primary" onClick={openWriter}>{t('diaryWriteToday')}</button> : undefined}/></section>}
      </>}
    </> : <form className="card diary-editor" onSubmit={saveEntry}>
      <div className="diary-editor-heading"><div><p className="eyebrow">{dateLabel(draft.date || todayISO())}</p><h2>{t(draft.entryId ? 'diaryEditHeading' : 'diaryEditorHeading')}</h2></div><button type="button" className="text-link" onClick={() => { setEditing(false); setPinError(''); }}>{t('diaryCancel')}</button></div>
      <label className="field-label" htmlFor="diary-title">{t('diaryOptionalTitle')}<input id="diary-title" value={draft.title} onChange={event => updateDraft({ ...draft, title: event.target.value })} maxLength={100} /></label>
      <label className="field-label" htmlFor="diary-text">{t('diaryYourWords')}<textarea id="diary-text" rows={8} value={draft.text} onChange={event => updateDraft({ ...draft, text: event.target.value })} placeholder={t('diaryPrompt')} /></label>
      <fieldset className="diary-mood-field"><legend>{t('diaryMoodLabel')}</legend><div>{moods.map(mood => <button type="button" key={mood} aria-pressed={draft.mood === mood} className={draft.mood === mood ? 'selected' : ''} onClick={() => updateDraft({ ...draft, mood: draft.mood === mood ? '' : mood })}>{t(`diaryMood_${mood}`)}</button>)}</div></fieldset>
      {todayCheckin ? <label className="check-row diary-checkin-link"><input type="checkbox" checked={draft.linkedCheckinId === todayCheckin.id} onChange={event => updateDraft({ ...draft, linkedCheckinId: event.target.checked ? todayCheckin.id : undefined })}/><span>{t('diaryLinkCheckin')}</span></label> : <p className="diary-checkin-unavailable">{t('diaryNoTodayCheckin')}</p>}
      <label className="check-row diary-passport-optin"><input type="checkbox" checked={Boolean(draft.shareToPassport)} onChange={event => updateDraft({ ...draft, shareToPassport: event.target.checked })}/><span><strong>{t('diaryIncludePassport')}</strong><small>{t('diaryPassportOptInHint')}</small></span></label>
      {pinError && <p className="diary-error" role="alert">{pinError}</p>}
      <div className="diary-editor-actions"><button type="button" className="button secondary" onClick={() => { setEditing(false); setPinError(''); }}>{t('diaryCancel')}</button><button type="submit" className="button primary">{t('diarySaveEntry')}</button></div>
    </form>}

    {data.pin && <button type="button" className="text-link diary-forgot-link" onClick={() => { setForgotPin(true); setPinError(''); }}>{t('diaryForgotPin')}</button>}

    {pinSetup && <div className="diary-dialog-backdrop" role="presentation" onClick={() => setPinSetup(false)}><section className="card diary-dialog" role="dialog" aria-modal="true" aria-labelledby="diary-pin-dialog-title" onClick={event => event.stopPropagation()}><h2 id="diary-pin-dialog-title">{t('diarySetPin')}</h2><p>{t('diaryConvenienceNotice')}</p><form onSubmit={setConveniencePin}><label className="field-label" htmlFor="diary-new-pin">{t('diaryPinLabel')}<input id="diary-new-pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="new-password" value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, '').slice(0,4))}/></label><label className="field-label" htmlFor="diary-confirm-pin">{t('diaryConfirmPin')}<input id="diary-confirm-pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="new-password" value={pinConfirm} onChange={event => setPinConfirm(event.target.value.replace(/\D/g, '').slice(0,4))}/></label>{pinError && <p className="diary-error" role="alert">{pinError}</p>}<div className="diary-editor-actions"><button type="button" className="button secondary" onClick={() => setPinSetup(false)}>{t('diaryCancel')}</button><button type="submit" className="button primary" disabled={pinWorking}>{t('diarySavePin')}</button></div></form></section></div>}
    {forgotPin && <div className="diary-dialog-backdrop" role="presentation" onClick={() => setForgotPin(false)}><section className="card diary-dialog" role="dialog" aria-modal="true" aria-labelledby="diary-forgot-pin-title" onClick={event => event.stopPropagation()}><h2 id="diary-forgot-pin-title">{t('diaryForgotPin')}</h2><p>{t('diaryForgotPinConfirm')}</p><div className="diary-editor-actions"><button type="button" className="button secondary" onClick={() => setForgotPin(false)}>{t('diaryCancel')}</button><button type="button" className="button danger" onClick={clearForgottenPin}>{t('diaryClearAll')}</button></div></section></div>}
    {deleteTarget && <div className="diary-dialog-backdrop" role="presentation" onClick={() => setDeleteTarget(null)}><section className="card diary-dialog" role="dialog" aria-modal="true" aria-labelledby="diary-delete-title" onClick={event => event.stopPropagation()}><h2 id="diary-delete-title">{t('diaryDeleteConfirmTitle')}</h2><p>{t('diaryDeleteConfirmBody')}</p><div className="diary-editor-actions"><button type="button" className="button secondary" onClick={() => setDeleteTarget(null)}>{t('diaryCancel')}</button><button type="button" className="button danger" onClick={confirmDelete}>{t('diaryDelete')}</button></div></section></div>}
  </section>;
}
