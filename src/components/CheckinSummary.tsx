import { useEffect, useRef } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DemoCheckin } from '../lib/api';
import type { PatternResult } from '../lib/patternEngine';
import type { SafetyResult } from '../safety';
import { InsufficientData } from './PageStates';

export default function CheckinSummary({ entry, pattern, safety, isDemo = false }: { entry: DemoCheckin | null; pattern: PatternResult | null; safety: SafetyResult; isDemo?: boolean }) {
  const { t, i18n } = useTranslation();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [entry?.id]);
  if (!entry) return <section className="card"><InsufficientData/></section>;
  const severity = Math.max(0, ...entry.symptoms.map(item => item.severity));
  const duration = entry.symptoms[0]?.duration || 'today';
  const careUrl = pattern ? `/care?pattern=${encodeURIComponent(pattern.id)}` : '/care';
  const selfCareUrl = pattern ? `/self-care?pattern=${encodeURIComponent(pattern.id)}` : '/self-care';
  const safetyLabel = safety.level === 'routine' ? t('safetyRoutine') : t(`safetyLevel_${safety.level}`);
  return <div className="checkin-summary">
    <header className="card checkin-summary-heading"><div className="summary-check-icon"><Check size={18}/></div><p className="eyebrow">{t('checkinSummaryEyebrow')}</p><h2 ref={heading} tabIndex={-1}>{t('checkinSummaryTitle')}</h2><p>{new Date(`${entry.recordedAt}T12:00:00`).toLocaleDateString(i18n.language,{weekday:'long',month:'long',day:'numeric'})}</p></header>
    <section className="card summary-section"><p className="eyebrow">{t('whatYouShared')}</p><h3>{t('selectedSymptoms')}</h3>{entry.symptoms.length?<ul className="summary-symptoms">{entry.symptoms.map(item=><li key={item.code}><span>{t(`symptoms.${item.code}`)}</span><small>{t('severity_'+item.severity)} · {t(`duration_${item.duration}`)}</small></li>)}</ul>:<p className="muted">{t('noSymptomsShared')}</p>}<p className="summary-severity">{t('summarySeverity')}: <strong>{t('severity_'+severity)}</strong></p></section>
    <section className="card summary-section"><p className="eyebrow">{t('safetyCheck')}</p><h3>{t('safetyCheckTitle')}</h3><span className={`safety-level-badge safety-${safety.level}`}><ShieldCheck size={15}/>{safetyLabel}</span><p className="muted">{t(safety.redFlag?'summarySafetyNeedsCare':'summarySafetyRoutine')}</p></section>
    <section className="card summary-section">{isDemo&&<p className="eyebrow">{t('sampleInsightFictional')}</p>}<p className="eyebrow">{t('patternSection')}</p><h3>{t('whatMightConnect')}</h3>{pattern?<><p>{pattern.title}</p><Link className="text-link" to={`/threads?pattern=${encodeURIComponent(pattern.id)}`}>{t('whyAmISeeingThis')} <ArrowRight size={15}/></Link></>:<InsufficientData/>}</section>
    <section className="card summary-section summary-next"><p className="eyebrow">{t('yourNextStep')}</p><h3>{t('chooseWhatHelps')}</h3><div className="button-row"><Link className="button secondary" to="/threads">{t('seeThreads')} <ArrowRight size={15}/></Link><Link className="button secondary" to={careUrl}>{t('findCare')} <ArrowRight size={15}/></Link><Link className="button secondary" to={selfCareUrl}><Sparkles size={15}/>{t('selfCareIdeas')}</Link><Link className="button primary" to="/passport">{t('addToPassport')} <ArrowRight size={15}/></Link></div></section>
  </div>;
}
