import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
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
  const [customers, setCustomers] = useState<LocalCustomer[]>(
    mockCustomers.map((c: any) => ({
      id: c.id,
      fullName: c.fullName,
      phone: c.phone,
      membershipTier: c.membershipTier,
      vehiclesCount: c.vehiclesCount ?? 0,
    }))
  );

  const [search, setSearch] = useState('');
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
    if (!q) return customers;

    return customers.filter(
      (customer) =>
        customer.fullName.includes(q) ||
        customer.phone.includes(q) ||
        (customer.plateNumber || '').includes(q)
    );
  }, [customers, search]);

  function saveCustomer() {
    if (!form.fullName.trim() || !form.phone.trim()) {
      alert('أدخل اسم العميل ورقم الجوال');
      return;
    }

    setCustomers((current) => [
      {
        id: Date.now(),
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        membershipTier: 'none',
        vehiclesCount: form.plateNumber.trim() ? 1 : 0,
        vehicleBrand: form.vehicleBrand.trim(),
        plateNumber: form.plateNumber.trim(),
        vehicleSize: form.vehicleSize,
      },
      ...current,
    ]);

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
                <th>السيارات</th>
                <th>اللوحة</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.membershipTier || 'بدون عضوية'}</td>
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
