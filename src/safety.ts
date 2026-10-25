export type SafetyLevel='routine'|'soon'|'urgent'|'emergency';
export type SafetyInput={symptoms:string[];lifeStage?:string;severity?:number};
type RedFlagRule={id:string;all?:readonly string[];any?:readonly string[];lifeStage?:string;level:Exclude<SafetyLevel,'routine'>};
export type SafetyResult=Readonly<{redFlag:boolean;level:SafetyLevel;matchedRuleId?:string;matchedRuleIds:readonly string[];ruleVersion:'demo-0.1';aiCanOverride:false}>;
export const redFlagRules:readonly RedFlagRule[]=Object.freeze([
  Object.freeze({id:'demo-fainting-heavy',all:Object.freeze(['fainting','heavy_bleeding']),level:'urgent'}),
  Object.freeze({id:'demo-self-harm',all:Object.freeze(['self_harm_thoughts']),level:'emergency'}),
  Object.freeze({id:'demo-breast-lump',all:Object.freeze(['breast_lump']),level:'soon'}),
  Object.freeze({id:'demo-postpartum-fever',all:Object.freeze(['heavy_bleeding','fever']),lifeStage:'postpartum',level:'urgent'}),
  Object.freeze({id:'demo-pain-missed-dizzy',all:Object.freeze(['severe_pain','missed_period','dizziness']),level:'urgent'}),
  Object.freeze({id:'demo-chest-pain',any:Object.freeze(['chest_pain','breathlessness']),level:'emergency'})
]);
const rank:Record<SafetyLevel,number>={routine:0,soon:1,urgent:2,emergency:3};
function freezeResult(level:SafetyLevel,ids:string[]=[]):SafetyResult{
  const ordered=[...new Set(ids)];
  return Object.freeze({redFlag:level!=='routine',level,matchedRuleId:ordered[0],matchedRuleIds:Object.freeze(ordered),ruleVersion:'demo-0.1',aiCanOverride:false as const});
}
export function evaluateSafety(input:SafetyInput):SafetyResult{
  const symptoms=new Set(input.symptoms);
  const matched=redFlagRules.filter(rule=>(!rule.lifeStage||rule.lifeStage===input.lifeStage)&&(
    (rule.all?.every(code=>symptoms.has(code))??false)||(rule.any?.some(code=>symptoms.has(code))??false)
  ));
  const level=matched.reduce<SafetyLevel>((highest,rule)=>rank[rule.level]>rank[highest]?rule.level:highest,'routine');
  return freezeResult(level,matched.map(rule=>rule.id));
}
/** Safety decisions may stay the same or become more urgent, never less. */
export function retainHighestSafetyResult(previous:SafetyResult|null,next:SafetyResult):SafetyResult{
  if(previous&&rank[previous.level]>rank[next.level])return previous;
  if(previous&&previous.redFlag&&next.redFlag&&rank[previous.level]===rank[next.level])return freezeResult(next.level,[...previous.matchedRuleIds,...next.matchedRuleIds]);
  return next;
}
function activeUserId(){try{return JSON.parse(localStorage.getItem('khoj_session')||'null')?.user?.id||'guest-demo'}catch{return'guest-demo'}}
const keyFor=(id=activeUserId())=>`khoj.safety.${id}`;
export function persistSafetyResult(result:SafetyResult|null,userId=activeUserId()){
  try{if(result?.redFlag)localStorage.setItem(keyFor(userId),JSON.stringify(result));else localStorage.removeItem(keyFor(userId))}catch{/* session storage may be unavailable */}
}
export function readPersistedSafetyResult(userId=activeUserId()):SafetyResult|null{
  try{
    const raw=localStorage.getItem(keyFor(userId));if(!raw)return null;
    const saved=JSON.parse(raw) as Partial<SafetyResult>;
    if(!saved.redFlag||!saved.matchedRuleIds?.length)return null;
    const valid=redFlagRules.filter(rule=>saved.matchedRuleIds!.includes(rule.id));
    if(!valid.length)return null;
    const level=valid.reduce<SafetyLevel>((highest,rule)=>rank[rule.level]>rank[highest]?rule.level:highest,'routine');
    return freezeResult(level,valid.map(rule=>rule.id));
  }catch{return null}
}
