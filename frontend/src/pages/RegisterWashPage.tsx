import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import {
  mockCustomers,
  mockServices,
  mockVehicles,
  membershipTierLabels,
  paymentMethodLabels,
} from '../data/mockData';
import type { Customer, PaymentMethod, Service, WashSuccess } from '../types';
import { calculateWashPreview, formatCurrency } from '../utils/loyalty';

export function RegisterWashPage() {
  const cameFromCustomerProfile =
    sessionStorage.getItem('washFromCustomerProfile') === '1';

  const savedCustomers = JSON.parse(localStorage.getItem('rajaa_customers') || '[]');
  const savedVehicles = JSON.parse(localStorage.getItem('rajaa_vehicles') || '[]');
  const allCustomers: any[] = [...savedCustomers, ...mockCustomers];
  const allVehicles: any[] = [...savedVehicles, ...mockVehicles];
const { navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  const [quickCustomer, setQuickCustomer] = useState({
    fullName: '',
    phone: '',
    brand: '',
    plateNumber: '',
    vehicleSize: 'medium',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [useFreeWash, setUseFreeWash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<WashSuccess | null>(null);

  useEffect(() => {
    const customerId = sessionStorage.getItem('washCustomerId');
    if (!customerId) return;

    const customer = allCustomers.find(
      (c: any) => String(c.id) === customerId
    );

    if (customer) {
      setSelectedCustomer(customer as any);
      setSearchQuery('');
    }

    sessionStorage.removeItem('washCustomerId');
  }, []);



  const searchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query || query.length < 2) return [];
    return allCustomers.filter(
      (customer) =>
        customer.fullName.includes(query) ||
        customer.phone.includes(query) ||
        allVehicles.some(
          (v) =>
            v.customerId === customer.id &&
            (`${v.plateNumber} ${v.plateLetters}`.includes(query) ||
              v.plateNumber.includes(query)),
        ),
    );
  }, [searchQuery]);

  const customerVehicles = useMemo(() => {
    if (!selectedCustomer) return [];
    return allVehicles.filter((v) => v.customerId === selectedCustomer.id);
  }, [selectedCustomer]);

  const selectedServices = useMemo(
    () => mockServices.filter((s) => selectedServiceIds.includes(s.id)),
    [selectedServiceIds],
  );

  const preview = useMemo(() => {
    if (!selectedCustomer || selectedServices.length === 0) return null;
    return calculateWashPreview(selectedCustomer, selectedServices, useFreeWash);
  }, [selectedCustomer, selectedServices, useFreeWash]);

  function selectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setSearchQuery('');
    const vehicles = mockVehicles.filter((v) => v.customerId === customer.id);
    setSelectedVehicleId(vehicles[0]?.id ?? null);
    setSelectedServiceIds([]);
    setUseFreeWash(false);
  }

  function toggleService(service: Service) {
    setSelectedServiceIds((ids) =>
      ids.includes(service.id) ? ids.filter((id) => id !== service.id) : [...ids, service.id],
    );
    setUseFreeWash(false);
  }

  function handleConfirm() {
    if (!selectedCustomer || !selectedVehicleId || selectedServices.length === 0 || !preview) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      let updatedEligibleWashesCount =
      selectedCustomer?.eligibleWashesCount ?? 0;

    let updatedMembershipTier =
      selectedCustomer?.membershipTier ?? 'none';

    const washIsLoyaltyEligible = selectedServices.some(
      (service: any) => service.loyaltyEligible === true
    );

    if (washIsLoyaltyEligible && selectedCustomer) {
      updatedEligibleWashesCount += 1;

      if (updatedEligibleWashesCount >= 20) {
        updatedMembershipTier = 'diamond';
      } else if (updatedEligibleWashesCount >= 15) {
        updatedMembershipTier = 'gold';
      } else if (updatedEligibleWashesCount >= 10) {
        updatedMembershipTier = 'silver';
      } else if (updatedEligibleWashesCount >= 5) {
        updatedMembershipTier = 'bronze';
      } else {
        updatedMembershipTier = 'none';
      }

      const savedCustomers = JSON.parse(
        localStorage.getItem('rajaa_customers') || '[]'
      );

      const updatedCustomers = savedCustomers.map((customer: any) =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              eligibleWashesCount: useFreeWash ? (selectedCustomer?.eligibleWashesCount ?? 0) : updatedEligibleWashesCount,
              membershipTier: useFreeWash ? (selectedCustomer?.membershipTier ?? 'none') : updatedMembershipTier,
              freeWashesAvailable:
          (selectedCustomer?.freeWashesAvailable ?? 0) +
          (
            updatedMembershipTier !== (selectedCustomer?.membershipTier ?? 'none') &&
            updatedMembershipTier !== 'none'
              ? 1
              : 0
          ),
            }
          : customer
      );

      localStorage.setItem(
        'rajaa_customers',
        JSON.stringify(updatedCustomers)
      );

      setSelectedCustomer({
        ...selectedCustomer,
        eligibleWashesCount: updatedEligibleWashesCount,
        membershipTier: updatedMembershipTier as any,
        freeWashesAvailable:
          (selectedCustomer?.freeWashesAvailable ?? 0) +
          (
            updatedMembershipTier !== (selectedCustomer?.membershipTier ?? 'none') &&
            updatedMembershipTier !== 'none'
              ? 1
              : 0
          ),
      });
    }

    const previousTier = selectedCustomer?.membershipTier ?? 'none';
    const nextEligibleCount =
      (selectedCustomer?.eligibleWashesCount ?? 0) +
      (preview.loyaltyEligible && !useFreeWash ? 1 : 0);

    let nextTier = previousTier;

    if (nextEligibleCount >= 20) nextTier = 'diamond';
    else if (nextEligibleCount >= 15) nextTier = 'gold';
    else if (nextEligibleCount >= 10) nextTier = 'silver';
    else if (nextEligibleCount >= 5) nextTier = 'bronze';
    else nextTier = 'none';

    const wasPromoted =
      preview.loyaltyEligible &&
      nextTier !== previousTier &&
      nextTier !== 'none';

    // استهلاك الغسلة المجانية بدون احتسابها ضمن الغسلات المؤهلة
    if (useFreeWash && selectedCustomer) {
      const remainingFreeWashes = Math.max(
        0,
        (selectedCustomer.freeWashesAvailable ?? 0) - 1
      );

      const savedCustomers = JSON.parse(
        localStorage.getItem('rajaa_customers') || '[]'
      );

      const exists = savedCustomers.some(
        (customer: any) => customer.id === selectedCustomer.id
      );

      const updatedCustomer = {
        ...selectedCustomer,
        freeWashesAvailable: remainingFreeWashes,
      };

      const updatedCustomers = exists
        ? savedCustomers.map((customer: any) =>
            customer.id === selectedCustomer.id
              ? updatedCustomer
              : customer
          )
        : [updatedCustomer, ...savedCustomers];

      localStorage.setItem(
        'rajaa_customers',
        JSON.stringify(updatedCustomers)
      );

      setSelectedCustomer(updatedCustomer);
    }


    const savedInvoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`;



    if (selectedCustomer) {


      const vehicle = allVehicles.find(


        (v: any) => v.id === selectedVehicleId


      );



      const invoices = JSON.parse(


        localStorage.getItem('rajaa_invoices') || '[]'


      );



      invoices.unshift({


        id: Date.now(),


        invoiceNumber: savedInvoiceNumber,


        customerName: selectedCustomer.fullName,


        vehiclePlate: vehicle?.plateNumber || '-',


        branchName: 'فرع الرياض',


        employeeName: 'محمد العتيبي',


        totalAmount: preview.totalAmount,


        paymentMethod,


        status: 'completed',


        createdAt: new Date().toISOString(),


        membershipTier: updatedMembershipTier


      });



      localStorage.setItem('rajaa_invoices', JSON.stringify(invoices));


    }



    setSuccess({


      invoiceNumber: savedInvoiceNumber,
        totalAmount: preview.totalAmount,
        membershipTier: updatedMembershipTier as any,
        eligibleWashesCount: updatedEligibleWashesCount,
        promoted: useFreeWash ? false : wasPromoted,
        freeWashEarned: useFreeWash ? false : wasPromoted,
      });
      setIsSubmitting(false);
    }, 600);
  }

  function saveQuickCustomer() {
    if (!quickCustomer.fullName.trim() || !quickCustomer.phone.trim()) {
      alert('أدخل اسم العميل ورقم الجوال');
      return;
    }

    const customerId = Date.now();
    const vehicleId = customerId + 1;

    const newCustomer: any = {
      id: customerId,
      fullName: quickCustomer.fullName.trim(),
      phone: quickCustomer.phone.trim(),
      membershipTier: 'none',
      eligibleWashesCount: 0,
      freeWashesAvailable: 0,
      vehiclesCount: 1,
    };

    const newVehicle: any = {
      id: vehicleId,
      customerId,
      plateNumber: quickCustomer.plateNumber.trim(),
      plateLetters: '',
      vehicleSize: quickCustomer.vehicleSize,
      brand: quickCustomer.brand.trim() || 'غير محدد',
      model: '',
      color: '',
    };

    const savedCustomers = JSON.parse(
      localStorage.getItem('rajaa_customers') || '[]'
    );
    const savedVehicles = JSON.parse(
      localStorage.getItem('rajaa_vehicles') || '[]'
    );

    localStorage.setItem(
      'rajaa_customers',
      JSON.stringify([newCustomer, ...savedCustomers])
    );

    localStorage.setItem(
      'rajaa_vehicles',
      JSON.stringify([newVehicle, ...savedVehicles])
    );

    setSelectedCustomer(newCustomer);
    setSelectedVehicleId(vehicleId);
    setSearchQuery('');
    setShowQuickAddCustomer(false);

    setQuickCustomer({
      fullName: '',
      phone: '',
      brand: '',
      plateNumber: '',
      vehicleSize: 'medium',
    });
  }

  function resetWash() {
    setSelectedCustomer(null);
    setSelectedVehicleId(null);
    setSelectedServiceIds([]);
    setPaymentMethod('cash');
    setUseFreeWash(false);
    setSuccess(null);
    setSearchQuery('');
  }

  const canConfirm =
    selectedCustomer &&
    selectedVehicleId &&
    selectedServices.length > 0 &&
    paymentMethod &&
    !isSubmitting;

  return (
    <>
      {cameFromCustomerProfile && (
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('washFromCustomerProfile');
            navigate('customer-details');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '0 0 8px 0',
            display: 'block',
            marginRight: 0,
            marginLeft: 'auto'
          }}
          aria-label="العودة لملف العميل"
        >
          →
        </button>
      )}

      <PageHeader
        title="تسجيل غسلة"
        subtitle="سجّل عملية الغسيل بسرعة — الهدف 20–30 ثانية"
      />

      {/* Customer search */}
      <section className="wash-section">
        <h3 className="wash-section-title">1. البحث عن العميل</h3>
        {!selectedCustomer ? (
          <>
            <button
              data-add-customer
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowQuickAddCustomer((open) => !open)}
              style={{ marginBottom: '12px', width: '100%' }}
            >
              + إضافة عميل جديد
            </button>

            {showQuickAddCustomer && (
              <div
                data-quick-add-customer-form
                className="card"
                style={{ padding: '16px', marginBottom: '14px' }}
              >
                <h3 style={{ marginTop: 0 }}>إضافة عميل جديد</h3>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <input
                    className="form-input"
                    placeholder="اسم العميل"
                    value={quickCustomer.fullName}
                    onChange={(e) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        fullName: e.target.value,
                      })
                    }
                  />

                  <input
                    className="form-input"
                    placeholder="رقم الجوال"
                    value={quickCustomer.phone}
                    onChange={(e) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        phone: e.target.value,
                      })
                    }
                  />

                  <input
                    className="form-input"
                    placeholder="نوع / ماركة السيارة"
                    value={quickCustomer.brand}
                    onChange={(e) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        brand: e.target.value,
                      })
                    }
                  />

                  <input
                    className="form-input"
                    placeholder="رقم اللوحة"
                    value={quickCustomer.plateNumber}
                    onChange={(e) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        plateNumber: e.target.value,
                      })
                    }
                  />

                  <select
                    className="form-input"
                    value={quickCustomer.vehicleSize}
                    onChange={(e) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        vehicleSize: e.target.value,
                      })
                    }
                  >
                    <option value="small">صغيرة</option>
                    <option value="medium">متوسطة</option>
                    <option value="large">كبيرة</option>
                  </select>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={saveQuickCustomer}
                    >
                      حفظ ومتابعة الغسلة
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowQuickAddCustomer(false)}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              type="search"
              className="form-input search-large"
              placeholder="رقم الجوال، الاسم، أو رقم اللوحة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    className="search-result-item"
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="search-result-name">{customer.fullName}</div>
                    <div className="search-result-phone">
                      {customer.phone} —{' '}
                      <span className={`badge badge-tier ${customer.membershipTier}`}>
                        {membershipTierLabels[customer.membershipTier]}
                      </span>{' '}
                      — {customer.vehicleCount} سيارات
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                لا توجد نتائج —{' '}
                <button type="button" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}>
                  + إضافة عميل جديد
                </button>
              </p>
            )}
          </>
        ) : (
          <div className="selected-customer-bar">
            <div>
              <strong>{selectedCustomer.fullName}</strong>
              <span style={{ marginInlineStart: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {selectedCustomer.phone}
              </span>
              <span className={`badge badge-tier ${selectedCustomer.membershipTier}`} style={{ marginInlineStart: '0.5rem' }}>
                {membershipTierLabels[selectedCustomer.membershipTier]}
              </span>
              {selectedCustomer.membershipStatus === 'paused' && (
                <span className="badge badge-warning" style={{ marginInlineStart: '0.375rem' }}>
                  مزايا متوقفة
                </span>
              )}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedCustomer(null)} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}>
              تغيير
            </button>
          </div>
        )}
      </section>

      {/* Vehicle selection */}
      {selectedCustomer && (
        <section className="wash-section">
          <h3 className="wash-section-title">2. اختيار السيارة</h3>
          <div className="selection-grid">
            {customerVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                className={`selection-card ${selectedVehicleId === vehicle.id ? 'selected' : ''}`}
                onClick={() => setSelectedVehicleId(vehicle.id)}
              >
                <div className="selection-card-title">
                  {vehicle.plateNumber} {vehicle.plateLetters}
                </div>
                <div className="selection-card-meta">
                  {vehicle.brand} {vehicle.model} — {vehicle.color}
                </div>
              </button>
            ))}
            <button type="button" className="selection-card" style={{ borderStyle: 'dashed' }}>
              <div className="selection-card-title">+ إضافة سيارة</div>
            </button>
          </div>
        </section>
      )}

      {/* Service selection */}
      {selectedCustomer && selectedVehicleId && (
        <section className="wash-section">
          <h3 className="wash-section-title">3. اختيار الخدمة</h3>
          <div className="selection-grid services">
            {mockServices.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`selection-card ${selectedServiceIds.includes(service.id) ? 'selected' : ''}`}
                onClick={() => toggleService(service)}
              >
                <div className="selection-card-title">{service.nameAr}</div>
                <div className="selection-card-price">{formatCurrency(service.basePrice)}</div>
                <span className={`badge ${service.loyaltyEligible ? 'badge-eligible' : 'badge-not-eligible'}`}>
                  {service.loyaltyEligible ? 'مؤهل للولاء' : 'غير مؤهل للولاء'}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Summary & payment */}
      {preview && (
        <>
          <section className="wash-section">
            <h3 className="wash-section-title">4. ملخص العملية</h3>
            <div className="summary-panel">
              <div className="summary-row">
                <span>السعر الأساسي</span>
                <span>{formatCurrency(preview.subtotal)}</span>
              </div>
              {preview.discountPercentage > 0 && (
                <div className="summary-row">
                  <span>الخصم ({preview.discountPercentage}%)</span>
                  <span>- {formatCurrency(preview.discountAmount)}</span>
                </div>
              )}
              {useFreeWash && (
                <div className="summary-row">
                  <span>غسلة مجانية</span>
                  <span className="badge badge-success">مطبّقة</span>
                </div>
              )}
              <div className="summary-row total">
                <span>الإجمالي</span>
                <span>{formatCurrency(preview.totalAmount)}</span>
              </div>
            </div>

            {(selectedCustomer?.freeWashesAvailable ?? 0) > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={useFreeWash}
                  onChange={(e) => setUseFreeWash(e.target.checked)}
                />
                استخدام غسلة مجانية ({(selectedCustomer?.freeWashesAvailable ?? 0)} متاحة)
              </label>
            )}
          </section>

          <section className="wash-section">
            <h3 className="wash-section-title">5. طريقة الدفع</h3>
            <div className="payment-grid">
              {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {paymentMethodLabels[method]}
                </button>
              ))}
            </div>
          </section>

          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {isSubmitting ? 'جاري التسجيل...' : `تأكيد الغسلة — ${formatCurrency(preview.totalAmount)}`}
          </button>
        </>
      )}

      {/* Success modal */}
      {success && (
        <div className="success-overlay" role="dialog" aria-modal="true">
          <div className="success-modal">
            <h3>تم تسجيل الغسلة بنجاح</h3>
            <p className="success-detail">
              <strong>رقم الفاتورة:</strong> {success.invoiceNumber}
            </p>
            <p className="success-detail">
              <strong>المبلغ:</strong> {formatCurrency(success.totalAmount)}
            </p>
            <p className="success-detail">
              <strong>العضوية:</strong>{' '}
              <span className={`badge badge-tier ${success.membershipTier}`}>
                {membershipTierLabels[success.membershipTier]}
              </span>
            </p>
            <p className="success-detail">
              <strong>الغسلات المؤهلة:</strong> {success.eligibleWashesCount}
            </p>
            <div className="success-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (success) {
                    sessionStorage.setItem(
                      'latestInvoice',
                      JSON.stringify(success)
                    );
                  }
                  navigate('invoice-details');
                }}
              >
                عرض الفاتورة
              </button>
              <button type="button" className="btn btn-secondary">
                إرسال الفاتورة
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetWash}>
                تسجيل غسلة جديدة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
