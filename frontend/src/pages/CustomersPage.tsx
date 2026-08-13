import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockCustomers, membershipTierLabels } from '../data/mockData';
import { formatShortDate } from '../utils/loyalty';

export function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim();
    if (!query) return mockCustomers;
    return mockCustomers.filter(
      (c) => c.fullName.includes(query) || c.phone.includes(query),
    );
  }, [search]);

  return (
    <>
      <PageHeader title="العملاء" subtitle="إدارة وبحث العملاء" />

      <div className="form-group">
        <input
          type="search"
          className="form-input"
          placeholder="بحث بالاسم أو رقم الجوال..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card desktop-table">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الجوال</th>
                <th>العضوية</th>
                <th>السيارات</th>
                <th>آخر زيارة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className={`badge badge-tier ${customer.membershipTier}`}>
                      {membershipTierLabels[customer.membershipTier]}
                    </span>
                  </td>
                  <td>{customer.vehicleCount}</td>
                  <td>{customer.lastVisit ? formatShortDate(customer.lastVisit) : '—'}</td>
                  <td>
                    <span className={`badge ${customer.membershipStatus === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {customer.membershipStatus === 'active' ? 'نشط' : customer.membershipStatus === 'paused' ? 'متوقف' : 'غير نشط'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-card-list">
        {filtered.map((customer) => (
          <div key={customer.id} className="mobile-list-card">
            <div className="mobile-list-card-row">
              <span className="mobile-list-card-title">{customer.fullName}</span>
              <span className={`badge badge-tier ${customer.membershipTier}`}>
                {membershipTierLabels[customer.membershipTier]}
              </span>
            </div>
            <div className="mobile-list-card-row">
              <span>{customer.phone}</span>
              <span>{customer.vehicleCount} سيارات</span>
            </div>
            {customer.lastVisit && (
              <div className="mobile-list-card-row">
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  آخر زيارة: {formatShortDate(customer.lastVisit)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
