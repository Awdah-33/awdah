import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';

const membershipLabels: Record<string, string> = {
  none: 'بدون عضوية',
  bronze: 'برونزية',
  silver: 'فضية',
  gold: 'ذهبية',
  diamond: 'ماسية',
};

const vehicleSizeLabels: Record<string, string> = {
  small: 'صغيرة',
  medium: 'متوسطة',
  large: 'كبيرة',
};

export function CustomerDetailsPage() {
  const { navigate } = useApp();

  let customer: any = null;

  try {
    customer = JSON.parse(sessionStorage.getItem('selectedCustomer') || 'null');
  } catch {
    customer = null;
  }

  if (!customer) {
    return (
      <>
        <PageHeader title="تفاصيل العميل" subtitle="بيانات العميل" />
        <div className="card" style={{ padding: 20 }}>
          <p>لا يوجد عميل محدد.</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('customers')}
          >
            العودة للعملاء
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="تفاصيل العميل" subtitle={customer.fullName} />

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><strong>الاسم:</strong> {customer.fullName}</div>
          <div><strong>الجوال:</strong> {customer.phone}</div>
          <div><strong>العضوية:</strong> {membershipLabels[customer.membershipTier] || 'بدون عضوية'}</div>
          <div><strong>الغسلات المؤهلة:</strong> {customer.eligibleWashesCount ?? 0}</div>
          <div><strong>الغسلات المجانية:</strong> {customer.freeWashesAvailable ?? 0}</div>
          <div><strong>السيارة:</strong> {customer.vehicleBrand || '-'}</div>
          <div><strong>رقم اللوحة:</strong> {customer.plateNumber || '-'}</div>
          <div><strong>حجم السيارة:</strong> {vehicleSizeLabels[customer.vehicleSize] || customer.vehicleSize || '-'}</div>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('customers')}
          >
            العودة للعملاء
          </button>
        </div>
      </div>
    </>
  );
}
