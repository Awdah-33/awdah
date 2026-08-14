import { useState } from 'react';
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

  const [savedVehicles, setSavedVehicles] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rajaa_vehicles') || '[]');
    } catch {
      return [];
    }
  });

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    plateNumber: '',
    vehicleSize: 'medium',
  });

  if (!customer) {

  return (
      <>
        <PageHeader title="تفاصيل العميل" subtitle="بيانات العميل" />
        <div className="card" style={{ padding: 20 }}>
          <p>لا يوجد عميل محدد.</p>
          <button className="btn btn-secondary" onClick={() => navigate('customers')}>
            العودة للعملاء
          </button>
        </div>
      </>
    );
  }

  function deleteVehicle(vehicleId: any) {
    const ok = window.confirm('هل تريد حذف هذه السيارة؟');
    if (!ok) return;

    const updated = savedVehicles.filter((vehicle: any) => vehicle.id !== vehicleId);
    localStorage.setItem('rajaa_vehicles', JSON.stringify(updated));
    setSavedVehicles(updated);
  }

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

  function addVehicle() {
    if (!vehicleForm.brand.trim() || !vehicleForm.plateNumber.trim()) {
      alert('أدخل نوع السيارة ورقم اللوحة');
      return;
    }

    const newVehicle = {
      id: Date.now(),
      customerId: customer.id,
      brand: vehicleForm.brand.trim(),
      model: '',
      plateNumber: vehicleForm.plateNumber.trim(),
      plateLetters: '',
      vehicleSize: vehicleForm.vehicleSize,
      color: '',
    };

    const updated = [newVehicle, ...savedVehicles];

    localStorage.setItem('rajaa_vehicles', JSON.stringify(updated));
    setSavedVehicles(updated);

    setVehicleForm({
      brand: '',
      plateNumber: '',
      vehicleSize: 'medium',
    });

    setShowAddVehicle(false);
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
          <div><strong>الغسلات المؤهلة:</strong> {customer.eligibleWashesCount ?? 0}</div>
          <div><strong>الغسلات المجانية:</strong> {customer.freeWashesAvailable ?? 0}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0 }}>
            سيارات العميل ({customerVehicles.length})
          </h3>

          <button
            className="btn btn-primary"
            onClick={() => setShowAddVehicle(!showAddVehicle)}
          >
            + إضافة سيارة
          </button>
        </div>

        {showAddVehicle && (
          <div
            style={{
              display: 'grid',
              gap: 10,
              padding: 14,
              marginBottom: 16,
              border: '1px solid #e5e7eb',
              borderRadius: 10,
            }}
          >
            <input
              className="form-input"
              placeholder="نوع / ماركة السيارة"
              value={vehicleForm.brand}
              onChange={(e) =>
                setVehicleForm({ ...vehicleForm, brand: e.target.value })
              }
            />

            <input
              className="form-input"
              placeholder="رقم اللوحة"
              value={vehicleForm.plateNumber}
              onChange={(e) =>
                setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })
              }
            />

            <select
              className="form-input"
              value={vehicleForm.vehicleSize}
              onChange={(e) =>
                setVehicleForm({ ...vehicleForm, vehicleSize: e.target.value })
              }
            >
              <option value="small">صغيرة</option>
              <option value="medium">متوسطة</option>
              <option value="large">كبيرة</option>
            </select>

            <button className="btn btn-primary" onClick={addVehicle}>
              حفظ السيارة
            </button>
          </div>
        )}

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
              </div>

              <div>
                <strong>رقم اللوحة:</strong>{' '}
                {vehicle.plateNumber || '-'}
              </div>

              <div>
                <strong>الحجم:</strong>{' '}
                {vehicleSizeLabels[vehicle.vehicleSize] ||
                  vehicle.vehicleSize ||
                  '-'}
              </div>

              {vehicle.id !== 'customer-main-vehicle' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => deleteVehicle(vehicle.id)}
                >
                  حذف السيارة
                </button>
              )}
            </div>
          ))}
        </div>
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
