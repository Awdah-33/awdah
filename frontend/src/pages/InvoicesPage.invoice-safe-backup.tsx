import { PageHeader } from '../components/PageHeader';
import { mockInvoices, membershipTierLabels, paymentMethodLabels } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/loyalty';

export function InvoicesPage() {
  return (
    <>
      <PageHeader title="الفواتير" subtitle="عرض وإدارة الفواتير" />

      <div className="card desktop-table">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>التاريخ</th>
                <th>العميل</th>
                <th>السيارة</th>
                <th>المبلغ</th>
                <th>الدفع</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.createdAt)}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.vehiclePlate}</td>
                  <td>{formatCurrency(invoice.totalAmount)}</td>
                  <td>{paymentMethodLabels[invoice.paymentMethod]}</td>
                  <td>
                    <span className={`badge ${invoice.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                      {invoice.status === 'completed' ? 'مكتملة' : 'ملغاة'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-card-list">
        {mockInvoices.map((invoice) => (
          <div key={invoice.id} className="mobile-list-card">
            <div className="mobile-list-card-row">
              <span className="mobile-list-card-title">{invoice.invoiceNumber}</span>
              <span className={`badge ${invoice.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                {invoice.status === 'completed' ? 'مكتملة' : 'ملغاة'}
              </span>
            </div>
            <div className="mobile-list-card-row">
              <span>{invoice.customerName}</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="mobile-list-card-row">
              <span style={{ fontSize: '0.8rem' }}>{invoice.vehiclePlate}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {paymentMethodLabels[invoice.paymentMethod]} —{' '}
                <span className={`badge badge-tier ${invoice.membershipTier}`}>
                  {membershipTierLabels[invoice.membershipTier]}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
