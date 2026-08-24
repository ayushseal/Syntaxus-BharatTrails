// Client-side IndexedDB wrapper for offline packs

const DB_NAME = "syntaxus_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "monastery_packs";

export interface StoredPack {
  id: string;
  name: string;
  district: string;
  size: string;
  downloadedAt: string;
  data: any;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMonasteryPack(pack: StoredPack): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(pack);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getSavedPacks(): Promise<StoredPack[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeMonasteryPack(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getStorageEstimate(): Promise<{ usedMB: number; quotaMB: number }> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usedMB = Math.round((estimate.usage || 0) / (1024 * 1024));
      const quotaMB = Math.round((estimate.quota || 0) / (1024 * 1024));
      return { usedMB, quotaMB };
    } catch {
      // fallback
    }
  }
  return { usedMB: 45, quotaMB: 500 };
}
