import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/loyalty';

const paymentLabels: Record<string, string> = {
  cash: 'نقدي',
  card: 'بطاقة',
};

const membershipLabels: Record<string, string> = {
  none: 'بدون عضوية',
  bronze: 'برونزية',
  silver: 'فضية',
  gold: 'ذهبية',
  diamond: 'ماسية',
};

export function InvoiceDetailsPage() {
  const { navigate } = useApp();

  let invoice: any = null;

  try {
    invoice = JSON.parse(sessionStorage.getItem('latestInvoice') || 'null');
  } catch {
    invoice = null;
  }

  if (!invoice) {
    return (
      <>
        <PageHeader title="تفاصيل الفاتورة" subtitle="عرض تفاصيل عملية الغسيل" />
        <div className="card" style={{ padding: 20 }}>
          <p>لا توجد فاتورة محددة.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('invoices')}
          >
            العودة إلى الفواتير
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="تفاصيل الفاتورة" subtitle={invoice.invoiceNumber} />

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}</div>
          <div><strong>العميل:</strong> {invoice.customerName || '-'}</div>
          <div><strong>السيارة / اللوحة:</strong> {invoice.vehiclePlate || '-'}</div>
          <div><strong>الفرع:</strong> {invoice.branchName || '-'}</div>
          <div><strong>الموظف:</strong> {invoice.employeeName || '-'}</div>
          <div><strong>طريقة الدفع:</strong> {paymentLabels[invoice.paymentMethod] || invoice.paymentMethod || '-'}</div>
          <div><strong>العضوية:</strong> {membershipLabels[invoice.membershipTier] || 'بدون عضوية'}</div>
          <div>
            <strong>التاريخ:</strong>{' '}
            {invoice.createdAt ? formatDate(invoice.createdAt) : '-'}
          </div>

          <hr />

          <div style={{ fontSize: '1.2rem' }}>
            <strong>الإجمالي:</strong>{' '}
            {formatCurrency(invoice.totalAmount ?? invoice.amount ?? 0)}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              طباعة الفاتورة
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('invoices')}
            >
              العودة إلى الفواتير
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
