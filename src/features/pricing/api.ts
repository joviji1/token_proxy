import { apiClient } from "@/lib/apiClient";

import type {
  ModelPricingSettingsInput,
  ModelPricingSettingsSnapshot,
} from "@/features/pricing/types";

export async function readModelPricingSettings() {
  return await apiClient<ModelPricingSettingsSnapshot>({ command: "read_model_pricing_settings" });
}

export async function saveModelPricingSettings(settings: ModelPricingSettingsInput) {
  return await apiClient<ModelPricingSettingsSnapshot>({
    command: "save_model_pricing_settings",
    args: { settings },
  });
}

export async function resetModelPricingSettings() {
  return await apiClient<ModelPricingSettingsSnapshot>({ command: "reset_model_pricing_settings" });
}
