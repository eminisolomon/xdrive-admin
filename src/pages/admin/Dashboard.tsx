import DashboardIcon from '@mui/icons-material/Dashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Header */}
      <div className="mb-12 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text) flex items-center gap-4 mb-3">
          <DashboardIcon
            sx={{ fontSize: '2.75rem', color: 'var(--color-primary)' }}
          />
          Dashboard
        </h1>
        <p className="text-lg text-(--color-body)">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-16">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="group bg-(--color-surface) border border-(--color-border)/60 rounded-2xl p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-(--color-primary)/40 hover:-translate-y-2"
          >
            <p className="text-(--color-body) text-sm font-medium mb-2">
              Metric {i}
            </p>
            <p className="text-4xl font-bold text-(--color-text) mb-3">0</p>
            <p className="text-sm text-(--color-inactive)">No data available</p>
            <div className="mt-4 h-1 w-0 group-hover:w-full bg-(--color-primary) rounded-full transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="mb-20">
        <div className="bg-(--color-surface) border border-dashed border-(--color-primary)/30 rounded-3xl p-16 text-center shadow-inner">
          <h2 className="text-2xl font-bold text-(--color-text) mb-4">
            Dashboard ready for content
          </h2>
          <p className="text-(--color-body) max-w-md mx-auto leading-relaxed">
            More statistics, charts, and insights will be added here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
