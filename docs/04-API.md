# تصميم واجهة البرمجة API
## منصة رجعة | Rajaa

## 1. الهدف

توفر API الخاصة بمنصة رجعة واجهة آمنة ومنظمة بين:

- Frontend
- Backend
- Database
- الخدمات الخارجية

الأسلوب المقترح:

REST API

تنسيق البيانات:

JSON

الاتصال:

HTTPS فقط

---

## 2. الرابط الأساسي

مثال أثناء التطوير:

`http://localhost:8000/api/v1`

وفي الإنتاج:

`https://api.example.com/api/v1`

يتم استبدال الدومين لاحقًا بعد اعتماد اسم ودومين المنصة رسميًا.

---

## 3. إصدار API

يجب تضمين رقم الإصدار في الرابط.

مثال:

`/api/v1`

الهدف:

إمكانية تطوير إصدارات مستقبلية بدون كسر التطبيقات القديمة.

---

## 4. Authentication

يتم استخدام نظام Token Authentication.

الاقتراح:

JWT أو Laravel Sanctum حسب قرار التنفيذ النهائي.

جميع الطلبات المحمية يجب أن تتأكد من:

- هوية المستخدم
- حالة المستخدم
- المغسلة التابعة له
- الفرع
- الصلاحيات

---

## 5. تسجيل الدخول

Endpoint:

`POST /api/v1/auth/login`

البيانات:

- email أو phone
- password

الاستجابة الناجحة تحتوي على:

- access_token
- user
- car_wash
- branch
- permissions

---

## 6. تسجيل الخروج

Endpoint:

`POST /api/v1/auth/logout`

يجب إبطال الجلسة أو الـ Token حسب طريقة المصادقة المستخدمة.

---

## 7. المستخدم الحالي

Endpoint:

`GET /api/v1/auth/me`

يعيد:

- بيانات المستخدم
- الدور
- الصلاحيات
- الفرع
- المغسلة
- اللغة المفضلة

---

## 8. العملاء

### قائمة العملاء

`GET /api/v1/customers`

يدعم:

- البحث بالاسم
- البحث برقم الجوال
- Pagination

---

### إنشاء عميل

`POST /api/v1/customers`

الحقول الأساسية:

- full_name
- phone
- email اختياري

---

### عرض عميل

`GET /api/v1/customers/{customer_id}`

يعيد:

- بيانات العميل
- السيارات
- العضوية
- عدد الغسلات المؤهلة
- الغسلات المجانية
- آخر الزيارات

---

### تعديل العميل

`PUT /api/v1/customers/{customer_id}`

---

## 9. البحث السريع عن العميل

Endpoint:

`GET /api/v1/customers/search`

يدعم البحث باستخدام:

- رقم الجوال
- الاسم
- رقم اللوحة عند الحاجة

هذا Endpoint مهم جدًا لشاشة تسجيل الغسلة.

يجب أن يكون سريعًا.

---

## 10. السيارات

### سيارات العميل

`GET /api/v1/customers/{customer_id}/vehicles`

---

### إضافة سيارة

`POST /api/v1/customers/{customer_id}/vehicles`

البيانات:

- plate_number
- plate_letters
- vehicle_size
- brand
- model
- color

---

### تعديل السيارة

`PUT /api/v1/vehicles/{vehicle_id}`

---

### تعطيل السيارة

`PATCH /api/v1/vehicles/{vehicle_id}/status`

لا يتم الحذف النهائي.

---

## 11. الخدمات

### قائمة الخدمات

`GET /api/v1/services`

---

### إنشاء خدمة

`POST /api/v1/services`

البيانات:

- name_ar
- name_en
- name_ur
- base_price
- loyalty_eligible
- service_type
- status

---

### تعديل خدمة

`PUT /api/v1/services/{service_id}`

---

### تغيير حالة الخدمة

`PATCH /api/v1/services/{service_id}/status`

---

## 12. الفروع

### قائمة الفروع

`GET /api/v1/branches`

### إنشاء فرع

`POST /api/v1/branches`

### عرض فرع

`GET /api/v1/branches/{branch_id}`

### تعديل فرع

`PUT /api/v1/branches/{branch_id}`

### تعطيل فرع

`PATCH /api/v1/branches/{branch_id}/status`

---

## 13. الموظفون

### قائمة الموظفين

`GET /api/v1/users`

### إنشاء موظف

`POST /api/v1/users`

### عرض موظف

`GET /api/v1/users/{user_id}`

### تعديل موظف

`PUT /api/v1/users/{user_id}`

### تعديل الصلاحيات

`PUT /api/v1/users/{user_id}/permissions`

### تعطيل موظف

`PATCH /api/v1/users/{user_id}/status`

---

## 14. معاينة عملية الغسيل

هذه من أهم العمليات في النظام.

Endpoint:

`POST /api/v1/washes/preview`

الواجهة ترسل فقط:

- customer_id
- vehicle_id
- service_ids

الخادم يقوم بحساب:

- الأسعار
- الخصم
- العضوية
- أهلية الولاء
- الغسلات المجانية المتاحة
- المبلغ المتوقع

مهم جدًا:

Frontend لا يرسل السعر النهائي.

---

## 15. مثال Preview

Request منطقي:

customer_id = 25

vehicle_id = 88

service_ids = [2, 5]

Response منطقي:

- subtotal
- membership_level
- discount_percentage
- discount_amount
- free_wash_available
- total_amount
- loyalty_eligible

---

## 16. تسجيل الغسلة

Endpoint:

`POST /api/v1/washes`

البيانات التي يسمح للواجهة بإرسالها:

- customer_id
- vehicle_id
- service_ids
- payment_method
- use_free_wash
- idempotency_key

الخادم مسؤول عن:

- التحقق من العميل
- التحقق من السيارة
- التحقق من الخدمات
- حساب السعر
- حساب الخصم
- إنشاء الفاتورة
- تحديث الولاء
- التحقق من الترقية
- إنشاء المكافأة
- معالجة الإحالة

---

## 17. ترتيب تسجيل الغسلة

داخل Backend:

1. التحقق من Authentication
2. التحقق من Tenant
3. التحقق من Permission
4. التحقق من idempotency_key
5. تحميل العميل
6. تحميل السيارة
7. تحميل الخدمات
8. حساب Subtotal
9. تحديد العضوية
10. تحديد الخصم
11. تحديد الغسلة المجانية إن وجدت
12. حساب Total
13. بدء Database Transaction
14. إنشاء Invoice
15. إنشاء Invoice Items
16. تحديث Loyalty
17. التحقق من Promotion
18. إنشاء Free Wash عند الترقية
19. معالجة Referral
20. Commit Transaction
21. إرسال الفاتورة
22. إعادة Success Response

---

## 18. Database Transaction

العمليات التالية يجب أن تكون داخل Transaction واحدة:

- Invoice
- Invoice Items
- Loyalty
- Membership
- Free Wash
- Referral

إذا فشلت أي خطوة:

يتم Rollback للعملية كاملة.

---

## 19. منع تكرار الفاتورة

كل طلب تسجيل غسلة يحتوي على:

`idempotency_key`

يجب أن تكون القيمة فريدة للعملية.

إذا أعاد Frontend نفس الطلب بنفس المفتاح:

لا يتم إنشاء فاتورة ثانية.

يتم إعادة نتيجة العملية الأصلية عند الإمكان.

---

## 20. الفواتير

### قائمة الفواتير

`GET /api/v1/invoices`

يدعم التصفية حسب:

- التاريخ
- الفرع
- الموظف
- العميل
- طريقة الدفع
- الحالة

---

### عرض فاتورة

`GET /api/v1/invoices/{invoice_id}`

---

### إرسال الفاتورة

`POST /api/v1/invoices/{invoice_id}/send`

يمكن لاحقًا دعم:

- WhatsApp
- Email
- SMS

في V1 يفضل البدء بالقناة المعتمدة عند التنفيذ.

---

## 21. إلغاء الفاتورة

Endpoint:

`POST /api/v1/invoices/{invoice_id}/cancel`

البيانات:

- reason

صلاحية الإلغاء:

Owner أو Manager حسب إعدادات الصلاحيات.

---

## 22. عملية إلغاء الفاتورة

عند الإلغاء:

1. التأكد أن الفاتورة غير ملغاة مسبقًا
2. تسجيل سبب الإلغاء
3. تغيير status إلى cancelled
4. عكس أثر الولاء إذا كانت الغسلة مؤهلة
5. عكس الترقية إذا نتجت فقط عن هذه الفاتورة
6. إلغاء المكافأة المرتبطة إن لم تستخدم
7. عكس أثر الإحالة عند الحاجة
8. تسجيل العملية في Audit Log

لا يتم حذف الفاتورة.

---

## 23. الولاء

### بيانات ولاء العميل

`GET /api/v1/customers/{customer_id}/loyalty`

يعيد:

- membership_level
- eligible_washes_count
- discount_percentage
- last_eligible_visit_at
- benefits_expire_at
- status
- free_washes

---

## 24. سجل الولاء

`GET /api/v1/customers/{customer_id}/loyalty/transactions`

يعرض:

- الغسلات المؤهلة
- الترقيات
- إعادة التفعيل
- الإلغاءات
- التعديلات اليدوية

---

## 25. الغسلات المجانية

### قائمة المكافآت

`GET /api/v1/customers/{customer_id}/free-washes`

### استخدام غسلة مجانية

يفضل عدم إنشاء Endpoint مستقل للاستخدام.

يتم تحديد:

`use_free_wash = true`

داخل عملية تسجيل الغسلة.

والخادم يتحقق من أهلية المكافأة ويستهلكها داخل نفس Transaction.

---

## 26. الإحالات

### بيانات إحالة العميل

`GET /api/v1/customers/{customer_id}/referrals`

---

### تسجيل كود إحالة

يمكن ربط referral_code عند إنشاء العميل الجديد.

لا يتم منح المكافأة في هذه المرحلة.

---

### تأهيل الإحالة

يتم تلقائيًا عند أول غسلة مؤهلة للعميل الجديد.

---

## 27. لوحة المعلومات

Endpoint:

`GET /api/v1/dashboard`

يعيد حسب صلاحية المستخدم:

- إيرادات اليوم
- عدد الغسلات اليوم
- عدد العملاء
- العملاء الجدد
- أفضل الخدمات
- أحدث الفواتير
- مؤشرات الولاء

---

## 28. التقارير

### ملخص الإيرادات

`GET /api/v1/reports/revenue`

### تقرير الغسلات

`GET /api/v1/reports/washes`

### تقرير الخدمات

`GET /api/v1/reports/services`

### تقرير العملاء

`GET /api/v1/reports/customers`

### تقرير الفروع

`GET /api/v1/reports/branches`

### تقرير الموظفين

`GET /api/v1/reports/employees`

### طرق الدفع

`GET /api/v1/reports/payment-methods`

---

## 29. التصفية في التقارير

يفضل دعم:

- from_date
- to_date
- branch_id
- employee_id

عند الحاجة.

---

## 30. الإعدادات

### قراءة الإعدادات

`GET /api/v1/settings`

### تعديل الإعدادات

`PUT /api/v1/settings`

تتضمن:

- inactivity_days
- inactivity_reminder_days
- referral_reward_type
- referral_reward_value
- invoice_language
- default_language
- timezone
- currency

---

## 31. الاشتراك

### حالة الاشتراك

`GET /api/v1/subscription`

يعيد:

- plan_name
- status
- billing_cycle
- renewal_date
- trial_ends_at

---

## 32. فواتير الاشتراك

`GET /api/v1/subscription/invoices`

---

## 33. Permissions

كل Endpoint حساس يجب أن يتحقق من Permission.

أمثلة:

Owner:

- Full Access

Manager:

- تشغيل الفرع
- العملاء
- الفواتير
- التقارير
- الموظفون حسب الصلاحية

Employee:

- البحث عن العميل
- إضافة عميل
- إضافة سيارة
- تسجيل غسلة
- عرض بيانات محدودة

---

## 34. Tenant Isolation

لا يتم قبول:

`car_wash_id`

من Frontend لتحديد المغسلة التي يريد المستخدم الوصول إليها.

يتم تحديد car_wash_id من المستخدم المصادق عليه Token.

هذه قاعدة أمنية مهمة جدًا.

---

## 35. التحقق من الفرع

إذا كان المستخدم مرتبطًا بفرع واحد:

يجب منع الوصول إلى بيانات الفروع الأخرى إلا إذا كانت لديه صلاحية مناسبة.

---

## 36. Validation

يجب التحقق من جميع المدخلات.

أمثلة:

رقم الجوال:

- صيغة صحيحة

السعر:

- رقم موجب

discount:

- بين 0 و100

service_ids:

- موجودة
- تتبع نفس المغسلة
- حالتها active

vehicle_id:

- تتبع العميل
- تتبع نفس المغسلة

---

## 37. Response Format

يفضل وجود تنسيق موحد.

نجاح:

- success
- message
- data

خطأ:

- success
- message
- error_code
- errors عند وجود Validation Errors

---

## 38. HTTP Status Codes

200:

عملية ناجحة

201:

تم إنشاء سجل

400:

طلب غير صحيح

401:

غير مسجل دخول

403:

لا توجد صلاحية

404:

غير موجود

409:

تعارض مثل Duplicate Request

422:

Validation Error

429:

عدد طلبات زائد

500:

خطأ داخلي

---

## 39. Error Codes

يفضل استخدام أكواد ثابتة مثل:

`CUSTOMER_NOT_FOUND`

`VEHICLE_NOT_FOUND`

`SERVICE_NOT_AVAILABLE`

`INSUFFICIENT_PERMISSION`

`INVOICE_ALREADY_CANCELLED`

`INVALID_FREE_WASH`

`DUPLICATE_REQUEST`

`SUBSCRIPTION_INACTIVE`

---

## 40. Pagination

القوائم الكبيرة يجب أن تستخدم Pagination.

مثل:

- customers
- invoices
- audit logs
- loyalty transactions

الاستجابة يمكن أن تحتوي على:

- current_page
- per_page
- total
- last_page
- data

---

## 41. Rate Limiting

يجب تطبيق Rate Limiting خصوصًا على:

- Login
- Password Reset
- Search
- إنشاء العمليات الحساسة

---

## 42. Audit Logging

يجب تسجيل العمليات الحساسة مثل:

- تسجيل الدخول
- إنشاء مستخدم
- تغيير صلاحيات
- تغيير سعر
- تعديل إعدادات
- إلغاء فاتورة
- تعديل يدوي للولاء

---

## 43. اللغة

يمكن للواجهة إرسال Header مثل:

`Accept-Language`

القيم الأساسية:

- ar
- en
- ur

رسائل النظام يمكن إعادتها باللغة المناسبة.

بيانات العميل نفسها لا تتم ترجمتها.

---

## 44. Timezone

الوقت يتم تخزينه في قاعدة البيانات بطريقة موحدة.

يفضل UTC.

ويتم عرضه حسب:

timezone

الخاصة بالمغسلة.

الافتراضي للسوق السعودي:

Asia/Riyadh

---

## 45. العملة

العملة الافتراضية:

SAR

يجب حفظ القيم المالية باستخدام Decimal وليس Float.

---

## 46. Webhooks مستقبلًا

يمكن مستقبلًا دعم Webhooks لأحداث مثل:

- invoice.created
- invoice.cancelled
- customer.created
- membership.promoted
- subscription.updated

ليست أولوية V1.

---

## 47. API Documentation

يجب توثيق API باستخدام:

OpenAPI / Swagger

حتى يستطيع الفريق:

- معرفة Endpoints
- اختبار الطلبات
- معرفة الحقول المطلوبة
- معرفة الاستجابات

---

## 48. الاختبارات

يجب كتابة اختبارات خاصة لـ:

- Authentication
- Permissions
- Tenant Isolation
- Register Wash
- Pricing
- Loyalty
- Referrals
- Invoice Cancellation
- Idempotency

---

## 49. القاعدة الذهبية

Frontend يطلب العملية.

Backend يقرر النتيجة.

لا يثق Backend في:

- السعر النهائي القادم من Frontend
- الخصم القادم من Frontend
- مستوى العضوية القادم من Frontend
- نتيجة الولاء القادمة من Frontend

الخادم يعيد حساب كل شيء بنفسه.

---

## الخلاصة

API في رجعة يجب أن تكون:

- آمنة
- سريعة
- موحدة
- واضحة
- Multi-Tenant
- قابلة للتوسع
- قابلة للاختبار

وأهم عملية في النظام هي:

`POST /api/v1/washes`

لأنها تربط بين:

العميل + السيارة + الخدمة + الفاتورة + الدفع + الولاء + المكافآت + الإحالات.