import { beforeEach, describe, expect, it } from 'vitest';
import { api } from './api';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
const memory = new MemoryStorage();

describe('account-scoped local data', () => {
  beforeEach(() => {
    (globalThis as any).localStorage = memory;
    for (const key of ['khoj_session', 'khoj.entries.v1', 'khoj.data.guest-demo', 'khoj.data.user-a', 'khoj.data.user-b', 'khoj.discreet']) memory.removeItem(key);
  });
  it('moves existing unscoped check-ins into the guest namespace', () => {
    memory.setItem('khoj.entries.v1', JSON.stringify([{ id: 'old', date: '2026-01-01', symptoms: ['fatigue'], severity: 1 }]));
    expect(api.store().checkins[0].id).toBe('old');
    expect(memory.getItem('khoj.data.guest-demo')).not.toBeNull();
    expect(memory.getItem('khoj.entries.v1')).toBeNull();
  });
  it('keeps account data separate when the active session changes', () => {
    memory.setItem('khoj_session', JSON.stringify({ user: { id: 'user-a' } }));
    api.persist({ ...api.store(), passportNote: 'A private note' });
    memory.setItem('khoj_session', JSON.stringify({ user: { id: 'user-b' } }));
    expect(api.store().passportNote).toBeUndefined();
    api.persist({ ...api.store(), passportNote: 'Another private note' });
    memory.setItem('khoj_session', JSON.stringify({ user: { id: 'user-a' } }));
    expect(api.store().passportNote).toBe('A private note');
  });
});
