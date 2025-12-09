import { useState } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/PageHeader';
import { Button, Loading } from '@/components';
import { useReports } from '@/queries/useReports';
import { formatCurrency } from '@/shared/formatters';

// Simple Stat Card
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}) => (
  <div className="bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-(--color-body)">{title}</p>
        <h3 className="text-2xl font-bold text-(--color-text) mt-1">{value}</h3>
        {subtitle && (
          <p className="text-xs text-(--color-inactive) mt-1">{subtitle}</p>
        )}
      </div>
      {icon && (
        <div className="p-2 bg-(--color-background) rounded-lg">{icon}</div>
      )}
    </div>
  </div>
);

const Reports = () => {
  const [dateRange] = useState<{ from?: string; to?: string }>({});

  const {
    useGetUsersReport,
    useGetRevenueReport,
    useGetListingsReport,
    useGetSubscriptionsReport,
  } = useReports();

  const { data: usersData, isLoading: usersLoading } =
    useGetUsersReport(dateRange);
  const { data: revenueData, isLoading: revenueLoading } =
    useGetRevenueReport(dateRange);
  const { data: listingsData, isLoading: listingsLoading } =
    useGetListingsReport(dateRange);
  const { data: subsData, isLoading: subsLoading } =
    useGetSubscriptionsReport(dateRange);

  const isLoading =
    usersLoading || revenueLoading || listingsLoading || subsLoading;

  if (isLoading) return <Loading />;

  const users = usersData?.data;
  const revenue = revenueData?.data;
  const listings = listingsData?.data;
  const subs = subsData?.data;

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting reports as ${format}...`);
    // Implementation would likely involve calling the API with format param
    // and handling the file download blob.
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Reports"
          description="System-wide analytics and statistics."
          icon={<ChartBarIcon className="h-12 w-12" />}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            icon={<ArrowDownTrayIcon className="h-4 w-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-bold text-(--color-text) mb-4">Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(revenue?.total_revenue || 0)}
            icon={<CurrencyDollarIcon className="h-6 w-6 text-emerald-500" />}
          />
        </div>
      </section>

      {/* Users Section */}
      <section>
        <h3 className="text-lg font-bold text-(--color-text) mb-4">Users</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={users?.total_users || 0}
            icon={<UsersIcon className="h-6 w-6 text-blue-500" />}
          />
          <StatCard
            title="New Users"
            value={users?.new_users || 0}
            subtitle="In selected period"
          />
          <StatCard title="Mechanics" value={users?.mechanics || 0} />
          <StatCard title="Workshops" value={users?.workshops || 0} />
        </div>
      </section>

      {/* Listings Section */}
      <section>
        <h3 className="text-lg font-bold text-(--color-text) mb-4">Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Listings"
            value={listings?.total_listings || 0}
            icon={<TruckIcon className="h-6 w-6 text-orange-500" />}
          />
          <StatCard
            title="Active Listings"
            value={listings?.active_listings || 0}
          />
          <StatCard
            title="Pending Approval"
            value={listings?.pending_listings || 0}
          />
          <StatCard title="Sold" value={listings?.sold_listings || 0} />
        </div>
      </section>

      {/* Subscriptions Section */}
      <section>
        <h3 className="text-lg font-bold text-(--color-text) mb-4">
          Subscriptions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Subscriptions" value={subs?.total || 0} />
          <StatCard
            title="Active"
            value={subs?.active || 0}
            icon={<ChartBarIcon className="h-6 w-6 text-purple-500" />}
          />
          <StatCard title="Canceled" value={subs?.active || 0} />
        </div>
      </section>
    </div>
  );
};

export default Reports;
