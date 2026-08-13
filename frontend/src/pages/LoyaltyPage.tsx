import { PageHeader } from '../components/PageHeader';
import { mockMembershipLevels } from '../data/mockData';

export function LoyaltyPage() {
  return (
    <>
      <PageHeader
        title="برنامج الولاء"
        subtitle="مستويات العضوية والقواعد — حسب مواصفات رجعة"
      />

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">قواعد الولاء</h3>
        <ul style={{ margin: 0, paddingInlineStart: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <li>الغسيل الخارجي فقط: غير مؤهل للولاء</li>
          <li>الغسيل الخارجي + الداخلي: مؤهل للولاء</li>
          <li>VIP: مؤهل للولاء</li>
          <li>عند الترقية: غسلة مجانية واحدة</li>
          <li>60 يوم بدون زيارة مؤهلة: توقف المزايا (مع تذكير قبل 10 أيام)</li>
          <li>أول غسلة مؤهلة جديدة: إعادة تفعيل المزايا تلقائيًا</li>
        </ul>
      </div>

      <div className="tier-grid">
        {mockMembershipLevels.map((level) => (
          <div key={level.tier} className={`tier-card ${level.tier}`}>
            <div className="tier-name">{level.nameAr}</div>
            <div className="tier-rules">
              بعد {level.requiredWashes} غسلات مؤهلة — خصم دائم {level.discountPercentage}%
            </div>
            <div className="tier-count">{level.customerCount} عميل</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 className="card-title">مكافآت الترقية</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          عند الانتقال إلى مستوى عضوية أعلى، يحصل العميل على غسلة مجانية واحدة.
        </p>
      </div>
    </>
  );
}
