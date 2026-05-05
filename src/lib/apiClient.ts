const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

export const isBrowserMode = !isTauri;

const MGMT_BASE = '/_tp';

type InvokeOptions = {
  command: string;
  args?: Record<string, unknown>;
};

function buildQuery(args?: Record<string, unknown>) {
  const params = new URLSearchParams();
  if (!args) return '';
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

async function readTextSafe(res: Response) {
  return await res.text().catch(() => '');
}

async function getJson<T>(paths: string[]) {
  let lastError = 'Unknown error';
  for (const path of paths) {
    const res = await fetch(`${MGMT_BASE}${path}`);
    if (res.ok) {
      return (await res.json()) as T;
    }
    lastError = (await readTextSafe(res)) || `HTTP ${res.status}`;
  }
  throw new Error(lastError);
}


const defaultPricingSnapshot = {
  settings: {
    version: '2026-05-02.openai-openrouter-v1',
    models: [
      {
        modelId: 'gpt-5.5',
        aliases: ['gpt-5.5', 'openai/gpt-5.5'],
        short: {
          inputNanoUsdPerToken: 5000,
          cachedInputNanoUsdPerToken: 500,
          outputNanoUsdPerToken: 30000,
        },
        long: {
          inputNanoUsdPerToken: 10000,
          cachedInputNanoUsdPerToken: 1000,
          outputNanoUsdPerToken: 45000,
        },
        longContextInputTokenThreshold: 272000,
      },
      {
        modelId: 'gpt-5.4',
        aliases: ['gpt-5.4', 'openai/gpt-5.4'],
        short: {
          inputNanoUsdPerToken: 2500,
          cachedInputNanoUsdPerToken: 250,
          outputNanoUsdPerToken: 15000,
        },
        long: {
          inputNanoUsdPerToken: 5000,
          cachedInputNanoUsdPerToken: 500,
          outputNanoUsdPerToken: 22500,
        },
        longContextInputTokenThreshold: 272000,
      },
      {
        modelId: 'gpt-5.4-mini',
        aliases: ['gpt-5.4-mini', 'openai/gpt-5.4-mini'],
        short: {
          inputNanoUsdPerToken: 750,
          cachedInputNanoUsdPerToken: 75,
          outputNanoUsdPerToken: 4500,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
      {
        modelId: 'gpt-image-2',
        aliases: ['gpt-image-2', 'openai/gpt-image-2'],
        short: {
          inputNanoUsdPerToken: 8000,
          cachedInputNanoUsdPerToken: 2000,
          outputNanoUsdPerToken: 30000,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
      {
        modelId: 'gpt-5.4-image-2',
        aliases: ['gpt-5.4-image-2', 'openai/gpt-5.4-image-2'],
        short: {
          inputNanoUsdPerToken: 8000,
          cachedInputNanoUsdPerToken: 2000,
          outputNanoUsdPerToken: 15000,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
    ],
  },
  defaultSettings: {
    version: '2026-05-02.openai-openrouter-v1',
    models: [
      {
        modelId: 'gpt-5.5',
        aliases: ['gpt-5.5', 'openai/gpt-5.5'],
        short: {
          inputNanoUsdPerToken: 5000,
          cachedInputNanoUsdPerToken: 500,
          outputNanoUsdPerToken: 30000,
        },
        long: {
          inputNanoUsdPerToken: 10000,
          cachedInputNanoUsdPerToken: 1000,
          outputNanoUsdPerToken: 45000,
        },
        longContextInputTokenThreshold: 272000,
      },
      {
        modelId: 'gpt-5.4',
        aliases: ['gpt-5.4', 'openai/gpt-5.4'],
        short: {
          inputNanoUsdPerToken: 2500,
          cachedInputNanoUsdPerToken: 250,
          outputNanoUsdPerToken: 15000,
        },
        long: {
          inputNanoUsdPerToken: 5000,
          cachedInputNanoUsdPerToken: 500,
          outputNanoUsdPerToken: 22500,
        },
        longContextInputTokenThreshold: 272000,
      },
      {
        modelId: 'gpt-5.4-mini',
        aliases: ['gpt-5.4-mini', 'openai/gpt-5.4-mini'],
        short: {
          inputNanoUsdPerToken: 750,
          cachedInputNanoUsdPerToken: 75,
          outputNanoUsdPerToken: 4500,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
      {
        modelId: 'gpt-image-2',
        aliases: ['gpt-image-2', 'openai/gpt-image-2'],
        short: {
          inputNanoUsdPerToken: 8000,
          cachedInputNanoUsdPerToken: 2000,
          outputNanoUsdPerToken: 30000,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
      {
        modelId: 'gpt-5.4-image-2',
        aliases: ['gpt-5.4-image-2', 'openai/gpt-5.4-image-2'],
        short: {
          inputNanoUsdPerToken: 8000,
          cachedInputNanoUsdPerToken: 2000,
          outputNanoUsdPerToken: 15000,
        },
        long: null,
        longContextInputTokenThreshold: null,
      },
    ],
  },
};

async function postJson<T>(paths: string[], body?: unknown) {
  let lastError = 'Unknown error';
  for (const path of paths) {
    const res = await fetch(`${MGMT_BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.ok) {
      const text = await readTextSafe(res);
      if (!text.trim()) return undefined as T;
      try {
        return JSON.parse(text) as T;
      } catch {
        return undefined as T;
      }
    }
    lastError = (await readTextSafe(res)) || `HTTP ${res.status}`;
  }
  throw new Error(lastError);
}

type ProviderAccountsPage = {
  items: unknown[];
  total: number;
  page: number;
  page_size: number;
};

type LegacyConfigPayload = {
  addr?: string;
  port?: number;
  logLevel?: string;
  retryableFailureCooldown?: number;
  upstreams?: unknown;
  [key: string]: unknown;
};

type LegacyHealthPayload = {
  proxy_state?: string;
  proxy_addr?: string | null;
  proxy_last_error?: string | null;
  [key: string]: unknown;
};

function normalizeLogLevel(value: unknown) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (['silent', 'error', 'warn', 'info', 'debug', 'trace'].includes(raw)) {
    return raw;
  }
  return 'silent';
}

function normalizeLegacyConfig(raw: unknown) {
  if (!raw || typeof raw !== 'object') {
    return {
      path: 'legacy:/config',
      config: {
        host: '127.0.0.1',
        port: 9208,
        local_api_key: null,
        app_proxy_url: null,
        cors_enabled: false,
        model_list_prefix: false,
        kiro_preferred_endpoint: 'ide',
        log_level: 'silent',
        retryable_failure_cooldown_secs: 15,
        codex_session_scoped_cooldown_enabled: false,
        upstream_no_data_timeout_secs: 120,
        tray_token_rate: { enabled: true, format: 'split' },
        upstream_strategy: { order: 'fill_first', dispatch: { type: 'serial' } },
        hot_model_mappings: {},
        upstreams: [],
      },
    };
  }

  const legacy = raw as LegacyConfigPayload;
  const addr = typeof legacy.addr === 'string' ? legacy.addr : '';
  const hostFromAddr = addr.includes(':') ? addr.slice(0, addr.lastIndexOf(':')) : addr;
  const portFromAddr = addr.includes(':') ? Number(addr.slice(addr.lastIndexOf(':') + 1)) : NaN;
  const port = Number.isFinite(Number(legacy.port))
    ? Number(legacy.port)
    : (Number.isFinite(portFromAddr) ? portFromAddr : 9208);

  return {
    path: 'legacy:/config',
    config: {
      ...legacy,
      host: hostFromAddr || '127.0.0.1',
      port,
      local_api_key: null,
      app_proxy_url: null,
      cors_enabled: false,
      model_list_prefix: false,
      kiro_preferred_endpoint: 'ide',
      log_level: normalizeLogLevel(legacy.logLevel),
      retryable_failure_cooldown_secs: Number.isFinite(Number(legacy.retryableFailureCooldown))
        ? Number(legacy.retryableFailureCooldown)
        : 15,
      codex_session_scoped_cooldown_enabled: false,
      upstream_no_data_timeout_secs: 120,
      tray_token_rate: { enabled: true, format: 'split' },
      upstream_strategy: { order: 'fill_first', dispatch: { type: 'serial' } },
      hot_model_mappings: {},
      upstreams: Array.isArray(legacy.upstreams) ? legacy.upstreams : [],
    },
  };
}

function normalizeLegacyHealth(raw: unknown) {
  if (!raw || typeof raw !== 'object') {
    return { state: 'stopped', addr: null, last_error: 'invalid health payload' };
  }
  const health = raw as LegacyHealthPayload;
  return {
    state: String(health.proxy_state ?? '').toLowerCase() === 'running' ? 'running' : 'stopped',
    addr: health.proxy_addr ?? null,
    last_error: health.proxy_last_error ?? null,
  };
}

function mapAccountsPage(raw: unknown, args?: Record<string, unknown>): ProviderAccountsPage {
  const list = Array.isArray(raw) ? raw : [];
  const page = Number(args?.page ?? 1);
  const pageSize = Number(args?.pageSize ?? 10);
  const providerKind = args?.providerKind ? String(args.providerKind) : '';
  const status = args?.status ? String(args.status) : '';
  const search = args?.search ? String(args.search).trim().toLowerCase() : '';

  const filtered = list.filter((item: any) => {
    if (!item || typeof item !== 'object') return false;
    const provider = String(item.provider_kind ?? item.providerKind ?? '');
    const accountStatus = String(item.status ?? '');
    const email = String(item.email ?? '');
    const accountId = String(item.account_id ?? item.accountId ?? '');
    const providerName = String(item.provider_name ?? item.providerName ?? '');
    if (providerKind && provider !== providerKind) return false;
    if (status && accountStatus !== status) return false;
    if (search) {
      const hay = [email, accountId, providerName, provider].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  const start = Math.max(0, (page - 1) * pageSize);
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    page_size: pageSize,
  };
}

export async function apiClient<T = unknown>({ command, args }: InvokeOptions): Promise<T> {
  if (!isBrowserMode) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<T>(command, args);
  }

  switch (command) {
    case 'read_dashboard_snapshot':
      return getJson<T>([
        `/dashboard/snapshot${buildQuery(args)}`,
        `/api/dashboard/snapshot${buildQuery(args)}`,
      ]);
    case 'refresh_dashboard_model_discovery':
      return getJson<T>([
        '/api/proxy/model_discovery',
        '/dashboard/snapshot',
      ]);
    case 'proxy_status':
      return normalizeLegacyHealth(await getJson<unknown>(['/health', '/api/proxy/status'])) as T;
    case 'proxy_reload':
      return postJson<T>(['/api/proxy/reload']);
    case 'proxy_restart':
      return postJson<T>(['/api/proxy/restart']);
    case 'proxy_start':
      return postJson<T>(['/api/proxy/start']);
    case 'proxy_stop':
      return postJson<T>(['/api/proxy/stop']);
    case 'read_proxy_config':
      return normalizeLegacyConfig(await getJson<unknown>(['/config', '/api/config'])) as T;
    case 'save_proxy_config':
      return postJson<T>(['/api/config'], args?.config ?? args);
    case 'read_model_pricing_settings':
      return defaultPricingSnapshot as T;
    case 'save_model_pricing_settings':
      return postJson<T>(['/api/pricing'], args?.settings ?? args);
    case 'reset_model_pricing_settings':
      throw new Error('当前浏览器部署未提供价格重置接口。');
    case 'providers_delete_accounts':
      throw new Error('当前浏览器部署未提供账号删除接口。');
    case 'preview_client_setup':
    case 'write_claude_code_settings':
    case 'write_codex_config':
    case 'write_opencode_config':
      throw new Error('当前浏览器部署不支持本地客户端配置写入。');
    case 'read_default_hot_model_mappings':
      return {} as T;
    case 'providers_list_accounts_page': {
      const raw = await getJson<unknown>(['/accounts', '/api/accounts']);
      return mapAccountsPage(raw, args) as T;
    }
    default:
      throw new Error(`Browser mode command not implemented: ${command}`);
  }
}
