const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://paygate-api.fly.dev";

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error?.message ?? "Request failed", data.error?.code, res.status);
  }

  return data as T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; merchant: Merchant }>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; merchant: Merchant }>("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ merchant: { name, email, password } }),
      }),
    logout: (token: string) =>
      request("/v1/auth/logout", { method: "DELETE", token }),
  },

  me: {
    get: (token: string) => request<{ merchant: Merchant }>("/v1/me", { token }),
    update: (token: string, data: Partial<Merchant>) =>
      request<{ merchant: Merchant }>("/v1/me", {
        method: "PATCH",
        body: JSON.stringify({ merchant: data }),
        token,
      }),
    dashboard: (token: string) =>
      request<DashboardStats>("/v1/me/dashboard", { token }),
  },

  apiKeys: {
    list: (token: string) =>
      request<{ api_keys: ApiKey[] }>("/v1/me/api_keys", { token }),
    create: (token: string) =>
      request<ApiKeyCreated>("/v1/me/api_keys", { method: "POST", token }),
    revoke: (token: string, id: string) =>
      request(`/v1/me/api_keys/${id}`, { method: "DELETE", token }),
  },

  charges: {
    list: (token: string, params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return request<{ charges: Charge[]; meta: PaginationMeta }>(
        `/v1/charges${qs}`,
        { token }
      );
    },
    get: (token: string, id: string) =>
      request<{ charge: Charge }>(`/v1/charges/${id}`, { token }),
  },

  refunds: {
    list: (token: string, chargeId: string) =>
      request<{ refunds: Refund[] }>(`/v1/charges/${chargeId}/refunds`, { token }),
    get: (token: string, id: string) =>
      request<{ refund: Refund }>(`/v1/refunds/${id}`, { token }),
  },

  webhooks: {
    list: (token: string) =>
      request<{ webhook_endpoints: WebhookEndpoint[] }>("/v1/me/webhook_endpoints", { token }),
    create: (token: string, data: { url: string; events: string[] }) =>
      request<WebhookEndpointCreated>("/v1/me/webhook_endpoints", {
        method: "POST",
        body: JSON.stringify({ webhook_endpoint: data }),
        token,
      }),
    update: (token: string, id: string, data: { events: string[] }) =>
      request<{ webhook_endpoint: WebhookEndpoint }>(`/v1/me/webhook_endpoints/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ webhook_endpoint: data }),
        token,
      }),
    delete: (token: string, id: string) =>
      request(`/v1/me/webhook_endpoints/${id}`, { method: "DELETE", token }),
  },
};

// Types
export interface Merchant {
  id: string;
  name: string;
  email: string;
  environment: "sandbox" | "live";
  enabled_payment_methods: string[];
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  environment: "sandbox" | "live";
  public_key: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated {
  public_key: string;
  secret_key: string;
  api_key: ApiKey;
}

export interface Charge {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "authorized" | "captured" | "failed" | "voided" | "refunded";
  payment_method: string;
  provider: string;
  provider_reference?: string;
  description?: string;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  id: string;
  charge_id: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  provider_reference?: string;
  created_at: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  created_at: string;
}

export interface WebhookEndpointCreated extends WebhookEndpoint {
  webhook_secret: string;
}

export interface DashboardStats {
  total_volume: number;
  total_charges: number;
  successful_charges: number;
  failed_charges: number;
  success_rate: number;
  volume_by_method: Record<string, number>;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}
