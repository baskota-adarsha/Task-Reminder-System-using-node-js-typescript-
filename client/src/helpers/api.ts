const API = "http://localhost:3000";

export const getToken = () => localStorage.getItem("token");
export const saveToken = (token: string) =>
  localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");
export async function call(path: string, method = "GET", body?: object) {
  const token = getToken();
  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && token) {
    removeToken();
    window.location.reload();
  }

  if (res.status == 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? "Something went wrong");
  return data;
}
