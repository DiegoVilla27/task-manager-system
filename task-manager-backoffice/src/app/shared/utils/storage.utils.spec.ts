import { StorageUtils } from './storage.utils';

describe('StorageUtils', () => {
  beforeEach(() => {
    StorageUtils.clear();
  });

  afterEach(() => {
    StorageUtils.clear();
  });

  it('should store and retrieve string values', () => {
    StorageUtils.set('access_token', 'my-jwt-token');
    const token = StorageUtils.get<string>('access_token');
    expect(token).toBe('my-jwt-token');
  });

  it('should store and retrieve object values', () => {
    const user = { id: '1', name: 'Diego', email: 'diego@taskmanager.com' };
    StorageUtils.set('me', user);
    const retrieved = StorageUtils.get<typeof user>('me');
    expect(retrieved).toEqual(user);
  });

  it('should return null for non-existing keys', () => {
    expect(StorageUtils.get('access_token')).toBeNull();
  });

  it('should verify key existence using has', () => {
    expect(StorageUtils.has('access_token')).toBeFalse();
    StorageUtils.set('access_token', 'test');
    expect(StorageUtils.has('access_token')).toBeTrue();
  });

  it('should remove items correctly', () => {
    StorageUtils.set('access_token', 'test');
    StorageUtils.remove('access_token');
    expect(StorageUtils.has('access_token')).toBeFalse();
  });

  it('should clear all items in storage', () => {
    StorageUtils.set('access_token', 'token');
    StorageUtils.set('refresh_token', 'refresh');
    StorageUtils.clear();
    expect(StorageUtils.has('access_token')).toBeFalse();
    expect(StorageUtils.has('refresh_token')).toBeFalse();
  });
});
