import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import {
  mockServices,
  membershipTierLabels,
} from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/loyalty';

export function DashboardPage() {
  const { navigate } = useApp();
  const savedInvoices: any[] = JSON.parse(
    localStorage.getItem('rajaa_invoices') || '[]'
  );
  const savedWashes: any[] = JSON.parse(
    localStorage.getItem('rajaa_washes') || '[]'
  );
  const savedCustomers: any[] = JSON.parse(
    localStorage.getItem('rajaa_customers') || '[]'
  );

  const today = new Date().toDateString();
  const isToday = (date?: string) =>
    date ? new Date(date).toDateString() === today : false;

  const todayInvoices = savedInvoices.filter((x) => isToday(x.createdAt));
  const todayWashes = savedWashes.filter((x) => isToday(x.createdAt));

  const stats = {
    todayRevenue: todayInvoices.reduce(
      (sum, x) => sum + Number(x.totalAmount || 0),
      0
    ),
    todayWashes: todayWashes.length,
    totalCustomers: savedCustomers.length,
    activeMembers: savedCustomers.filter(
      (x) => x.membershipTier && x.membershipTier !== 'none'
    ).length,
    newCustomers: savedCustomers.filter(
      (x) => typeof x.id === 'number' &&
        new Date(x.id).toDateString() === today
    ).length,
  };

  const recentInvoices = savedInvoices.slice(0, 4);
  const topServices = mockServices.filter((s) => s.loyaltyEligible).slice(0, 3);

  return (
    <>
      <PageHeader
        title="لوحة التحكم"
        subtitle="نظرة سريعة على أداء المغسلة اليوم"
      />

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('register-wash')}
        style={{ marginBottom: 16 }}
      >
        + غسلة جديدة
      </button>


      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-label">إيرادات اليوم</div>
          <div className="stat-value">{formatCurrency(stats.todayRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">غسلات اليوم</div>
          <div className="stat-value">{stats.todayWashes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي العملاء</div>
          <div className="stat-value">{stats.totalCustomers.toLocaleString('ar-SA')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">أعضاء جدد اليوم</div>
          <div className="stat-value">{stats.newCustomers}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="card">
          <h3 className="card-title">أحدث الفواتير</h3>
          <div className="table-wrapper desktop-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>العميل</th>
                  <th>المبلغ</th>
                  <th>الوقت</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName}</td>
                    <td>{formatCurrency(invoice.totalAmount)}</td>
                    <td>{formatDate(invoice.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-card-list">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="mobile-list-card">
                <div className="mobile-list-card-row">
                  <span className="mobile-list-card-title">{invoice.invoiceNumber}</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="mobile-list-card-row">
                  <span>{invoice.customerName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(invoice.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">أفضل الخدمات</h3>
          <div className="selection-grid">
            {topServices.map((service) => (
              <div key={service.id} className="selection-card" style={{ cursor: 'default' }}>
                <div className="selection-card-title">{service.nameAr}</div>
                <div className="selection-card-price">{formatCurrency(service.basePrice)}</div>
                <span className={`badge ${service.loyaltyEligible ? 'badge-eligible' : 'badge-not-eligible'}`}>
                  {service.loyaltyEligible ? 'مؤهل للولاء' : 'غير مؤهل'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">مؤشر الولاء</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            {stats.newCustomers} عملاء جدد اليوم — {stats.newCustomers} عضو نشط في برنامج الولاء
          </p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['bronze', 'silver', 'gold', 'diamond'] as const).map((tier) => (
              <span key={tier} className={`badge badge-tier ${tier}`}>
                {membershipTierLabels[tier]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
