import { describe, expect, it } from 'vitest';
import { evaluateSafety, readPersistedSafetyResult, persistSafetyResult, retainHighestSafetyResult } from '../safety';

describe('non-overridable safety rules', () => {
  it('flags fainting with heavy bleeding', () => expect(evaluateSafety({ symptoms: ['fainting', 'heavy_bleeding'] }).level).toBe('urgent'));
  it('flags self-harm thoughts at emergency urgency', () => expect(evaluateSafety({ symptoms: ['self_harm_thoughts'] }).level).toBe('emergency'));
  it('flags chest pain at emergency urgency', () => expect(evaluateSafety({ symptoms: ['chest_pain'] }).level).toBe('emergency'));
  it('flags severe pain, missed period, and dizziness together', () => expect(evaluateSafety({ symptoms: ['severe_pain', 'missed_period', 'dizziness'] }).level).toBe('urgent'));
  it('flags postpartum bleeding with fever', () => expect(evaluateSafety({ symptoms: ['heavy_bleeding', 'fever'], lifeStage: 'postpartum' }).level).toBe('urgent'));
  it('flags a breast lump', () => expect(evaluateSafety({ symptoms: ['breast_lump'] }).level).toBe('soon'));
  it('does not apply postpartum rules outside postpartum', () => expect(evaluateSafety({ symptoms: ['heavy_bleeding', 'fever'], lifeStage: 'menstrual' }).redFlag).toBe(false));
  it('keeps the most urgent match when conditions conflict', () => {
    const result = evaluateSafety({ symptoms: ['breast_lump', 'fainting', 'heavy_bleeding', 'self_harm_thoughts'] });
    expect(result.level).toBe('emergency');
    expect(result.matchedRuleIds).toHaveLength(3);
  });
  it('returns routine when no red flag rule matches', () => expect(evaluateSafety({ symptoms: ['fatigue'] }).level).toBe('routine'));
  it('returns a frozen result that cannot be mutated', () => {
    const result = evaluateSafety({ symptoms: ['self_harm_thoughts'] });
    expect(Object.isFrozen(result)).toBe(true);
    expect(Reflect.set(result as object, 'level', 'routine')).toBe(false);
    expect(result.level).toBe('emergency');
  });
  it('cannot lower an existing urgency', () => {
    const emergency = evaluateSafety({ symptoms: ['self_harm_thoughts'] });
    const routine = evaluateSafety({ symptoms: ['fatigue'] });
    expect(retainHighestSafetyResult(emergency, routine)).toBe(emergency);
  });
  it('restores a persisted overlay after refresh until explicitly cleared', () => {
    const memory = new Map<string, string>();
    (globalThis as any).localStorage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => memory.set(key, value), removeItem: (key: string) => memory.delete(key) };
    memory.set('khoj_session', JSON.stringify({ user: { id: 'safety-user' } }));
    persistSafetyResult(evaluateSafety({ symptoms: ['chest_pain'] }));
    expect(readPersistedSafetyResult()?.level).toBe('emergency');
    persistSafetyResult(null);
    expect(readPersistedSafetyResult()).toBeNull();
  });
});
