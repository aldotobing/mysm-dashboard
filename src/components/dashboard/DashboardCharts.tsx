// components/dashboard/DashboardCharts.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  getDashboardData, 
  getDashboardDataWithFilter,
  getOmzetData,
  getOmzetPerMonthData
} from "@/services/dashboardService";
import { useAuth } from "@/context/AuthContext";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

interface ChartTooltipContext {
  seriesIndex: number;
  dataPointIndex: number;
}

const DashboardCharts = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [omzetData, setOmzetData] = useState<OmzetData[]>([]);
  const [omzetPerMonthData, setOmzetPerMonthData] = useState<OmzetPerMonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOmzet, setLoadingOmzet] = useState(true);
  const [loadingOmzetMonth, setLoadingOmzetMonth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorOmzet, setErrorOmzet] = useState<string | null>(null);
  const [errorOmzetMonth, setErrorOmzetMonth] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Chart states
  const [chartData, setChartData] = useState<ApexAxisChartSeries>([]);
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({});
  const [chartOmzet, setChartOmzet] = useState<ApexAxisChartSeries>([]);
  const [omzetOptions, setOmzetOptions] = useState<ApexCharts.ApexOptions>({});
  const [chartVolume, setChartVolume] = useState<ApexNonAxisChartSeries | ApexAxisChartSeries>([]);
  const [volumeOptions, setVolumeOptions] = useState<ApexCharts.ApexOptions>({});

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Fetch omzet data
  useEffect(() => {
    const fetchOmzetData = async () => {
      if (!user) return;
      
      try {
        setLoadingOmzet(true);
        setErrorOmzet(null);
        const data = await getOmzetData();
        setOmzetData(data);
      } catch (err) {
        console.error("Error fetching omzet data:", err);
        setErrorOmzet("Failed to load omzet data. Please try again later.");
      } finally {
        setLoadingOmzet(false);
      }
    };

    fetchOmzetData();
  }, [user]);

  // Fetch omzet per month data
  useEffect(() => {
    const fetchOmzetPerMonthData = async () => {
      if (!user) return;
      
      try {
        setLoadingOmzetMonth(true);
        setErrorOmzetMonth(null);
        const data = await getOmzetPerMonthData();
        setOmzetPerMonthData(data);
      } catch (err) {
        console.error("Error fetching omzet per month data:", err);
        setErrorOmzetMonth("Failed to load omzet per month data. Please try again later.");
      } finally {
        setLoadingOmzetMonth(false);
      }
    };

    fetchOmzetPerMonthData();
  }, [user]);

  // Process dashboard chart data
  useEffect(() => {
    if (dashboardData.length > 0) {
      const totalToko = dashboardData.map(item => parseInt(item.total_outlet) || 0);
      const totalInstall = dashboardData.map(item => parseInt(item.total_registered_user) || 0);
      const totalVisit = dashboardData.map(item => parseInt(item.total_visit_user) || 0);
      const totalAktifOutlet = dashboardData.map(item => parseInt(item.total_active_outlet) || 0);
      const totalTokoRepeatOrder = dashboardData.map(item => parseInt(item.customer_count_repeat_order) || 0);
      const totalPesanan = dashboardData.map(item => parseInt(item.total_order_user) || 0);
      const totalRepeatOrder = dashboardData.map(item => parseInt(item.total_repeat_order_user) || 0);
      const totalInvoice = dashboardData.map(item => parseInt(item.total_invoice_user) || 0);
      const totalKelengkapan = dashboardData.map(item => parseInt(item.total_complete_customer) || 0);

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
        },
        xaxis: {
          categories: dashboardData.map(item => item.region_name),
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
              if (context.seriesIndex === 0) {
                const totalTokoAll = parseInt(dashboardData[context.dataPointIndex].total_outlet) || 1;
                const percentage = (val / totalTokoAll) * 100;
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
              } else if (context.seriesIndex === 1) {
                const totalTokoAll = parseInt(dashboardData[context.dataPointIndex].total_outlet) || 1;
                const percentage = (val / totalTokoAll) * 100;
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
              } else if (context.seriesIndex === 2) {
                const totalTokoAll = parseInt(dashboardData[context.dataPointIndex].total_outlet) || 1;
                const percentage = (val / totalTokoAll) * 100;
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
              } else if (context.seriesIndex === 3) {
                const totalTokoAll = parseInt(dashboardData[context.dataPointIndex].total_outlet) || 1;
                const percentage = (val / totalTokoAll) * 100;
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' (' + percentage.toFixed(2) + '%)';
              } else {
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              }
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
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
  }, [dashboardData]);

  // Process omzet chart data
  useEffect(() => {
    if (omzetData.length > 0) {
      const totalValue = omzetData.map(item => 
        parseInt(item.total_omzet.replace('Rp. ', '').replace(/\./g, ''), 10) || 0
      );

      const totalVolume = omzetData.map(item => 
        parseInt(item.total_quantity.replace(/\./g, ''), 10) || 0
      );

      // Value chart
      const chartOmzetSeries: ApexAxisChartSeries = [
        {
          name: 'Total Value',
          type: 'column',
          data: totalValue,
        },
      ];

      setChartOmzet(chartOmzetSeries);

      const optionsOmzet: ApexCharts.ApexOptions = {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: omzetData.map(item => item.region_group_name),
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              if (val >= 1000000000) {
                return (val / 1000000000).toFixed(0) + 'M';
              } else if (val >= 1000000) {
                return (val / 1000000).toFixed(0) + 'JT';
              } else {
                return val.toString();
              }
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        colors: ['#9d4e15'],
        title: {
          text: 'Value',
        },
        legend: {
          position: 'bottom',
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return 'Rp. ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            },
          },
        },
      };

      setOmzetOptions(optionsOmzet);

      // Volume chart
      const chartVolumeSeries: ApexAxisChartSeries = [
        {
          name: 'Total Volume',
          type: 'line',
          data: totalVolume,
        },
      ];

      setChartVolume(chartVolumeSeries);

      const optionsVolume: ApexCharts.ApexOptions = {
        chart: {
          type: 'line',
        },
        xaxis: {
          categories: omzetData.map(item => item.region_group_name),
        },
        yaxis: {
          labels: {
            formatter: function (val: number) {
              if (val >= 1000000) {
                return (val / 1000000).toFixed(0) + 'JT';
              } else if (val >= 1000) {
                return (val / 1000).toFixed(0) + 'K';
              } else {
                return val.toString();
              }
            },
          },
        },
        markers: {
          size: 5,
        },
        stroke: {
          width: 2,
        },
        colors: ['#b3b300'],
        title: {
          text: ' Volume ',
        },
        legend: {
          position: 'bottom',
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            },
          },
        },
      };

      setVolumeOptions(optionsVolume);
    }
  }, [omzetData]);

  const handleDateFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardDataWithFilter(startDate, endDate);
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching filtered dashboard data:", err);
      setError("Failed to load filtered dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Summary Bulan Ini</h2>
      </div>

      {/* Date Filter */}
      <form onSubmit={handleDateFilter} className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Filtering...' : 'Filter'}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Region User Monthly Report */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Region User Monthly Report
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Unable to load dashboard data</p>
          </div>
        ) : (
          <>
            {chartData.length > 0 && (
              <div className="mb-6">
                <ReactApexChart 
                  options={chartOptions} 
                  series={chartData} 
                  type="bar" 
                  height={350} 
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Region Group
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.map((item) => (
                    <tr key={item.region_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.region_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_outlet).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_registered_user).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_visit_user).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_active_outlet).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.customer_count_repeat_order).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_order_user).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_repeat_order_user).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_invoice_user).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {parseInt(item.total_complete_customer).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Link 
                          href={`/dashboard/${item.region_id}`} 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Omzet User Monthly Report */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Omzet User Monthly Report
        </h3>

        {errorOmzet && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{errorOmzet}</p>
          </div>
        )}

        {loadingOmzet ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : errorOmzet ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Unable to load omzet data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {chartOmzet.length > 0 && (
                <div>
                  <ReactApexChart 
                    options={omzetOptions} 
                    series={chartOmzet} 
                    type="bar" 
                    height={350} 
                  />
                </div>
              )}
              {chartVolume.length > 0 && (
                <div>
                  <ReactApexChart 
                    options={volumeOptions} 
                    series={chartVolume} 
                    type="line" 
                    height={350} 
                  />
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Region Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {omzetData.map((item) => (
                    <tr key={item.region_group_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.region_group_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.total_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.total_omzet}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Omzet Volume by Month Report */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Omzet Volume by Month Report
        </h3>

        {errorOmzetMonth && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{errorOmzetMonth}</p>
          </div>
        )}

        {loadingOmzetMonth ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : errorOmzetMonth ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Unable to load omzet per month data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    January
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    February
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    March
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    April
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    May
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    June
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    July
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    August
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    September
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    October
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    November
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    December
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Process omzetPerMonthData to group by year and month */}
                {Array.from(new Set(omzetPerMonthData.map(item => item.transaction_year))).map(year => {
                  const yearData: Record<string, string> = {};
                  omzetPerMonthData
                    .filter(item => item.transaction_year === year)
                    .forEach(item => {
                      yearData[item.transaction_month_name.toLowerCase()] = item.total_quantity;
                    });

                  return (
                    <tr key={year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {year}
                      </td>
                      {['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].map(month => (
                        <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {yearData[month] || '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;