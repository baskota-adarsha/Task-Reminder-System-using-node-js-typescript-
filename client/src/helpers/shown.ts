const KEY = "shownReminders";

function readAll(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export const wasShown = (key: string) => readAll().includes(key);

export function markShown(key: string) {
  const all = readAll();
  all.push(key);
  localStorage.setItem(KEY, JSON.stringify(all.slice(-200))); // keep only the last 200
}
