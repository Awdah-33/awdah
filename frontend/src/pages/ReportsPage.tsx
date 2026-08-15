import { PageHeader } from '../components/PageHeader';
import { paymentMethodLabels } from '../data/mockData';
import { formatCurrency } from '../utils/loyalty';

const chartHeights = [45, 62, 38, 75, 55, 88, 70];


export function ReportsPage() {
  const invoices: any[] = JSON.parse(
    localStorage.getItem('rajaa_invoices') || '[]'
  );

  const washes: any[] = JSON.parse(
    localStorage.getItem('rajaa_washes') || '[]'
  );

  const customers: any[] = JSON.parse(
    localStorage.getItem('rajaa_customers') || '[]'
  );

  const today = new Date().toDateString();

  const todayInvoices = invoices.filter(
    (x) => x.createdAt && new Date(x.createdAt).toDateString() === today
  );

  const todayWashes = washes.filter(
    (x) => x.createdAt && new Date(x.createdAt).toDateString() === today
  );

  const newCustomers = customers.filter((x) => {
    const id = Number(x.id);
    return id > 1000000000000 &&
      new Date(id).toDateString() === today;
  });

  const stats = {
    todayRevenue: todayInvoices.reduce(
      (sum, x) => sum + Number(x.totalAmount || 0),
      0
    ),
    todayWashes: todayWashes.length,
    newCustomers: newCustomers.length,
    activeMembers: customers.filter(
      (x) => x.membershipTier && x.membershipTier !== 'none'
    ).length,
  };

  const paymentTotals = {
    cash: 0,
    card: 0,
    transfer: 0,
    other: 0,
  };

  todayInvoices.forEach((invoice) => {
    const method = invoice.paymentMethod;

    if (method === 'cash') paymentTotals.cash += Number(invoice.totalAmount || 0);
    else if (method === 'card') paymentTotals.card += Number(invoice.totalAmount || 0);
    else if (method === 'transfer') paymentTotals.transfer += Number(invoice.totalAmount || 0);
    else paymentTotals.other += Number(invoice.totalAmount || 0);
  });

  const totalPayments =
    paymentTotals.cash +
    paymentTotals.card +
    paymentTotals.transfer +
    paymentTotals.other;

  const paymentBreakdown = [
    { method: 'cash' as const, amount: paymentTotals.cash },
    { method: 'card' as const, amount: paymentTotals.card },
    { method: 'transfer' as const, amount: paymentTotals.transfer },
    { method: 'other' as const, amount: paymentTotals.other },
  ].map((item) => ({
    ...item,
    percentage: totalPayments > 0
      ? Math.round((item.amount / totalPayments) * 100)
      : 0,
  }));

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
