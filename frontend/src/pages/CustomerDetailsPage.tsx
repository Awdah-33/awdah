import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import { mockVehicles } from '../data/mockData';

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

  const savedVehicles = JSON.parse(
    localStorage.getItem('rajaa_vehicles') || '[]'
  );

  const vehiclesMap = new Map<any, any>();

  [...savedVehicles, ...mockVehicles].forEach((vehicle: any) => {
    if (vehicle.customerId === customer.id && !vehiclesMap.has(vehicle.id)) {
      vehiclesMap.set(vehicle.id, vehicle);
    }
  });

  let customerVehicles = Array.from(vehiclesMap.values());

  if (customerVehicles.length === 0 && customer.plateNumber) {
    customerVehicles = [{
      id: 'customer-main-vehicle',
      brand: customer.vehicleBrand,
      plateNumber: customer.plateNumber,
      vehicleSize: customer.vehicleSize,
    }];
  }

  return (
    <>
      <PageHeader title="تفاصيل العميل" subtitle={customer.fullName} />

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><strong>الاسم:</strong> {customer.fullName}</div>
          <div><strong>الجوال:</strong> {customer.phone}</div>
          <div>
            <strong>العضوية:</strong>{' '}
            {membershipLabels[customer.membershipTier] || 'بدون عضوية'}
          </div>
          <div>
            <strong>الغسلات المؤهلة:</strong>{' '}
            {customer.eligibleWashesCount ?? 0}
          </div>
          <div>
            <strong>الغسلات المجانية:</strong>{' '}
            {customer.freeWashesAvailable ?? 0}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>
          سيارات العميل ({customerVehicles.length})
        </h3>

        {customerVehicles.length === 0 ? (
          <p>لا توجد سيارات مسجلة لهذا العميل.</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {customerVehicles.map((vehicle: any, index: number) => (
              <div
                key={vehicle.id ?? index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                <div>
                  <strong>السيارة:</strong>{' '}
                  {vehicle.brand || vehicle.vehicleBrand || '-'}
                  {vehicle.model ? ` ${vehicle.model}` : ''}
                </div>

                <div>
                  <strong>رقم اللوحة:</strong>{' '}
                  {vehicle.plateNumber || '-'}
                </div>

                <div>
                  <strong>الحجم:</strong>{' '}
                  {vehicleSizeLabels[vehicle.vehicleSize] ||
                    vehicleSizeLabels[vehicle.size] ||
                    vehicle.vehicleSize ||
                    vehicle.size ||
                    '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('customers')}
      >
        العودة للعملاء
      </button>
    </>
  );
}
