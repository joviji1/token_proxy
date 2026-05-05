import { apiClient } from "@/lib/apiClient";

import type { ProviderAccountsPage } from "@/features/providers/types";

export async function listProviderAccountsPage(params: {
  page: number;
  pageSize: number;
  providerKind?: "kiro" | "codex";
  status?: "active" | "disabled" | "expired" | "cooling_down";
  search?: string;
}) {
  return await apiClient<ProviderAccountsPage>({
    command: "providers_list_accounts_page",
    args: {
      page: params.page,
      pageSize: params.pageSize,
      providerKind: params.providerKind ?? null,
      status: params.status ?? null,
      search: params.search ?? null,
    },
  });
}

export async function deleteProviderAccounts(accountIds: string[]) {
  return await apiClient({
    command: "providers_delete_accounts",
    args: { accountIds },
  });
}
