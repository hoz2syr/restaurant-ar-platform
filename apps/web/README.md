# Restaurant AR Platform — Customer Web App

واجهة العملاء (Next.js App Router) لعرض المنيو وتجربة الواقع المعزز وطلبات العملاء.

## المتطلبات

- Node.js 18+
- pnpm

## التشغيل محلياً

تأكد من تشغيل الـ API (NestJS) على المنفذ المناسب.

```bash
pnpm install
pnpm --filter @restaurant/web dev
```

أو من داخل مجلد التطبيق:

```bash
cd apps/web
NEXT_PUBLIC_API_URL="http://localhost:3003/api" pnpm dev
```

## متغيرات البيئة

- `NEXT_PUBLIC_API_URL` — عنوان الـ API (مثال: `http://localhost:3003/api`)
- `NEXT_PUBLIC_APP_NAME` — اسم المطعم (اختياري)

## الـ Endpoints المستخدمة (BFF)

- `GET /api/menu`
- `GET /api/menu/[id]`
- `GET /api/menu/categories`
- `POST /api/orders`
- `GET /api/orders/:id`

## التحقق اليدوي (Smoke Test)

1. افتح `/menu` وشاهد ظهور العناصر والتصنيفات.
2. افتح عنصر من `/menu/[id]` واختبر زر **Add to Order**.
3. انتقل إلى `/order` وتأكد من تعديل الكميات وإرسال الطلب.
4. تحقق من `/order/success?orderId=...&total=...` بعد الإرسال.

## لقطات الشاشة المطلوبة

- صفحة `/menu` (سطح المكتب + موبايل).
- صفحة `/menu/[id]` (سطح المكتب + موبايل).
- صفحة `/order` (سطح المكتب + موبايل).
- صفحة `/order/success` (سطح المكتب + موبايل).

> ملاحظة: يُفضّل حفظ اللقطات داخل مجلد `docs/screenshots/` عند تجهيز الـ PR.

## ملاحظات

- الصور تُحمّل عبر `next/image` مع مصادر خارجية (Unsplash).
- لا يتم استخدام أي منطق أعمال داخل الواجهة؛ كل الحسابات تتم عبر الـ API.
