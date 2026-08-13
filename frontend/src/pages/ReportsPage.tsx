import { PageHeader } from '../components/PageHeader';
import { mockDashboardStats, paymentMethodLabels } from '../data/mockData';
import { formatCurrency } from '../utils/loyalty';

const chartHeights = [45, 62, 38, 75, 55, 88, 70];

const paymentBreakdown = [
  { method: 'cash' as const, amount: 1240, percentage: 44 },
  { method: 'card' as const, amount: 980, percentage: 35 },
  { method: 'transfer' as const, amount: 420, percentage: 15 },
  { method: 'other' as const, amount: 207.5, percentage: 6 },
];

export function ReportsPage() {
  const stats = mockDashboardStats;

  return (
    <>
      <PageHeader title="التقارير" subtitle="إحصائيات الإيرادات والعمليات" />

      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-label">إيرادات اليوم</div>
          <div className="stat-value">{formatCurrency(stats.todayRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">غسلات اليوم</div>
          <div className="stat-value">{stats.todayWashes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">عملاء جدد</div>
          <div className="stat-value">{stats.newCustomers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">أعضاء نشطون</div>
          <div className="stat-value">{stats.activeMembers}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="card">
          <h3 className="card-title">الإيرادات — آخر 7 أيام</h3>
          <div className="chart-placeholder">
            {chartHeights.map((height, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${height}%` }}
                title={`اليوم ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">طرق الدفع</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الطريقة</th>
                  <th>المبلغ</th>
                  <th>النسبة</th>
                </tr>
              </thead>
              <tbody>
                {paymentBreakdown.map((item) => (
                  <tr key={item.method}>
                    <td>{paymentMethodLabels[item.method]}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">أفضل الخدمات</h3>
          <div className="settings-row">
            <span>غسيل خارجي + داخلي</span>
            <span className="settings-value">156 غسلة</span>
          </div>
          <div className="settings-row">
            <span>VIP</span>
            <span className="settings-value">42 غسلة</span>
          </div>
          <div className="settings-row">
            <span>غسيل خارجي</span>
            <span className="settings-value">89 غسلة</span>
          </div>
        </div>
      </div>
    </>
  );
}
