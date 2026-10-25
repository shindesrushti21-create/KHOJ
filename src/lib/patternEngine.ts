import type {DemoCheckin,KhojStore} from './api';
export type PatternResult={id:string;title:string;evidenceStrength:'limited'|'moderate'|'stronger';evidence:{type:string;count:number;dates:string[];entryIds:string[]}[];missingInformation:string[];topicsToDiscuss:string[];notADiagnosis:true};
export function getIronPattern(store:KhojStore):PatternResult|null{
 const recentCycles=[...store.cycles].sort((a,b)=>b.startDate.localeCompare(a.startDate)).slice(0,3);
 const heavyCycles=recentCycles.filter(c=>c.flow==='heavy'||store.checkins.some(x=>x.flow==='heavy'&&x.recordedAt>=c.startDate&&x.recordedAt<=(c.endDate||new Date().toISOString().slice(0,10))));
 const since=new Date();since.setDate(since.getDate()-30);const cutoff=since.toISOString().slice(0,10);
 const fatigue=store.checkins.filter(x=>x.recordedAt>=cutoff&&x.symptoms.some(s=>s.code==='fatigue'&&s.severity>=2));
 if(heavyCycles.length<2||fatigue.length<7)return null;
 const evidence=[{type:'Heavy bleeding cycles',count:heavyCycles.length,dates:heavyCycles.map(c=>c.startDate),entryIds:heavyCycles.map(c=>c.id)},{type:'Fatigue (severity 2+)',count:fatigue.length,dates:fatigue.map(x=>x.recordedAt),entryIds:fatigue.map(x=>x.id)},...(['dizziness','hair_fall'] as const).map(code=>{const rows=store.checkins.filter(x=>x.symptoms.some(s=>s.code===code));return{type:code==='hair_fall'?'Hair fall':'Dizziness',count:rows.length,dates:rows.map(x=>x.recordedAt),entryIds:rows.map(x=>x.id)}})];
 return{id:'possible-iron-related-concern',title:'Possible iron-related concern, worth discussing with a clinician',evidenceStrength:heavyCycles.length>=3&&fatigue.length>=9?'moderate':'limited',evidence,missingInformation:['No blood test on record'],topicsToDiscuss:['Whether blood tests such as a blood count would be appropriate'],notADiagnosis:true};
}
