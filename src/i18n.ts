import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';
const warnedMissingKeys=new Set<string>();
const englishFallback=(key:string)=>{
  let value:unknown=resources.en.translation;
  for(const part of key.split('.'))value=(value as Record<string,unknown>|undefined)?.[part];
  if(typeof value==='string')return value;
  return 'This text is not available yet.';
};
i18n.use(initReactI18next).init({
  resources,
  lng:localStorage.getItem('khoj-language')||'en',
  fallbackLng:false,
  saveMissing:import.meta.env.DEV,
  missingKeyHandler:(languages,namespace,key)=>{
    if(import.meta.env.DEV&&!warnedMissingKeys.has(key)){
      warnedMissingKeys.add(key);
      console.warn(`[i18n] Missing translation: ${namespace}:${key} (${languages.join(', ')})`);
    }
  },
  parseMissingKeyHandler:englishFallback,
  interpolation:{escapeValue:false}
});
export default i18n;
