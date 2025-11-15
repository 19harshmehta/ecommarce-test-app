const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` } as HeadersInit;
  }
  const res = await fetch(`${BACKEND_URL}/api${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}