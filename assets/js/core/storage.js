/**
 * NihonHan - Storage Module
 * Wrapper for localStorage with JSON support and prefixing.
 */
const Storage = (() => {
  const PREFIX = 'nh_';

  function key(k) { return PREFIX + k; }

  function set(k, value) {
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[Storage] set error:', e);
      return false;
    }
  }

  function get(k, defaultValue = null) {
    try {
      const item = localStorage.getItem(key(k));
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      return defaultValue;
    }
  }

  function remove(k) {
    try { localStorage.removeItem(key(k)); } catch (e) {}
  }

  function has(k) {
    return localStorage.getItem(key(k)) !== null;
  }

  // User-scoped helpers
  function userKey(userId, section) { return `user_${userId}_${section}`; }

  function getUser(userId, section, def = null) {
    return get(userKey(userId, section), def);
  }

  function setUser(userId, section, value) {
    return set(userKey(userId, section), value);
  }

  function mergeUser(userId, section, patch) {
    const current = getUser(userId, section, {});
    return setUser(userId, section, { ...current, ...patch });
  }

  return { set, get, remove, has, getUser, setUser, mergeUser };
})();

window.Storage = Storage;
