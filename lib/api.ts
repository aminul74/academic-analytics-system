import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_MOCK_SERVER_URL ||
  "https://academic-analytics-system.netlify.app/db.json";
const IS_STATIC_JSON = BASE_URL.endsWith("db.json");
const LS_KEY = "mock_db";

if (IS_STATIC_JSON) {
  console.warn(
    "[api] Detected static db.json URL. CRUD will be simulated via localStorage. " +
      "Run json-server for a real REST mock server.",
  );
}

// localStorage DB helpers

type DB = Record<string, any[]>;

/** Load DB from localStorage, or return null if not yet seeded. */
function loadDB(): DB | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DB) : null;
  } catch {
    return null;
  }
}

/** Persist DB back to localStorage. */
function saveDB(db: DB): void {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

/**
 * Fetch the static db.json, parse it, seed localStorage (once), then return it.
 * Subsequent calls use localStorage so writes persist across page refreshes.
 */
async function getOrSeedDB(): Promise<DB> {
  const existing = loadDB();
  if (existing) return existing;

  const res = await axios.get<DB>(BASE_URL);
  const db = res.data;
  saveDB(db);
  return db;
}

// Path parsing

/**
 * Convert a REST-style path to a [collection, id?] tuple.
 * e.g. "/users/42" → ["users", "42"]
 *      "/users"    → ["users", undefined]
 */
function parsePath(path: string): [string, string | undefined] {
  const parts = path.replace(/^\//, "").split("/");
  return [parts[0], parts[1]];
}

// ─── Simulated CRUD on the in-memory / localStorage DB

async function localGet(path: string): Promise<any> {
  const db = await getOrSeedDB();
  const [collection, id] = parsePath(path);

  if (!collection) return db;

  const items: any[] = db[collection] ?? [];
  if (id === undefined) return items;

  const item = items.find((i) => String(i.id) === id);
  if (!item) throw new Error(`Not found: ${path}`);
  return item;
}

async function localPost(
  path: string,
  data: Record<string, any>,
): Promise<any> {
  const db = await getOrSeedDB();
  const [collection] = parsePath(path);

  if (!db[collection]) db[collection] = [];

  // Auto-increment id if not provided
  const maxId = db[collection].reduce(
    (m: number, i: any) => Math.max(m, Number(i.id) || 0),
    0,
  );
  const newItem = { id: maxId + 1, ...data };
  db[collection].push(newItem);
  saveDB(db);
  return newItem;
}

async function localPut(path: string, data: Record<string, any>): Promise<any> {
  const db = await getOrSeedDB();
  const [collection, id] = parsePath(path);

  if (!collection || id === undefined)
    throw new Error("PUT requires a path like /collection/id");

  const items: any[] = db[collection] ?? [];
  const idx = items.findIndex((i) => String(i.id) === id);
  if (idx === -1) throw new Error(`Not found: ${path}`);

  items[idx] = { ...items[idx], ...data, id: items[idx].id };
  db[collection] = items;
  saveDB(db);
  return items[idx];
}

async function localDelete(path: string): Promise<any> {
  const db = await getOrSeedDB();
  const [collection, id] = parsePath(path);

  if (!collection || id === undefined)
    throw new Error("DELETE requires a path like /collection/id");

  const items: any[] = db[collection] ?? [];
  const idx = items.findIndex((i) => String(i.id) === id);
  if (idx === -1) throw new Error(`Not found: ${path}`);

  const [deleted] = items.splice(idx, 1);
  db[collection] = items;
  saveDB(db);
  return deleted;
}

// ─── Real axios instance (used when NOT pointing at a static file)

const axiosInstance = axios.create({
  baseURL: IS_STATIC_JSON ? undefined : BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Public API

const api = {
  async get(endpoint: string | number) {
    const path = String(endpoint);
    try {
      if (IS_STATIC_JSON) return await localGet(path);
      const res = await axiosInstance.get(path);
      return res.data;
    } catch (error) {
      console.error(`API get error for ${path}:`, error);
      throw error;
    }
  },

  async post(endpoint: string | number, data: Record<string, any>) {
    const path = String(endpoint);
    try {
      if (IS_STATIC_JSON) return await localPost(path, data);
      const res = await axiosInstance.post(path, data);
      return res.data;
    } catch (error) {
      console.error(`API post error for ${path}:`, error);
      throw error;
    }
  },

  async put(endpoint: string | number, data: Record<string, any>) {
    const path = String(endpoint);
    try {
      if (IS_STATIC_JSON) return await localPut(path, data);
      const res = await axiosInstance.put(path, data);
      return res.data;
    } catch (error) {
      console.error(`API put error for ${path}:`, error);
      throw error;
    }
  },

  async delete(endpoint: string | number) {
    const path = String(endpoint);
    try {
      if (IS_STATIC_JSON) return await localDelete(path);
      const res = await axiosInstance.delete(path);
      return res.data;
    } catch (error) {
      console.error(`API delete error for ${path}:`, error);
      throw error;
    }
  },

  /**
   * Wipe the localStorage cache and re-seed from the original db.json on next request.
   * Useful during development when db.json changes.
   */
  resetDB() {
    localStorage.removeItem(LS_KEY);
    console.info(
      "[api] localStorage DB cleared. Will re-seed from db.json on next request.",
    );
  },
};

export default api;
