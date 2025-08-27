// src/app/(admin)/dashboard/[regionId]/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useEffect, useState, use } from "react";
import { getDashboardDetailData } from "@/services/dashboardDetailService";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

interface ChartTooltipContext {
  seriesIndex: number;
  dataPointIndex: number;
}

export default function DashboardDetailPage({ params }: { params: Promise<{ regionId: string }> }) {
  const { user } = useAuth();
  useAuthRedirect();

  // Unwrap params with React.use() for Next.js 14+ compliance
  const { regionId } = use(params as unknown as Promise<{ regionId: string }>);

  const [dashboardDetailData, setDashboardDetailData] = useState<DashboardDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regionName, setRegionName] = useState<string>("");
  
  // Chart states
  const [chartData, setChartData] = useState<ApexAxisChartSeries>([]);
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !regionId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardDetailData(regionId);
        setDashboardDetailData(data);
        
        // Set region name from the first item
        if (data && data.length > 0 && data[0].region_name_detail) {
          setRegionName(data[0].region_name_detail);
        }
      } catch (err) {
        console.error("Error fetching dashboard detail data:", err);
        setError("Failed to load dashboard detail data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, regionId]);  

  // Process chart data
  useEffect(() => {
    if (dashboardDetailData && dashboardDetailData.length > 0) {
      const totalToko = dashboardDetailData.map(item => parseInt(item.total_outlet) || 0);
      const totalInstall = dashboardDetailData.map(item => parseInt(item.total_registered_user_detail) || 0);
      const totalVisit = dashboardDetailData.map(item => parseInt(item.total_visit_user_detail) || 0);
      const totalAktifOutlet = dashboardDetailData.map(item => parseInt(item.total_active_outlet_detail) || 0);
      const totalTokoRepeatOrder = dashboardDetailData.map(item => parseInt(item.customer_count_repeat_order_detail) || 0);
      const totalPesanan = dashboardDetailData.map(item => parseInt(item.total_order_user_detail) || 0);
      const totalRepeatOrder = dashboardDetailData.map(item => parseInt(item.total_repeat_order_user_detail) || 0);
      const totalInvoice = dashboardDetailData.map(item => parseInt(item.total_invoice_user_detail) || 0);
      const totalKelengkapan = dashboardDetailData.map(item => parseInt(item.total_complete_customer) || 0);

      const chartSeries: ApexAxisChartSeries = [
        {
          name: 'Total Toko',
          data: totalToko,
        },
        {
          name: 'Total Toko Install',
          data: totalInstall,
        },
        {
          name: 'Total Kelengkapan Data',
          data: totalKelengkapan,
        },
        {
          name: 'Total Aktif Outlet',
          data: totalAktifOutlet,
        },
        {
          name: 'Total Visit',
          data: totalVisit,
        },
        {
          name: 'Total Toko Repeat Order',
          data: totalTokoRepeatOrder,
        },
        {
          name: 'Total Pesanan Toko',
          data: totalPesanan,
        },
        {
          name: 'Total Repeat Order',
          data: totalRepeatOrder,
        },
        {
          name: 'Total Invoice',
          data: totalInvoice,
        },
      ];

      setChartData(chartSeries);

      const options: ApexCharts.ApexOptions = {
        chart: {
          type: 'bar',
          stacked: true,
        },
        xaxis: {
          categories: dashboardDetailData.map(item => item.branch_name_detail || item.branch_code_detail || 'Unknown'),
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val: number, context: ChartTooltipContext) {
              if (dashboardDetailData.length > context.dataPointIndex) {
                if (context.seriesIndex === 0) {
                  const totalTokoAll = parseInt(dashboardDetailData[context.dataPointIndex].total_outlet) || 1;
                  const percentage = (val / totalTokoAll) * 100;
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
                } else if (context.seriesIndex === 1) {
                  const totalTokoAll = parseInt(dashboardDetailData[context.dataPointIndex].total_outlet) || 1;
                  const percentage = (val / totalTokoAll) * 100;
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
                } else if (context.seriesIndex === 2) {
                  const totalTokoAll = parseInt(dashboardDetailData[context.dataPointIndex].total_outlet) || 1;
                  const percentage = (val / totalTokoAll) * 100;
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
                } else if (context.seriesIndex === 3) {
                  const totalTokoAll = parseInt(dashboardDetailData[context.dataPointIndex].total_outlet) || 1;
                  const percentage = (val / totalTokoAll) * 100;
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
                } else {
                  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
              }
              return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        colors: [
          '#e60049',
          '#0bb4ff',
          '#50e991',
          '#e6d800',
          '#9b19f5',
          '#ffa300',
          '#dc0ab4',
          '#b3d4ff',
          '#00bfa0',
        ],
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: 'bottom',
        },
        fill: {
          opacity: 1,
        },
      };

      setChartOptions(options);
    }
  }, [dashboardDetailData]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data <span className="text-blue-600">{regionName || 'Region'}</span> Bulan Ini
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Region Detail Chart
            </h2>
            
            {chartData && chartData.length > 0 ? (
              <div>
                <ReactApexChart 
                  options={chartOptions} 
                  series={chartData} 
                  type="bar" 
                  height={350} 
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No chart data available for this region
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Branch Details
            </h2>
            
            {dashboardDetailData && dashboardDetailData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Branch Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Branch Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Toko
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Toko Install
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Aktif Outlet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Toko Repeat Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Pesanan Toko
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Repeat Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Invoice Toko
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Kelengkapan Data Toko
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {dashboardDetailData.map((item, index) => (
                      <tr key={`${item.branch_id_detail || item.branch_code_detail || index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.branch_code_detail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.branch_name_detail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_outlet || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_registered_user_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_visit_user_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_active_outlet_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.customer_count_repeat_order_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_order_user_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_repeat_order_user_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_invoice_user_detail || '0').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {parseInt(item.total_complete_customer || '0').toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No branch data available for this region
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}