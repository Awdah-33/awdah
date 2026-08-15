import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';

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
        <PageHeader title="تفاصيل الفاتورة" subtitle="بيانات الفاتورة" />

        <div className="card" style={{ padding: 20 }}>
          <p>لا توجد فاتورة محددة.</p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('invoices')}
          >
            العودة إلى الفواتير
          </button>
        </div>
      </>
    );
  }

  function sendWhatsApp() {
    const businessName =
      localStorage.getItem('rajaa_business_name') || 'المغسلة';

    const message = `مرحباً ${invoice.customerName || 'عميلنا'}

رقم الفاتورة: ${invoice.invoiceNumber}
السيارة / اللوحة: ${invoice.vehiclePlate || '-'}
الإجمالي: ${invoice.totalAmount ?? 0} ر.س

شكراً لاختيارك ${businessName}`;

    let customerPhone = invoice.customerPhone || '';

    if (!customerPhone) {
      try {
        const customers = JSON.parse(
          localStorage.getItem('rajaa_customers') || '[]'
        );

        const customer = customers.find(
          (c: any) => c.fullName === invoice.customerName
        );

        customerPhone = customer?.phone || '';
      } catch {
        customerPhone = '';
      }
    }

    const phone = String(customerPhone)
      .replace(/\D/g, '')
      .replace(/^0/, '966');

    if (!phone) {
      alert('رقم جوال العميل غير موجود');
      return;
    }

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('invoices')}
        className="btn btn-secondary"
        style={{ marginBottom: 12 }}
      >
        → الرجوع
      </button>

      <PageHeader title="تفاصيل الفاتورة" subtitle={invoice.invoiceNumber} />

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}</div>
          <div><strong>العميل:</strong> {invoice.customerName || '-'}</div>
          <div><strong>السيارة / اللوحة:</strong> {invoice.vehiclePlate || '-'}</div>
          <div><strong>الفرع:</strong> {invoice.branchName || '-'}</div>
          <div><strong>الموظف:</strong> {invoice.employeeName || '-'}</div>

          <div>
            <strong>طريقة الدفع:</strong>{' '}
            {paymentLabels[invoice.paymentMethod] || invoice.paymentMethod || '-'}
          </div>

          <div>
            <strong>العضوية:</strong>{' '}
            {membershipLabels[invoice.membershipTier] || 'بدون عضوية'}
          </div>

          <div>
            <strong>التاريخ:</strong>{' '}
            {invoice.createdAt
              ? new Date(invoice.createdAt).toLocaleString('ar-SA')
              : '-'}
          </div>

          <div style={{ fontSize: 22, marginTop: 10 }}>
            <strong>الإجمالي:</strong> {Number(invoice.totalAmount || 0).toFixed(2)} ر.س
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              طباعة الفاتورة
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={sendWhatsApp}
            >
              إرسال عبر واتساب
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
