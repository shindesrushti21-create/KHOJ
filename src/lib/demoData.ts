// Fictional demo data only. Dates are relative to today so the demo stays current.
const daysAgo=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)};
export type Symptom={code:string;severity:0|1|2|3;duration:string};
const e=(id:string,ago:number,flow:string|undefined,symptoms:Symptom[],notes='')=>({id,recordedAt:daysAgo(ago),lifeStage:'menstrual',flow,symptoms,notes});
export const DEMO_PROFILE={displayName:'Priya',language:'en',lifeStage:'menstrual',ageRange:'25-29',cycleLength:28,lastPeriod:daysAgo(22),discreetMode:false};
export const DEMO_CONSENTS={saveData:true,aiExplain:true,sharePassport:true};
export const DEMO_CYCLES=[{id:'c1',startDate:daysAgo(108),endDate:daysAgo(103),flow:'moderate',pain:1},{id:'c2',startDate:daysAgo(79),endDate:daysAgo(73),flow:'heavy',pain:2},{id:'c3',startDate:daysAgo(50),endDate:daysAgo(44),flow:'heavy',pain:2},{id:'c4',startDate:daysAgo(22),endDate:daysAgo(16),flow:'heavy',pain:2}];
export const DEMO_CHECKINS=[
e('d01',107,'moderate',[{code:'cramps',severity:1,duration:'today'}]),e('d02',100,'light',[{code:'fatigue',severity:1,duration:'few_days'}]),
e('d03',78,'heavy',[{code:'heavy_bleeding',severity:2,duration:'today'},{code:'fatigue',severity:2,duration:'few_days'}]),e('d04',75,'heavy',[{code:'heavy_bleeding',severity:2,duration:'few_days'},{code:'cramps',severity:2,duration:'today'}]),e('d05',66,'light',[{code:'fatigue',severity:2,duration:'1_2_weeks'},{code:'hair_fall',severity:1,duration:'1_2_weeks'}]),
e('d06',49,'heavy',[{code:'heavy_bleeding',severity:2,duration:'today'},{code:'dizziness',severity:1,duration:'today'}]),e('d07',46,'heavy',[{code:'heavy_bleeding',severity:3,duration:'few_days'},{code:'fatigue',severity:2,duration:'few_days'}]),e('d08',38,'light',[{code:'fatigue',severity:2,duration:'1_2_weeks'},{code:'hair_fall',severity:1,duration:'1_2_weeks'}]),
e('d09',21,'heavy',[{code:'heavy_bleeding',severity:2,duration:'today'},{code:'fatigue',severity:2,duration:'few_days'}]),e('d10',19,'heavy',[{code:'heavy_bleeding',severity:2,duration:'few_days'},{code:'fatigue',severity:2,duration:'few_days'},{code:'dizziness',severity:1,duration:'today'}]),e('d11',17,'moderate',[{code:'fatigue',severity:2,duration:'few_days'}]),e('d12',14,'light',[{code:'fatigue',severity:2,duration:'1_2_weeks'},{code:'hair_fall',severity:1,duration:'1_2_weeks'}]),e('d13',12,undefined,[{code:'fatigue',severity:2,duration:'1_2_weeks'}]),e('d14',9,undefined,[{code:'fatigue',severity:2,duration:'1_2_weeks'},{code:'dizziness',severity:1,duration:'today'}]),e('d15',6,undefined,[{code:'fatigue',severity:2,duration:'on_and_off'}]),e('d16',4,undefined,[{code:'fatigue',severity:2,duration:'on_and_off'}]),e('d17',2,undefined,[{code:'fatigue',severity:2,duration:'on_and_off'}],'Tired even after sleeping.')
];
export const DEMO_FOLLOWUPS=[{id:'f1',text:'Book an appointment to discuss recurring fatigue and heavy periods',dueDate:daysAgo(-7),done:false},{id:'f2',text:'Write down questions for the doctor',dueDate:daysAgo(-3),done:false}];
export const DEMO_MEDICATIONS=['Ibuprofen (as needed for cramps)'];
export const DEMO_DIARY_ENTRIES=[
  {id:'diary-demo-1',date:daysAgo(2),title:'A quieter evening',text:'I made room to rest when my energy felt low. A warm drink and a slower pace helped me feel more settled.',mood:'tired' as const,shareToPassport:false},
  {id:'diary-demo-2',date:daysAgo(5),title:'What I noticed',text:'My energy shifted through the day. I want to remember to mention the pattern at my next appointment.',mood:'hopeful' as const,shareToPassport:false},
  {id:'diary-demo-3',date:daysAgo(9),title:'A small check-in with myself',text:'I took a short pause and noticed I was carrying some worry. Writing it down made it easier to name.',mood:'anxious' as const,shareToPassport:false}
];
