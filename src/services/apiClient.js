const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getAuthHeaders(customHeaders = {}) {
  const token = localStorage.getItem('@ongplus:token');
  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function extractApiErrorMessage(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.join(' ');

  return Object.entries(data)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${key}: ${item}`);
      }
      if (typeof value === 'object' && value !== null) {
        return extractApiErrorMessage(value);
      }
      return `${key}: ${value}`;
    })
    .join(' ');
}

async function parseResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(text || 'Resposta inválida da API');
  }
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('@ongplus:token');
      localStorage.removeItem('@ongplus:refresh_token');
      localStorage.removeItem('@ongplus:user');
    }
    const message = data?.error || data?.detail || extractApiErrorMessage(data) || `Erro ${res.status} na API`;
    throw new Error(message);
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return parseResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return parseResponse(res);
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return parseResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return parseResponse(res);
}

function parseFilename(contentDisposition, fallback) {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename="([^"]+)"/);
  return match?.[1] || fallback;
}

export async function apiDownload(path, fallbackFilename = 'download.pdf') {
  const token = localStorage.getItem('@ongplus:token');
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    let message = `Erro ${res.status} ao baixar arquivo`;
    try {
      const data = text ? JSON.parse(text) : null;
      message = data?.error || data?.detail || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get('Content-Disposition'), fallbackFilename);
  return { blob, filename };
}

export async function apiUpload(path, formData) {
  const token = localStorage.getItem('@ongplus:token');
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return parseResponse(res);
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
