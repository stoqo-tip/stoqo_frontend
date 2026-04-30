import { API_BASE_URL } from '../config/api';
import { getAuthHeaders } from './authTokenStorage';

export type ConsumptionProduct = {
  product_type_code: string;
  display_name: string;
  avg_interval_days: number | null;
  last_bought_at: string | null;
  days_since_last: number | null;
  predicted_next_at: string | null;
  days_until_next: number | null;
  frequency_label: string;
  event_count: number;
};

type ConsumptionAnalysisResponse = {
  products: ConsumptionProduct[];
};

export async function fetchConsumptionAnalysis(): Promise<ConsumptionProduct[]> {
  const response = await fetch(`${API_BASE_URL}/consumption/me/analysis`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = (await response.json()) as ConsumptionAnalysisResponse;
  return data.products;
}
