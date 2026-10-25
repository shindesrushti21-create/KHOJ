import { useState, type KeyboardEvent } from 'react';
import { ArrowRight, Heart, ShieldAlert, PenLine } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SELF_CARE_CONTENT, type SelfCareLocale } from '../content/selfCare';
import { TELE_MANAS_NUMBER } from '../lib/config';
import { hasFictionalDemoData, type KhojStore } from '../lib/api';
import DiaryPanel from './DiaryPanel';
import { EmptyState } from './PageStates';
import '../selfCare.css';
import '../moreSheet.css';

type Props = { store: KhojStore; patternExists: boolean; onSave: (store: KhojStore) => void };
const tabs = ['eating', 'rest', 'comfort', 'diary', 'seek'] as const;

export default function SelfCarePage({ store, patternExists, onSave }: Props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<(typeof tabs)[number]>('eating');
  const [saved, setSaved] = useState(false);
  const locale: SelfCareLocale = i18n.language.startsWith('hi') ? 'hi' : i18n.language.startsWith('mr') ? 'mr' : 'en';
  const diaryRoute = location.pathname === '/self-care/diary';
  const activeTab = diaryRoute ? 'diary' : active;
  const cards = activeTab !== 'diary' ? SELF_CARE_CONTENT[locale][activeTab] : [];
  const selectTab = (key: (typeof tabs)[number]) => {
    setSaved(false);
    if (key === 'diary') { navigate('/self-care/diary'); return; }
    setActive(key);
    navigate('/self-care');
  };

  const saveQuestion = (question: string) => {
    const questions = store.passportQuestions || [];
    if (!questions.includes(question)) onSave({ ...store, passportQuestions: [...questions, question] });
    setSaved(true);
  };
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = tabs.indexOf(activeTab);
    const next = event.key === 'ArrowRight' ? (current + 1) % tabs.length : event.key === 'ArrowLeft' ? (current + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setSaved(false);
    selectTab(tabs[next]);
    document.getElementById(`self-care-tab-${tabs[next]}`)?.focus();
  };

  return <div className="self-care-page">
    <header className="card self-care-header">
      <div><p className="eyebrow">{t('selfCareEyebrow')}</p><h2>{t('selfCareTitle')}</h2><p>{t('selfCareIntro')}</p></div>
      <img src="/images/calm.png" alt={t('calmIllustrationAlt')} width="144" height="144" loading="lazy" decoding="async" className="rounded-2xl self-care-illustration" />
    </header>

    {!diaryRoute && patternExists && <section className="card self-care-related"><div>{hasFictionalDemoData(store)&&<p className="eyebrow">{t('sampleInsightFictional')}</p>}<p className="eyebrow">{t('selfCareRelated')}</p><h2>{t('selfCarePatternTitle')}</h2><p>{t('selfCarePatternText')}</p><p className="muted">{t('selfCareIronCaution')}</p></div><button type="button" className="button secondary" onClick={() => selectTab('eating')}>{t('selfCareEatingTab')} <ArrowRight size={16}/></button></section>}

    {!diaryRoute && <Link className="card diary-landing-link" to="/self-care/diary" onClick={() => setSaved(false)}><span className="diary-landing-icon"><PenLine size={18}/></span><span><strong>{t('diaryLandingTitle')}</strong><small>{t('diaryLandingBody')}</small></span><ArrowRight size={17}/></Link>}

    <div className="self-care-tabs" role="tablist" aria-label={t('selfCareSections')}>
      {tabs.map(key => <button key={key} id={`self-care-tab-${key}`} type="button" role="tab" tabIndex={activeTab === key ? 0 : -1} aria-selected={activeTab === key} aria-controls="self-care-panel" onKeyDown={handleTabKeyDown} onClick={() => selectTab(key)}>{t(key === 'diary' ? 'diaryTab' : `selfCare${key[0].toUpperCase()}${key.slice(1)}Tab`)}</button>)}
    </div>

    <section id="self-care-panel" className="self-care-cards" role="tabpanel" aria-labelledby={`self-care-tab-${activeTab}`}>
      {activeTab === 'diary' ? <DiaryPanel checkins={store.checkins}/> : cards.length ? cards.map((card, index) => <article className="card self-care-card" key={`${activeTab}-${index}`}>
        <h2>{card.title}</h2>
        {card.intro && <p>{card.intro}</p>}
        <ul>{card.points.map(point => <li key={point}>{point}</li>)}</ul>
        {card.question && <div className="self-care-question"><p>{card.question}</p><button type="button" className="button secondary" onClick={() => saveQuestion(card.question!)}><Heart size={16}/>{t(saved ? 'selfCareQuestionSaved' : 'selfCareSaveQuestion')}</button></div>}
        <p className="self-care-disclaimer">{card.disclaimer}</p>
      </article>) : <EmptyState icon={Heart} title={t('selfCareTitle')} description={t('selfCareIntro')}/>} 
    </section>

    {activeTab === 'seek' && <><div className="self-care-care-links"><Link className="button primary" to="/care">{t('selfCareFindCare')} <ArrowRight size={16}/></Link><Link className="button secondary" to="/checkin"><ShieldAlert size={16}/>{t('selfCareSafetyFlow')}</Link></div><section className="card self-care-support"><h2>{t('selfCareEmotionalSupport')}</h2><p>{t('selfCareTelemanas', { number: TELE_MANAS_NUMBER })}</p></section></>}
  </div>;
}
