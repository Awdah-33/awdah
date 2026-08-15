import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';

export function TodayWashesPage() {
  const { navigate } = useApp();

  const washes: any[] = JSON.parse(
    localStorage.getItem('rajaa_washes') || '[]'
  );

  const backToReports =
    sessionStorage.getItem('pageBackTo') === 'reports';

  const reportPeriod =
    sessionStorage.getItem('reportsPeriod') || 'today';

  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);

  if (backToReports && reportPeriod === '7d') {
    startDate.setDate(startDate.getDate() - 6);
  } else if (backToReports && reportPeriod === '30d') {
    startDate.setDate(startDate.getDate() - 29);
  }

  const todayWashes = washes.filter((wash) => {
    if (!wash.createdAt) return false;
    const date = new Date(wash.createdAt);
    return date >= startDate && date <= now;
  });

  const periodLabel = !backToReports
    ? 'اليوم'
    : reportPeriod === '30d'
      ? 'آخر 30 يوم'
      : reportPeriod === '7d'
        ? 'آخر 7 أيام'
        : 'اليوم';

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
            if (backToReports) {
              sessionStorage.removeItem('pageBackTo');
              navigate('reports');
            } else {
              navigate('dashboard');
            }
          }}
        style={{ marginBottom: 12 }}
      >
        → الرجوع
      </button>

      <PageHeader
        title={backToReports ? 'غسلات الفترة' : 'غسلات اليوم'}
        subtitle={`الفترة: ${periodLabel} — إجمالي الغسلات: ${todayWashes.length}`}
      />

      <div style={{ display: 'grid', gap: 12 }}>
        {todayWashes.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>
            لا توجد غسلات مسجلة اليوم
          </div>
        ) : (
          todayWashes.map((wash: any) => (
            <div
              key={wash.id}
              className="card"
              style={{ padding: 16, cursor: 'pointer' }}
              onClick={() => {
                const invoices = JSON.parse(
                  localStorage.getItem('rajaa_invoices') || '[]'
                );

                const invoice = invoices.find(
                  (x: any) =>
                    x.vehiclePlate === wash.vehiclePlate &&
                    Math.abs(
                      new Date(x.createdAt).getTime() -
                      new Date(wash.createdAt).getTime()
                    ) < 120000
                );

                if (!invoice) {
                  alert('لم يتم العثور على فاتورة مرتبطة بهذه الغسلة');
                  return;
                }

                sessionStorage.setItem(
                  'latestInvoice',
                  JSON.stringify(invoice)
                );

                sessionStorage.setItem('invoiceBackTo', 'today-washes');
                navigate('invoice-details');
              }}
            >
              <div><strong>العميل:</strong> {wash.customerName || '-'}</div>
              <div><strong>اللوحة:</strong> {wash.vehiclePlate || '-'}</div>
              <div>
                <strong>الخدمة:</strong>{' '}
                {Array.isArray(wash.services)
                  ? wash.services.join(' + ')
                  : wash.serviceName || '-'}
              </div>
              <div>
                <strong>الإجمالي:</strong>{' '}
                {wash.freeWash ? 'غسلة مجانية' : `${Number(wash.totalAmount || 0).toFixed(2)} ر.س`}
              </div>
              <div>
                <strong>الوقت:</strong>{' '}
                {wash.createdAt
                  ? new Date(wash.createdAt).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
