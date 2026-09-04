export type ApiUser = {
  id: string;
  name: string;
  email: string;
};

export type DraftSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type DraftRecord = DraftSummary & {
  htmlContent: string;
  note: string;
  sourceOrder: string;
};

type ApiErrorBody = {
  error?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ user: ApiUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ user: ApiUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () => request<{ user: ApiUser }>("/api/auth/me"),

  listDrafts: () => request<{ drafts: DraftSummary[] }>("/api/drafts"),

  getDraft: (id: string) => request<{ draft: DraftRecord }>(`/api/drafts/${id}`),

  createDraft: (body: {
    title?: string;
    htmlContent: string;
    note?: string;
    sourceOrder?: unknown;
  }) =>
    request<{ draft: DraftRecord }>("/api/drafts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateDraft: (
    id: string,
    body: {
      title?: string;
      htmlContent: string;
      note?: string;
      sourceOrder?: unknown;
    },
  ) =>
    request<{ draft: DraftRecord }>(`/api/drafts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteDraft: (id: string) =>
    request<{ ok: boolean }>(`/api/drafts/${id}`, { method: "DELETE" }),
};
