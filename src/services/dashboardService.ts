// services/dashboardService.ts
import { apiClient } from './apiClient';
import { getCookie } from '@/helpers/cookies';

interface DashboardData {
  region_id: string;
  region_name: string;
  total_outlet: string;
  total_registered_user: string;
  total_visit_user: string;
  total_active_outlet: string;
  customer_count_repeat_order: string;
  total_order_user: string;
  total_repeat_order_user: string;
  total_invoice_user: string;
  total_complete_customer: string;
}

interface OmzetData {
  region_group_id: string;
  region_group_name: string;
  total_quantity: string;
  total_omzet: string;
}

interface OmzetPerMonthData {
  id: string;
  transaction_year: string;
  transaction_month: string;
  transaction_month_name: string;
  total_quantity: string;
  total_omzet: string;
}

export const getDashboardData = async (): Promise<DashboardData[]> => {
  try {
    const response = await apiClient.get('/v1/api/web/dashboard');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

export const getDashboardDataWithFilter = async (startDate: string, endDate: string): Promise<DashboardData[]> => {
  try {
    const params = {
      start_date: startDate,
      end_date: endDate,
    };
    
    const response = await apiClient.get('/v1/api/web/dashboard', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching filtered dashboard data:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

export const getOmzetData = async (): Promise<OmzetData[]> => {
  try {
    const response = await apiClient.get('/v1/api/web/dashboard/omzet');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching omzet data:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

export const getOmzetDataWithFilter = async (
  startDate: string, 
  endDate: string, 
  itemCategoryIds: string, 
  itemIds: string
): Promise<OmzetData[]> => {
  try {
    const params = {
      start_date: startDate,
      end_date: endDate,
      item_category_ids: itemCategoryIds,
      item_ids: itemIds,
    };
    
    const response = await apiClient.get('/v1/api/web/dashboard/omzet', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching filtered omzet data:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

export const getOmzetPerMonthData = async (): Promise<OmzetPerMonthData[]> => {
  try {
    const userId = getCookie('user_id');
    const params = {
      user_id: userId,
    };
    
    const response = await apiClient.get('/v1/api/web/dashboard/omzet/graph', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching omzet per month data:', error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};