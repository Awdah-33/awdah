# تصميم قاعدة البيانات
## منصة رجعة | Rajaa

## 1. الهدف

قاعدة البيانات في رجعة يجب أن تدعم:

- تعدد المغاسل Multi-Tenant
- تعدد الفروع
- العملاء
- السيارات
- الخدمات
- الفواتير
- الولاء
- الإحالات
- الموظفين والصلاحيات
- الاشتراكات
- سجلات المراجعة

قاعدة البيانات المقترحة:

PostgreSQL

---

## 2. القاعدة الأساسية

كل البيانات التشغيلية يجب أن ترتبط بـ:

`car_wash_id`

الهدف:

- فصل بيانات كل مغسلة
- منع أي مغسلة من رؤية بيانات مغسلة أخرى
- تسهيل التوسع لاحقًا

---

## 3. جدول car_washes

يمثل كل مغسلة مشتركة في رجعة.

الحقول:

- id
- name
- commercial_name
- phone
- email
- logo_url
- tax_number
- country
- city
- address
- status
- created_at
- updated_at

الحالات:

- active
- suspended
- inactive

---

## 4. جدول branches

يمثل فروع المغسلة.

الحقول:

- id
- car_wash_id
- name
- phone
- city
- address
- latitude
- longitude
- status
- created_at
- updated_at

كل فرع ينتمي إلى مغسلة واحدة.

---

## 5. جدول users

يمثل مستخدمي النظام.

مثل:

- صاحب المغسلة
- المدير
- الموظف

الحقول:

- id
- car_wash_id
- branch_id
- name
- phone
- email
- password_hash
- role
- preferred_language
- status
- last_login_at
- created_at
- updated_at

الأدوار:

- owner
- manager
- employee

---

## 6. جدول customers

يمثل عملاء المغسلة.

الحقول:

- id
- car_wash_id
- full_name
- phone
- email
- referral_code
- referred_by_customer_id
- status
- notes
- created_at
- updated_at

ملاحظات:

- رقم الجوال يجب أن يكون قابلًا للبحث بسرعة.
- بيانات العميل لا تتم ترجمتها.
- العميل مرتبط بمغسلة واحدة.

---

## 7. جدول vehicles

يمثل سيارات العملاء.

الحقول:

- id
- car_wash_id
- customer_id
- plate_number
- plate_letters
- vehicle_type
- vehicle_size
- brand
- model
- color
- status
- created_at
- updated_at

أحجام السيارات:

- small
- medium
- large

يمكن للعميل ربط عدة سيارات.

النسخة الأولى تدعم 3 سيارات على الأقل لكل عميل.

---

## 8. جدول services

يمثل خدمات المغسلة.

الحقول:

- id
- car_wash_id
- name_ar
- name_en
- name_ur
- description
- base_price
- loyalty_eligible
- service_type
- status
- created_at
- updated_at

أنواع الخدمات المقترحة:

- exterior
- exterior_interior
- vip
- additional

---

## 9. جدول membership_levels

يمثل مستويات العضوية.

الحقول:

- id
- car_wash_id
- name
- required_washes
- discount_percentage
- free_wash_reward
- sort_order
- status
- created_at
- updated_at

المستويات الافتراضية:

Bronze:
- 5 غسلات
- خصم 5%

Silver:
- 10 غسلات
- خصم 10%

Gold:
- 15 غسلة
- خصم 15%

Diamond:
- 20 غسلة
- خصم 20%

---

## 10. جدول customer_memberships

يمثل عضوية العميل الحالية.

الحقول:

- id
- car_wash_id
- customer_id
- membership_level_id
- eligible_washes_count
- discount_percentage
- activated_at
- last_eligible_visit_at
- benefits_expire_at
- reminder_sent_at
- status
- created_at
- updated_at

الحالات:

- active
- paused
- inactive

إذا مر 60 يومًا بدون زيارة مؤهلة:

يتم إيقاف مزايا العضوية مؤقتًا.

---

## 11. جدول invoices

يمثل الفواتير.

الحقول:

- id
- car_wash_id
- branch_id
- customer_id
- vehicle_id
- employee_id
- invoice_number
- subtotal
- discount_amount
- total_amount
- payment_method
- status
- idempotency_key
- cancelled_at
- cancelled_by
- cancellation_reason
- created_at
- updated_at

طرق الدفع:

- cash
- card
- transfer
- other

الحالات:

- completed
- cancelled

مهم:

لا يتم حذف الفاتورة نهائيًا.

---

## 12. جدول invoice_items

يمثل الخدمات الموجودة داخل الفاتورة.

الحقول:

- id
- invoice_id
- service_id
- service_name
- quantity
- unit_price
- discount_amount
- total_price
- loyalty_eligible
- created_at
- updated_at

يتم حفظ اسم الخدمة وسعرها وقت إنشاء الفاتورة.

السبب:

حتى لو تغير سعر الخدمة لاحقًا، تبقى الفاتورة القديمة صحيحة تاريخيًا.

---

## 13. جدول loyalty_transactions

يمثل كل حركة في نظام الولاء.

الحقول:

- id
- car_wash_id
- customer_id
- invoice_id
- transaction_type
- value
- previous_level_id
- new_level_id
- notes
- created_at

أنواع الحركة:

- eligible_wash
- promotion
- reactivation
- cancellation
- manual_adjustment

---

## 14. جدول free_washes

يمثل الغسلات المجانية.

الحقول:

- id
- car_wash_id
- customer_id
- source_type
- source_id
- status
- issued_at
- used_at
- invoice_id
- expires_at
- created_at
- updated_at

الحالات:

- available
- used
- cancelled
- expired

---

## 15. جدول referrals

يمثل الإحالات.

الحقول:

- id
- car_wash_id
- referrer_customer_id
- referred_customer_id
- referral_code
- status
- qualifying_invoice_id
- reward_type
- reward_value
- rewarded_at
- created_at
- updated_at

الحالات:

- pending
- qualified
- rewarded
- cancelled

لا يتم منح المكافأة إلا بعد:

1. تسجيل العميل الجديد
2. تنفيذ أول غسلة مؤهلة

---

## 16. جدول car_wash_settings

يمثل إعدادات كل مغسلة.

الحقول:

- id
- car_wash_id
- default_language
- inactivity_days
- inactivity_reminder_days
- referral_reward_type
- referral_reward_value
- invoice_language
- timezone
- currency
- created_at
- updated_at

الإعدادات الافتراضية:

- inactivity_days = 60
- inactivity_reminder_days = 10
- currency = SAR

---

## 17. جدول audit_logs

يمثل سجل العمليات المهمة داخل النظام.

الحقول:

- id
- car_wash_id
- user_id
- action
- entity_type
- entity_id
- old_values
- new_values
- ip_address
- user_agent
- created_at

يتم تسجيل عمليات مثل:

- تسجيل الدخول
- تعديل الأسعار
- إلغاء فاتورة
- تعديل العضوية
- تعديل صلاحيات موظف
- تغيير الإعدادات

---

## 18. جدول subscriptions

يمثل اشتراك المغسلة في رجعة.

الحقول:

- id
- car_wash_id
- plan_name
- billing_cycle
- amount
- start_date
- renewal_date
- trial_ends_at
- status
- created_at
- updated_at

الحالات:

- trial
- active
- past_due
- cancelled
- suspended

---

## 19. جدول subscription_invoices

يمثل فواتير اشتراك رجعة.

الحقول:

- id
- car_wash_id
- subscription_id
- invoice_number
- amount
- status
- payment_method
- paid_at
- created_at
- updated_at

---

## 20. العلاقات الأساسية

car_washes يرتبط بـ:

- branches
- users
- customers
- vehicles
- services
- membership_levels
- customer_memberships
- invoices
- loyalty_transactions
- free_washes
- referrals
- car_wash_settings
- subscriptions
- subscription_invoices
- audit_logs

customers يرتبط بـ:

- vehicles
- customer_memberships
- invoices
- loyalty_transactions
- free_washes
- referrals

invoices يرتبط بـ:

- invoice_items
- customer
- vehicle
- branch
- employee

---

## 21. الفهارس Indexes

يجب إنشاء Indexes على الحقول المهمة، خصوصًا:

- customers.phone
- vehicles.customer_id
- vehicles.plate_number
- invoices.invoice_number
- invoices.customer_id
- invoices.created_at
- invoices.car_wash_id
- loyalty_transactions.customer_id
- referrals.referral_code

ويفضل استخدام فهارس مركبة عند الحاجة.

مثال:

`car_wash_id + phone`

---

## 22. القيود Constraints

يجب تطبيق قيود لحماية البيانات.

أمثلة:

- invoice_number فريد داخل كل car_wash_id
- referral_code فريد داخل كل car_wash_id
- discount_percentage بين 0 و100
- total_amount لا يكون سالبًا
- required_washes لا يكون سالبًا

---

## 23. عدم الحذف النهائي

لا يتم حذف البيانات الحساسة مباشرة.

يفضل استخدام:

- status
- archived_at

خصوصًا في:

- العملاء
- الموظفين
- الخدمات
- الفروع

---

## 24. الفواتير التاريخية

أي تغيير في:

- اسم الخدمة
- السعر
- الخصم
- إعدادات العضوية

لا يجب أن يغير الفواتير القديمة.

الفاتورة تحفظ بياناتها كما كانت وقت إنشائها.

---

## 25. Database Transactions

إنشاء الفاتورة يجب أن يتم داخل Transaction واحدة.

تشمل العملية:

1. إنشاء invoice
2. إنشاء invoice_items
3. تحديث الولاء
4. تحديث العضوية
5. إنشاء المكافأة إن وجدت
6. تحديث الإحالة إن وجدت

إذا فشل أي جزء:

يتم Rollback للعملية كاملة.

---

## 26. منع تكرار الفاتورة

يجب استخدام:

`idempotency_key`

عند تسجيل الغسلة.

الهدف منع إنشاء فاتورتين إذا:

- ضغط الموظف مرتين
- ضعف الإنترنت
- أعاد التطبيق إرسال الطلب

---

## 27. Tenant Isolation

هذه من أهم قواعد النظام.

أي استعلام على البيانات التشغيلية يجب أن يكون مرتبطًا بـ:

`car_wash_id`

مثال غير صحيح:

SELECT * FROM customers;

مثال صحيح منطقيًا:

SELECT * FROM customers WHERE car_wash_id = current_car_wash_id;

---

## 28. البيانات الحساسة

كلمات المرور لا تحفظ كنص صريح.

يتم استخدام Password Hashing آمن.

كما يجب حماية البيانات الحساسة الأخرى حسب الحاجة.

---

## 29. النسخ الاحتياطية

يجب دعم:

- Backup يومي
- الاحتفاظ بعدة نسخ
- اختبار Restore بشكل دوري

لا يكفي وجود نسخة احتياطية.

يجب التأكد أنها قابلة للاستعادة.

---

## 30. قابلية التوسع

التصميم يجب أن يسمح مستقبلًا بإضافة:

- نقاط الولاء
- كوبونات
- حجوزات
- محافظ رقمية
- تكامل نقاط البيع
- تطبيق العميل
- مخزون
- خدمات سيارات إضافية

بدون إعادة تصميم النظام بالكامل.

---

## 31. مسؤولية الحسابات

الخادم Backend هو المسؤول عن الحسابات.

الواجهة Frontend لا تحدد:

- الخصم النهائي
- السعر النهائي
- مستوى العضوية
- عدد الغسلات المؤهلة
- الترقية

كل ذلك يتم حسابه في الخادم.

---

## الخلاصة

قاعدة بيانات رجعة يجب أن تكون:

- Multi-Tenant
- آمنة
- دقيقة
- قابلة للتوسع
- تحفظ التاريخ
- تمنع تكرار العمليات
- تدعم الولاء والإحالات والفواتير

والقاعدة الأساسية:

**كل مغسلة ترى بياناتها فقط، وكل عملية مالية أو عملية ولاء يجب أن تكون قابلة للتتبع والمراجعة.**