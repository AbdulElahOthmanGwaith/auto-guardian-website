# 🛡️ Auto Guardian Core - الموقع الرسمي

موقع ويب تفاعلي وحديث لمشروع **Auto Guardian Core** - نظام متكامل لفحص الكود البرمجي واكتشاف الثغرات الأمنية بشكل تلقائي.

## 🌐 الموقع المباشر

**الموقع الرسمي:** https://auto-guardian-core.vercel.app

## 📋 المحتوى

الموقع يتضمن:

- ✨ صفحة رئيسية جذابة مع معلومات عن المشروع
- 🎯 قسم الميزات الرئيسية
- 📊 إحصائيات المشروع
- 💰 خطط التسعير (مجاني 100%)
- 🔗 روابط مباشرة إلى GitHub والموارد
- 📱 تصميم متجاوب يعمل على جميع الأجهزة
- 🌍 دعم اللغة العربية (RTL)

## 🚀 البدء السريع

### المتطلبات

- Node.js 14+
- npm أو yarn أو pnpm

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/AbdulElahOthmanGwaith/Auto-Guardian-Core.git
cd Auto-Guardian-Core

# تثبيت المتطلبات
npm install

# تشغيل الخادم المحلي
npm run dev
```

الموقع سيكون متاحاً على `http://localhost:5173`

### البناء للإنتاج

```bash
npm run build
```

سيتم إنشاء مجلد `dist/` يحتوي على الملفات الجاهزة للنشر.

## 📁 هيكل المشروع

```
auto-guardian-website/
├── index.html           # الصفحة الرئيسية
├── package.json         # معلومات المشروع والمتطلبات
├── README.md           # هذا الملف
├── .gitignore          # ملفات Git المستثناة
└── dist/               # مجلد الإنتاج (بعد البناء)
```

## 🎨 التصميم

الموقع مصمم بـ:

- **HTML5** - لهيكل الصفحة
- **CSS3** - للتصميم والرسوميات
- **JavaScript** - للتفاعلات
- **Responsive Design** - يعمل على جميع الأجهزة
- **RTL Support** - دعم كامل للغة العربية

## 🔧 التخصيص

يمكنك تخصيص الموقع بسهولة:

### تغيير الألوان

عدّل متغيرات CSS في `index.html`:

```css
:root {
    --primary: #0F172A;
    --secondary: #3B82F6;
    --success: #10B981;
    /* ... */
}
```

### تحديث المحتوى

عدّل النصوص والروابط مباشرة في ملف `index.html`.

## 📱 المميزات

- ✅ تصميم عصري وجذاب
- ✅ سرعة تحميل عالية
- ✅ SEO محسّن
- ✅ دعم الأجهزة المحمولة
- ✅ دعم اللغة العربية
- ✅ روابط مباشرة إلى GitHub
- ✅ أنيميشنات سلسة
- ✅ تصميم احترافي

## 🚀 النشر

### نشر على Vercel (الموصى به)

1. ادفع الكود إلى GitHub
2. اذهب إلى [Vercel](https://vercel.com)
3. انقر على "New Project"
4. اختر المستودع
5. انقر على "Deploy"

### نشر على GitHub Pages

```bash
# بناء الموقع
npm run build

# انسخ محتوى dist/ إلى gh-pages branch
git checkout gh-pages
cp -r dist/* .
git add .
git commit -m "Deploy website"
git push
```

### نشر على Netlify

1. ادفع الكود إلى GitHub
2. اذهب إلى [Netlify](https://netlify.com)
3. انقر على "New site from Git"
4. اختر المستودع
5. اترك الإعدادات الافتراضية
6. انقر على "Deploy"

## 📞 التواصل

- **GitHub:** [AbdulElahOthmanGwaith](https://github.com/AbdulElahOthmanGwaith)
- **البريد الإلكتروني:** fcab8090@gmail.com
- **المشروع:** [Auto-Guardian-Core](https://github.com/AbdulElahOthmanGwaith/Auto-Guardian-Core)
- **الإبلاغ عن مشاكل:** [Issues](https://github.com/AbdulElahOthmanGwaith/Auto-Guardian-Core/issues)

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة **MIT**. راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 شكر خاص

شكراً لجميع المساهمين والمستخدمين الذين ساعدوا في تطوير هذا المشروع!

---

**آخر تحديث:** 20 أغسطس 2026
**الإصدار:** 2.0.0  
**الحالة:** ✅ نشر دائم
