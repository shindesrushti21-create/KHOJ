import { beforeEach, describe, expect, it } from 'vitest';
import { LocalDemoAuthProvider } from './localAuth';
import { diaryStorageKey, writeDiaryData } from '../diaryStorage';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
const memory = new MemoryStorage();

describe('local demo authentication', () => {
  beforeEach(() => { (globalThis as any).localStorage = memory; memory.clear(); });
  it('stores only a salted password hash and can authenticate the account', async () => {
    const auth = new LocalDemoAuthProvider();
    const user = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    const rawUserData = memory.getItem('khoj_users') || '';
    expect(rawUserData).not.toContain('long-demo-pass1');
    expect(rawUserData).toContain('salt');
    await auth.signOut();
    expect((await auth.signIn('asha@example.test', 'long-demo-pass1')).id).toBe(user.id);
    await expect(auth.signIn('asha@example.test', 'wrong-password')).rejects.toThrow('INVALID_CREDENTIALS');
  });
  it('deletes the signed-in account and its user namespace', async () => {
    const auth = new LocalDemoAuthProvider();
    await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    const session = await auth.getSession();
    memory.setItem(`khoj.data.${session!.user.id}`, '{"checkins":[]}');
    memory.setItem(`khoj.safety.${session!.user.id}`, '{"redFlag":true}');
    writeDiaryData({ entries: [{ id: 'entry-1', date: '2026-10-25', title: '', text: 'private diary', mood: '' }] });
    await auth.deleteAccount();
    expect(memory.getItem(`khoj.data.${session!.user.id}`)).toBeNull();
    expect(memory.getItem(`khoj.safety.${session!.user.id}`)).toBeNull();
    expect(memory.getItem(diaryStorageKey(session!.user.id))).toBeNull();
    expect(memory.getItem('khoj_session')).toBeNull();
    expect(memory.getItem('khoj_users')).toBe('[]');
  });
  it('keeps independent user data namespaces and restores a session after refresh', async () => {
    const auth = new LocalDemoAuthProvider();
    const { api } = await import('../api');
    const first = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    api.persist({ ...api.store(), passportNote: 'first account data' });
    await auth.signOut();
    const second = await auth.signUp('Mira', 'mira@example.test', 'another-pass2');
    expect(api.store().passportNote).toBeUndefined();
    api.persist({ ...api.store(), passportNote: 'second account data' });
    await auth.signOut();
    await auth.signIn('asha@example.test', 'long-demo-pass1');
    expect((await new LocalDemoAuthProvider().getSession())?.user.id).toBe(first.id);
    expect(api.store().passportNote).toBe('first account data');
    await auth.signOut();
    await auth.signIn('mira@example.test', 'another-pass2');
    expect(api.store().passportNote).toBe('second account data');
    expect(api.store().passportNote).not.toBe('first account data');
  });
  it('signs into the fictional guest demo identity', async () => {
    const auth = new LocalDemoAuthProvider();
    const guest = await auth.signInAsGuest();
    expect(guest).toMatchObject({ id: 'guest-demo', name: 'Priya', isGuest: true });
    expect((await auth.getSession())?.user.id).toBe('guest-demo');
    const { api } = await import('../api');
    expect(api.loadDemoData().profile?.displayName).toBe('Priya');
    expect(api.store().demoLoaded).toBe(true);
  });
  it('keeps fictional demo records out of a registered account namespace', async () => {
    const auth = new LocalDemoAuthProvider();
    const { api } = await import('../api');
    const user = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    api.persist({ ...api.store(), passportNote: 'private account data' });
    expect(() => api.loadDemoData()).toThrow('DEMO_NAMESPACE_ONLY');
    expect(api.store().passportNote).toBe('private account data');
    expect(memory.getItem('khoj.data.guest-demo')).toBeNull();
    expect(memory.getItem(`khoj.data.${user.id}`)).not.toBeNull();
  });
  it('removes old demo-marked records if they are found in a registered account namespace', async () => {
    const auth = new LocalDemoAuthProvider();
    const { api } = await import('../api');
    const user = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    api.persist({ ...api.store(), demoLoaded: true });
    expect(api.store().checkins).toHaveLength(0);
    expect(memory.getItem(`khoj.data.${user.id}`)).toBeNull();
  });
  it('sign out clears only the session', async () => {
    const auth = new LocalDemoAuthProvider();
    const user = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    memory.setItem(`khoj.data.${user.id}`, '{"checkins":[]}');
    await auth.signOut();
    expect(await auth.getSession()).toBeNull();
    expect(memory.getItem(`khoj.data.${user.id}`)).not.toBeNull();
  });
  it('delete account removes stored safety state too', async () => {
    const auth = new LocalDemoAuthProvider();
    const user = await auth.signUp('Asha', 'asha@example.test', 'long-demo-pass1');
    memory.setItem(`khoj.safety.${user.id}`, '{"redFlag":true}');
    await auth.deleteAccount();
    expect(memory.getItem(`khoj.safety.${user.id}`)).toBeNull();
  });
});
