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
  const [editingVehicleId, setEditingVehicleId] = useState<any>(null);
  const [editVehicleForm, setEditVehicleForm] = useState({
    brand: '',
    plateNumber: '',
    vehicleSize: 'medium',
  });
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

  function startEditVehicle(vehicle: any) {
    setEditingVehicleId(vehicle.id);
    setEditVehicleForm({
      brand: vehicle.brand || vehicle.vehicleBrand || '',
      plateNumber: vehicle.plateNumber || '',
      vehicleSize: vehicle.vehicleSize || vehicle.size || 'medium',
    });
  }

  function saveVehicleEdit(vehicleId: any) {
    const updated = savedVehicles.map((vehicle: any) =>
      vehicle.id === vehicleId
        ? {
            ...vehicle,
            brand: editVehicleForm.brand.trim(),
            plateNumber: editVehicleForm.plateNumber.trim(),
            vehicleSize: editVehicleForm.vehicleSize,
          }
        : vehicle
    );

    localStorage.setItem('rajaa_vehicles', JSON.stringify(updated));
    setSavedVehicles(updated);
    setEditingVehicleId(null);
  }

  function deleteVehicle(vehicleId: any) {
    const ok = window.confirm('هل تريد حذف هذه السيارة؟');
    if (!ok) return;

    const updated = savedVehicles.filter((vehicle: any) => vehicle.id !== vehicleId);
    localStorage.setItem('rajaa_vehicles', JSON.stringify(updated));
    setSavedVehicles(updated);
  }

  let customerWashes: any[] = [];

  try {
    const washes = JSON.parse(localStorage.getItem('rajaa_washes') || '[]');
    customerWashes = washes.filter(
      (wash: any) =>
        wash.customerId === customer.id ||
        wash.customerName === customer.fullName
    );
  } catch {
    customerWashes = [];
  }

  let customerInvoices: any[] = [];

  try {
    const invoices = JSON.parse(localStorage.getItem('rajaa_invoices') || '[]');
    customerInvoices = invoices.filter(
      (invoice: any) => invoice.customerName === customer.fullName
    );
  } catch {
    customerInvoices = [];
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
              {editingVehicleId === vehicle.id ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  <input
                    className="form-input"
                    value={editVehicleForm.brand}
                    onChange={(e) =>
                      setEditVehicleForm({
                        ...editVehicleForm,
                        brand: e.target.value,
                      })
                    }
                    placeholder="ماركة السيارة"
                  />

                  <input
                    className="form-input"
                    value={editVehicleForm.plateNumber}
                    onChange={(e) =>
                      setEditVehicleForm({
                        ...editVehicleForm,
                        plateNumber: e.target.value,
                      })
                    }
                    placeholder="رقم اللوحة"
                  />

                  <select
                    className="form-input"
                    value={editVehicleForm.vehicleSize}
                    onChange={(e) =>
                      setEditVehicleForm({
                        ...editVehicleForm,
                        vehicleSize: e.target.value,
                      })
                    }
                  >
                    <option value="small">صغيرة</option>
                    <option value="medium">متوسطة</option>
                    <option value="large">كبيرة</option>
                  </select>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => saveVehicleEdit(vehicle.id)}
                    >
                      حفظ
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingVehicleId(null)}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}

              {vehicle.id !== 'customer-main-vehicle' && editingVehicleId !== vehicle.id && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 10, marginLeft: 8 }}
                    onClick={() => startEditVehicle(vehicle)}
                  >
                    تعديل السيارة
                  </button>

                  <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => deleteVehicle(vehicle.id)}
                >
                  حذف السيارة
                </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            sessionStorage.setItem('washCustomerId', String(customer.id));
            sessionStorage.setItem('washFromCustomerProfile', '1');
            navigate('register-wash');
          }}
        >
          تسجيل غسلة لهذا العميل
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('customers')}
        >
          العودة للعملاء
        </button>
      </div>

      <div style={{ height: 16 }} />

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>
          سجل الغسلات ({customerWashes.length})
        </h3>

        {customerWashes.length === 0 ? (
          <p>لا توجد غسلات مسجلة لهذا العميل.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {customerWashes.slice(0, 10).map((wash: any) => (
              <div
                key={wash.id}
                onClick={() => {
                  if (!wash.invoiceNumber) return;
                  const invoice = customerInvoices.find(
                    (i: any) => i.invoiceNumber === wash.invoiceNumber
                  );
                  if (!invoice) return;

                  sessionStorage.setItem('latestInvoice', JSON.stringify(invoice));
                  navigate('invoice-details');
                }}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 12,
                  cursor: wash.invoiceNumber ? 'pointer' : 'default',
                }}
              >
                <div><strong>اللوحة:</strong> {wash.vehiclePlate || '-'}</div>
                <div>
                  <strong>الخدمة:</strong>{' '}
                  {Array.isArray(wash.services) ? wash.services.join(' + ') : '-'}
                </div>
                <div>
                  <strong>الإجمالي:</strong>{' '}
                  {wash.freeWash ? 'غسلة مجانية' : `${wash.totalAmount ?? 0} ر.س`}
                </div>
                <div>
                  <strong>التاريخ:</strong>{' '}
                  {wash.createdAt
                    ? new Date(wash.createdAt).toLocaleString('ar-SA')
                    : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>
          فواتير العميل ({customerInvoices.length})
        </h3>

        {customerInvoices.length === 0 ? (
          <p>لا توجد فواتير لهذا العميل.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {customerInvoices.slice(0, 10).map((invoice: any) => (
              <div
                key={invoice.id || invoice.invoiceNumber}
                onClick={() => {
                  sessionStorage.setItem('latestInvoice', JSON.stringify(invoice));
                  navigate('invoice-details');
                }}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 12,
                  cursor: 'pointer',
                }}
              >
                <div>
                  <strong>رقم الفاتورة:</strong> {invoice.invoiceNumber}
                </div>
                <div>
                  <strong>الإجمالي:</strong> {invoice.totalAmount ?? 0} ر.س
                </div>
                <div>
                  <strong>اللوحة:</strong> {invoice.vehiclePlate || '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </>
  );
}
