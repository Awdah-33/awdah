import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import { paymentMethodLabels } from '../data/mockData';
import { formatCurrency } from '../utils/loyalty';



export function ReportsPage() {
  const { navigate } = useApp();
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('today');

  const invoices: any[] = JSON.parse(
    localStorage.getItem('rajaa_invoices') || '[]'
  );

  const washes: any[] = JSON.parse(
    localStorage.getItem('rajaa_washes') || '[]'
  );

  const customers: any[] = JSON.parse(
    localStorage.getItem('rajaa_customers') || '[]'
  );

  const now = new Date();
  const startDate = new Date(now);

  if (period === 'today') {
    startDate.setHours(0, 0, 0, 0);
  } else if (period === '7d') {
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);
  } else {
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 29);
  }

  const inPeriod = (date?: string) =>
    !!date && new Date(date) >= startDate && new Date(date) <= now;

  const periodInvoices = invoices.filter((x) => inPeriod(x.createdAt));
  const periodWashes = washes.filter((x) => inPeriod(x.createdAt));

  const periodCustomers = customers.filter((x) => {
    const id = Number(x.id);
    return id > 1000000000000 && new Date(id) >= startDate;
  });

  const stats = {
    todayRevenue: periodInvoices.reduce(
      (sum, x) => sum + Number(x.totalAmount || 0),
      0
    ),
    todayWashes: periodWashes.length,
    newCustomers: periodCustomers.length,
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

  periodInvoices.forEach((invoice) => {
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

  const chartDays = period === 'today' ? 1 : period === '7d' ? 7 : 30;

  const last7Days = Array.from({ length: chartDays }, (_, index) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((chartDays - 1) - index));

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const revenue = invoices
      .filter((invoice) => {
        if (!invoice.createdAt) return false;
        const date = new Date(invoice.createdAt);
        return date >= start && date < end;
      })
      .reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount || 0),
        0
      );

    return {
      label: start.toLocaleDateString('ar-SA', { weekday: 'short' }),
      revenue,
    };
  });

  const maxRevenue = Math.max(
    ...last7Days.map((day) => day.revenue),
    1
  );

  const chartHeights = last7Days.map((day) =>
    day.revenue > 0
      ? Math.max(8, Math.round((day.revenue / maxRevenue) * 100))
      : 2
  );

  const serviceCounts: Record<string, number> = {};

  periodWashes.forEach((wash) => {
    const services = Array.isArray(wash.services)
      ? wash.services
      : wash.serviceName
        ? [wash.serviceName]
        : [];

    services.forEach((service: any) => {
      const name =
        typeof service === 'string'
          ? service
          : service?.nameAr || service?.name || '';

      if (name) {
        serviceCounts[name] = (serviceCounts[name] || 0) + 1;
      }
    });
  });

  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <>
      <PageHeader title="التقارير" subtitle="إحصائيات الإيرادات والعمليات" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={period === 'today' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setPeriod('today')}
        >
          اليوم
        </button>

        <button
          type="button"
          className={period === '7d' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setPeriod('7d')}
        >
          آخر 7 أيام
        </button>

        <button
          type="button"
          className={period === '30d' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setPeriod('30d')}
        >
          آخر 30 يوم
        </button>
      </div>


      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            sessionStorage.setItem('pageBackTo', 'reports');
            sessionStorage.setItem('reportsPeriod', period);
            navigate('invoices');
          }}
        >
          <div className="stat-label">إيرادات الفترة</div>
          <div className="stat-value">{formatCurrency(stats.todayRevenue)}</div>
        </div>
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            sessionStorage.setItem('pageBackTo', 'reports');
            sessionStorage.setItem('reportsPeriod', period);
            navigate('today-washes');
          }}
        >
          <div className="stat-label">غسلات الفترة</div>
          <div className="stat-value">{stats.todayWashes}</div>
        </div>
        <div
          className="stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            sessionStorage.setItem('pageBackTo', 'reports');
            sessionStorage.setItem('customersReportPeriod', period);
            navigate('customers');
          }}
        >
          <div className="stat-label">عملاء جدد</div>
          <div className="stat-value">{stats.newCustomers}</div>
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
                title={`${last7Days[index]?.label || ''}: ${formatCurrency(last7Days[index]?.revenue || 0)}`}
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

          {topServices.length === 0 ? (
            <div className="settings-row">
              <span>لا توجد غسلات مسجلة بعد</span>
            </div>
          ) : (
            topServices.map(([name, count]) => (
              <div className="settings-row" key={name}>
                <span>{name}</span>
                <span className="settings-value">{count} غسلة</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
