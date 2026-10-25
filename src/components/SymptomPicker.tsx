import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import type { SymptomDefinition } from '../lib/symptoms';
import '../symptomPicker.css';

const groups: SymptomDefinition['group'][] = ['period', 'energy_body', 'skin_hair', 'mood', 'pregnancy_postpartum'];

export default function SymptomPicker({ symptoms, query, selected, onToggle }: { symptoms: SymptomDefinition[]; query: string; selected: string[]; onToggle: (code: string) => void }) {
  const { t, i18n } = useTranslation();
  const matches = (code: string) => t(`symptoms.${code}`).toLocaleLowerCase(i18n.language).includes(query.trim().toLocaleLowerCase(i18n.language));
  return <div className="symptom-groups">
    {groups.map(group => {
      const groupSymptoms = symptoms.filter(symptom => symptom.group === group && matches(symptom.code));
      if (!groupSymptoms.length) return null;
      return <section className="symptom-category" key={group} aria-labelledby={`symptom-category-${group}`}>
        <h3 id={`symptom-category-${group}`} className="symptom-category-title">{t(`symptomCategory.${group}`)}</h3>
        <div className="symptom-grid">{groupSymptoms.map(symptom => <button type="button" key={symptom.code} aria-pressed={selected.includes(symptom.code)} onClick={() => onToggle(symptom.code)} className={'symptom-chip '+(selected.includes(symptom.code)?'chosen':'')}>{selected.includes(symptom.code)&&<Check size={15}/>} {t(`symptoms.${symptom.code}`)}</button>)}</div>
      </section>;
    })}
  </div>;
}
