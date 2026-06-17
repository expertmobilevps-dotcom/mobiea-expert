const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api';

function getAuthHeaders() {
  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed: ${response.status}`);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export async function login(email, licenseKey) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, licenseKey }),
  });
}

export async function logout() {
  localStorage.removeItem('sessionId');
  return request('/logout', { method: 'POST' });
}

export async function validateLicense() {
  return request('/validate-license');
}

export async function getSignals() {
  return request('/signals');
}

export async function getQuotes() {
  return request('/quotes');
}

export async function executeTrade(trade) {
  return request('/execute-trade', {
    method: 'POST',
    body: JSON.stringify(trade),
  });
}

export async function getSession() {
  return request('/session');
}
