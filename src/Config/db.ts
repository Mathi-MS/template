import { openDB } from "idb";

const DB_NAME = "authDB";
const STORE_NAME = "userStore";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export const setUserToDB = async (user: any) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, user, "auth");
};

export const getUserFromDB = async () => {
  const db = await dbPromise;
  return await db.get(STORE_NAME, "auth");
};

export const clearUserDB = async () => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, "auth");
};

export const getUserRoleFromDB = async () => {
  const user = await getUserFromDB();
  return user?.user?.activeRole || null;
};

