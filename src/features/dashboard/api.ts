import { apiClient } from '@/lib/apiClient';

import type {
  DashboardSnapshot,
  DashboardSnapshotQuery,
} from '@/features/dashboard/types';

export async function readDashboardSnapshot(query: DashboardSnapshotQuery) {
  return await apiClient<DashboardSnapshot>({
    command: 'read_dashboard_snapshot',
    args: {
      fromTsMs: query.range.fromTsMs,
      toTsMs: query.range.toTsMs,
      offset: query.offset,
      upstreamId: query.upstreamId ?? undefined,
      accountId: query.accountId ?? undefined,
      publicOnly: query.publicOnly ?? undefined,
    },
  });
}

export async function refreshDashboardModelDiscovery() {
  return await apiClient({ command: 'refresh_dashboard_model_discovery' });
}
