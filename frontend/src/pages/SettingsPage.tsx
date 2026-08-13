import { PageHeader } from '../components/PageHeader';

export function SettingsPage() {
  return (
    <>
      <PageHeader title="الإعدادات" subtitle="إعدادات المغسلة والنظام" />

      <div className="settings-section card">
        <h3>بيانات المغسلة</h3>
        <div className="settings-row">
          <span>الاسم التجاري</span>
          <span className="settings-value">مغسلة النجوم</span>
        </div>
        <div className="settings-row">
          <span>الفرع</span>
          <span className="settings-value">فرع الرياض — الشمال</span>
        </div>
        <div className="settings-row">
          <span>العملة</span>
          <span className="settings-value">ريال سعودي (SAR)</span>
        </div>
        <div className="settings-row">
          <span>المنطقة الزمنية</span>
          <span className="settings-value">Asia/Riyadh</span>
        </div>
        <div className="settings-row">
          <span>اللغة الافتراضية</span>
          <span className="settings-value">العربية</span>
        </div>
      </div>

      <div className="settings-section card">
        <h3>إعدادات الولاء</h3>
        <div className="settings-row">
          <span>مدة عدم النشاط</span>
          <span className="settings-value">60 يوم</span>
        </div>
        <div className="settings-row">
          <span>تذكير قبل التوقف</span>
          <span className="settings-value">10 أيام</span>
        </div>
        <div className="settings-row">
          <span>مكافأة الترقية</span>
          <span className="settings-value">غسلة مجانية واحدة</span>
        </div>
      </div>

      <div className="settings-section card">
        <h3>إعدادات الإحالة</h3>
        <div className="settings-row">
          <span>حالة الإحالة</span>
          <span className="settings-value">مفعّلة</span>
        </div>
        <div className="settings-row">
          <span>نوع المكافأة</span>
          <span className="settings-value">غسلة مجانية</span>
        </div>
        <div className="settings-row">
          <span>شرط التأهيل</span>
          <span className="settings-value">أول غسلة مؤهلة للعميل الجديد</span>
        </div>
      </div>

      <div className="settings-section card">
        <h3>الاشتراك</h3>
        <div className="settings-row">
          <span>الخطة</span>
          <span className="settings-value">Growth</span>
        </div>
        <div className="settings-row">
          <span>الحالة</span>
          <span className="settings-value">
            <span className="badge badge-success">تجربة — 14 يوم</span>
          </span>
        </div>
        <div className="settings-row">
          <span>تاريخ التجديد</span>
          <span className="settings-value">2026-08-27</span>
        </div>
      </div>
    </>
  );
}
