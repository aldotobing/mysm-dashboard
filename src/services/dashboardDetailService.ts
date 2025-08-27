// services/dashboardDetailService.ts
import { apiClient } from './apiClient';

interface DashboardDetailData {
  region_id_detail: string;
  region_name_detail: string;
  region_group_name_detail: string;
  branch_id_detail: string;
  branch_code_detail: string;
  branch_name_detail: string;
  total_outlet: string;
  total_registered_user_detail: string;
  total_visit_user_detail: string;
  total_active_outlet_detail: string;
  customer_count_repeat_order_detail: string;
  total_order_user_detail: string;
  total_repeat_order_user_detail: string;
  total_invoice_user_detail: string;
  total_complete_customer: string;
}

interface DashboardDetailParams {
  region_id: string;
  start_date?: string;
  end_date?: string;
  [key: string]: string | undefined;
}

export const getDashboardDetailData = async (regionId: string, startDate?: string, endDate?: string): Promise<DashboardDetailData[]> => {
  try {
    // Use the correct endpoint for dashboard detail data
    const params: DashboardDetailParams = {
      region_id: regionId,
    };
    
    if (startDate) {
      params.start_date = startDate;
    }
    
    if (endDate) {
      params.end_date = endDate;
    }
    
    // Use the correct endpoint from the old project: /v1/api/web/dashboard/detail
    const response = await apiClient.get('/v1/api/web/dashboard/detail', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching dashboard detail data:', error);
    
    // Return empty array as fallback
    return [];
  }
};