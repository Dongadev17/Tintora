// --- IndexedDB Wrapper ---
const PaletteDB = (() => {
  const DB_NAME = "ColorExtractorDB";
  const STORE_NAME = "palettes";
  const VERSION = 1;

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);

      req.onerror = () => reject(req.error);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      req.onsuccess = () => resolve(req.result);
    });

    return dbPromise;
  }

  return {
    async save(id, data) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put({ id, data });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    },

    async get(id) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).get(id);
        req.onsuccess = () => resolve(req.result?.data || null);
        req.onerror = () => reject(req.error);
      });
    },

    async delete(id) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    },

    async getAll() {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () =>
          resolve((req.result || []).map((item) => item.data));
        req.onerror = () => reject(req.error);
      });
    },
  };
})();
