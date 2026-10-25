export type SymptomGroup='period'|'energy_body'|'skin_hair'|'mood'|'pregnancy_postpartum';
export type SymptomCode='heavy_bleeding'|'light_period'|'cramps'|'irregular_cycles'|'missed_period'|'fatigue'|'dizziness'|'fainting'|'headache'|'breathlessness'|'pallor'|'hair_fall'|'skin_changes'|'low_mood'|'anxiety'|'poor_sleep'|'breast_lump'|'breast_pain'|'pelvic_pain'|'nausea'|'appetite_changes';
export type SymptomDefinition={code:SymptomCode;group:SymptomGroup};
export const SYMPTOMS:SymptomDefinition[]=[
 {code:'heavy_bleeding',group:'period'},{code:'light_period',group:'period'},{code:'cramps',group:'period'},{code:'irregular_cycles',group:'period'},{code:'missed_period',group:'period'},{code:'pelvic_pain',group:'period'},
 {code:'fatigue',group:'energy_body'},{code:'dizziness',group:'energy_body'},{code:'fainting',group:'energy_body'},{code:'headache',group:'energy_body'},{code:'breathlessness',group:'energy_body'},{code:'pallor',group:'energy_body'},
 {code:'hair_fall',group:'skin_hair'},{code:'skin_changes',group:'skin_hair'},{code:'breast_lump',group:'skin_hair'},{code:'breast_pain',group:'skin_hair'},
 {code:'low_mood',group:'mood'},{code:'anxiety',group:'mood'},{code:'poor_sleep',group:'mood'},
 {code:'nausea',group:'pregnancy_postpartum'},{code:'appetite_changes',group:'pregnancy_postpartum'}
];
// Safety-sensitive mood disclosures are collected by the dedicated safety flow, never as a general symptom chip.
export const HIDDEN_SAFETY_SYMPTOMS=['self_harm_thoughts'] as const;
