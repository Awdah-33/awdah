import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../context/AppContext';
import { mockCustomers } from '../data/mockData';

type LocalCustomer = {
  id: number;
  fullName: string;
  phone: string;
  membershipTier?: string;
  vehiclesCount?: number;
  vehicleBrand?: string;
  plateNumber?: string;
  vehicleSize?: string;
};

export function CustomersPage() {
  const backToReports = sessionStorage.getItem('pageBackTo') === 'reports';
  const { navigate } = useApp();
  const [customers, setCustomers] = useState<LocalCustomer[]>(() => {
    const saved = JSON.parse(localStorage.getItem('rajaa_customers') || '[]');
    const savedVehicles = JSON.parse(localStorage.getItem('rajaa_vehicles') || '[]');

    return [
      ...saved.map((customer: any) => ({
        ...customer,
        plateNumber:
          customer.plateNumber ||
          savedVehicles.find(
            (vehicle: any) =>
              String(vehicle.customerId) === String(customer.id)
          )?.plateNumber ||
          '',
      })),
      ...mockCustomers
        .filter((c: any) => !saved.some((x: any) => x.id === c.id))
        .map((c: any) => ({
        id: c.id,
        fullName: c.fullName,
        phone: c.phone,
        membershipTier: c.membershipTier,
        vehiclesCount: c.vehiclesCount ?? 0,
      })),
    ];
  });

  function openCustomer(customer: any) {
    sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
    navigate('customer-details');
  }

  const [search, setSearch] = useState('');
  const [todayOnly] = useState(() => {
    const active = sessionStorage.getItem('customersTodayOnly') === '1';
    sessionStorage.removeItem('customersTodayOnly');
    return active;
  });
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    vehicleBrand: '',
    plateNumber: '',
    vehicleSize: 'medium',
  });

  const filteredCustomers = useMemo(() => {
    const q = search.trim();
    let result = customers;

    if (todayOnly) {
      const today = new Date().toDateString();
      result = result.filter((customer) => {
        const id = Number(customer.id);
        return id > 1000000000000 &&
          new Date(id).toDateString() === today;
      });
    }

    if (!q) return result;

    return result.filter(
      (customer) =>
        customer.fullName.includes(q) ||
        customer.phone.includes(q) ||
        (customer.plateNumber || '').includes(q)
    );
  }, [customers, search, todayOnly]);

  function saveCustomer() {
    if (!form.fullName.trim() || !form.phone.trim()) {
      alert('أدخل اسم العميل ورقم الجوال');
      return;
    }

    const newId = Date.now();

    const newCustomer = {
      id: newId,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      membershipTier: 'none',
      eligibleWashesCount: 0,
      freeWashesAvailable: 0,
      vehiclesCount: form.plateNumber.trim() ? 1 : 0,
      vehicleBrand: form.vehicleBrand.trim(),
      plateNumber: form.plateNumber.trim(),
      vehicleSize: form.vehicleSize,
    };

    setCustomers((current) => [newCustomer, ...current]);

    const savedCustomers = JSON.parse(localStorage.getItem('rajaa_customers') || '[]');
    localStorage.setItem(
      'rajaa_customers',
      JSON.stringify([newCustomer, ...savedCustomers])
    );

    if (form.plateNumber.trim()) {
      const savedVehicles = JSON.parse(localStorage.getItem('rajaa_vehicles') || '[]');

      const newVehicle = {
        id: Date.now() + 1,
        customerId: newId,
        plateNumber: form.plateNumber.trim(),
        plateLetters: '',
        vehicleSize: form.vehicleSize,
        brand: form.vehicleBrand.trim() || 'غير محدد',
        model: '',
        color: '',
      };

      localStorage.setItem(
        'rajaa_vehicles',
        JSON.stringify([newVehicle, ...savedVehicles])
      );
    }

    setForm({
      fullName: '',
      phone: '',
      vehicleBrand: '',
      plateNumber: '',
      vehicleSize: 'medium',
    });

    setShowAdd(false);
  }

  return (
    <>
      {backToReports && (
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginBottom: 12 }}
          onClick={() => {
            sessionStorage.removeItem('pageBackTo');
            navigate('reports');
          }}
        >
          → الرجوع إلى التقارير
        </button>
      )}

      <PageHeader title="العملاء" subtitle="إدارة بيانات العملاء والسيارات" />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو رقم الجوال أو اللوحة..."
          style={{
            flex: 1,
            padding: 12,
            border: '1px solid #d7dee8',
            borderRadius: 8,
          }}
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
        >
          + إضافة عميل جديد
        </button>
      </div>

      {showAdd && (
        <div
          className="card"
          style={{
            padding: 20,
            marginBottom: 20,
            display: 'grid',
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>إضافة عميل جديد</h3>

          <input
            placeholder="اسم العميل"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            placeholder="رقم الجوال"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="نوع / ماركة السيارة"
            value={form.vehicleBrand}
            onChange={(e) =>
              setForm({ ...form, vehicleBrand: e.target.value })
            }
          />

          <input
            placeholder="رقم اللوحة"
            value={form.plateNumber}
            onChange={(e) =>
              setForm({ ...form, plateNumber: e.target.value })
            }
          />

          <select
            value={form.vehicleSize}
            onChange={(e) =>
              setForm({ ...form, vehicleSize: e.target.value })
            }
          >
            <option value="small">صغيرة</option>
            <option value="medium">متوسطة</option>
            <option value="large">كبيرة</option>
          </select>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveCustomer}
            >
              حفظ العميل
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAdd(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الجوال</th>
                <th>العضوية</th>
                <th>الغسلات المؤهلة</th>
                <th>المجانية</th>
                <th>السيارات</th>
                <th>اللوحة</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
              key={customer.id}
              onClick={() => openCustomer(customer)}
              style={{ cursor: 'pointer' }}
            >
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.membershipTier || 'بدون عضوية'}</td>
                  <td>{(customer as any).eligibleWashesCount ?? 0}</td>
                  <td>{(customer as any).freeWashesAvailable ?? 0}</td>
                  <td>{customer.vehiclesCount ?? 0}</td>
                  <td>{customer.plateNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
