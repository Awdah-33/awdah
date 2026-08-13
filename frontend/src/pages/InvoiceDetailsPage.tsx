import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';

export function InvoiceDetailsPage() {
  const { navigate } = useApp();

  let invoice: any = null;
  try {
    invoice = JSON.parse(sessionStorage.getItem('latestInvoice') || 'null');
  } catch {}

  return (
    <>
      <PageHeader title="تفاصيل الفاتورة" subtitle="عرض تفاصيل عملية الغسيل" />

      <div className="card" style={{ padding: '24px' }}>
        {invoice ? (
          <>
            <h2>{invoice.invoiceNumber}</h2>
            <p><strong>المبلغ:</strong> {invoice.amount ?? invoice.totalAmount ?? 0} ر.س</p>
            <p><strong>العضوية:</strong> {invoice.membershipTier ?? '-'}</p>
            <p><strong>الغسلات المؤهلة:</strong> {invoice.eligibleWashesCount ?? '-'}</p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('invoices')}
            >
              العودة إلى الفواتير
            </button>
          </>
        ) : (
          <>
            <p>لا توجد فاتورة محددة.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('invoices')}
            >
              العودة إلى الفواتير
            </button>
          </>
        )}
      </div>
    </>
  );
}
