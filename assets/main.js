/**
 * Auto Guardian Core - Main JavaScript
 * Dark Mode, Analytics, Form Handling
 */

// ==================== Dark Mode ====================

class DarkModeManager {
    constructor() {
        this.darkModeKey = 'auto-guardian-dark-mode';
        this.init();
    }

    init() {
        // تحميل التفضيل المحفوظ
        const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
        if (isDarkMode) {
            this.enable();
        }

        // إضافة مستمع للتبديل
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }

        // التحقق من تفضيل النظام
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (localStorage.getItem(this.darkModeKey) === null) {
                this.enable();
            }
        }
    }

    enable() {
        document.body.classList.add('dark-mode');
        localStorage.setItem(this.darkModeKey, 'true');
        this.updateToggleIcon();
    }

    disable() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem(this.darkModeKey, 'false');
        this.updateToggleIcon();
    }

    toggle() {
        if (document.body.classList.contains('dark-mode')) {
            this.disable();
        } else {
            this.enable();
        }
    }

    updateToggleIcon() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            const isDark = document.body.classList.contains('dark-mode');
            toggle.textContent = isDark ? '☀️' : '🌙';
        }
    }
}

// ==================== Google Analytics ====================

class AnalyticsManager {
    constructor(trackingId) {
        this.trackingId = trackingId;
        this.gtag = null;
        this.init();
    }

    init() {
        // لا ترسل طلبات تحليل بمعرّف placeholder أو إعداد غير مكتمل.
        if (!this.trackingId || this.trackingId.includes('YOUR_')) return;

        // إضافة Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag(...args) {
            window.dataLayer.push(args);
        };
        this.gtag = window.gtag;
        this.gtag('js', new Date());
        this.gtag('config', this.trackingId);

        // تتبع الأحداث
        this.trackPageView();
        this.trackLinks();
        this.trackButtons();
    }

    trackPageView() {
        // تتبع صفحة جديدة
        if (this.gtag) {
            this.gtag('event', 'page_view', {
                page_title: document.title,
                page_path: window.location.pathname
            });
        }
    }

    trackEvent(eventName, eventData = {}) {
        if (this.gtag) {
            this.gtag('event', eventName, eventData);
        }
    }

    trackLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('external_link', {
                    link_url: link.href,
                    link_text: link.textContent
                });
            });
        });
    }

    trackButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('button_click', {
                    button_text: button.textContent,
                    button_class: button.className
                });
            });
        });
    }
}

// ==================== Contact Form ====================

class ContactFormManager {
    constructor(formId = 'contact-form') {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            subject: String(formData.get('subject') || '').trim(),
            message: String(formData.get('message') || '').trim(),
            timestamp: new Date().toISOString()
        };
        const endpoint = (this.form.dataset.endpoint || '').trim();
        const fallbackEmail = (this.form.dataset.fallbackEmail || 'fcab8090@gmail.com').trim();
        const submitButton = this.form.querySelector('button[type="submit"]');

        this.setBusy(true, submitButton);
        try {
            if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
                const mailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
                    `الاسم: ${data.name}\nالبريد: ${data.email}\n\n${data.message}`
                )}`;
                window.location.href = mailto;
                this.showInfo('لم يتم تهيئة خدمة الإرسال بعد؛ فُتح تطبيق البريد لإكمال الرسالة يدوياً.');
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Contact form request failed: ${response.status}`);

            this.showSuccess('تم إرسال الرسالة بنجاح! شكراً لتواصلك معنا.');
            this.form.reset();
            if (window.analytics) {
                window.analytics.trackEvent('form_submit', {
                    form_name: 'contact_form',
                    status: 'success'
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('تعذر إرسال الرسالة عبر الخادم. تحقق من الاتصال أو استخدم البريد الإلكتروني مباشرة.');
        } finally {
            this.setBusy(false, submitButton);
        }
    }

    setBusy(isBusy, submitButton) {
        this.form.setAttribute('aria-busy', String(isBusy));
        if (submitButton) {
            submitButton.disabled = isBusy;
            submitButton.setAttribute('aria-disabled', String(isBusy));
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showInfo(message) {
        this.showMessage(message, 'info');
    }

    showMessage(message, type) {
        this.form.querySelectorAll('.form-message').forEach((node) => node.remove());
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            background-color: ${type === 'success' ? '#d4edda' : type === 'info' ? '#dbeafe' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : type === 'info' ? '#1e3a8a' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'info' ? '#93c5fd' : '#f5c6cb'};
        `;

        this.form.appendChild(messageDiv);

        // إزالة الرسالة بعد 5 ثوان
        setTimeout(() => messageDiv.remove(), 5000);
    }
}

// ==================== Smooth Scroll ====================

class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==================== Intersection Observer ====================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة Dark Mode
    window.darkMode = new DarkModeManager();

    // تهيئة Analytics (استبدل YOUR_TRACKING_ID بـ Google Analytics ID)
    // ضع معرّفًا حقيقيًا هنا عند تفعيل التحليلات؛ القيمة الفارغة تمنع الطلبات الوهمية.
    window.analytics = new AnalyticsManager('');

    // تهيئة نموذج الاتصال
    window.contactForm = new ContactFormManager('contact-form');

    // تهيئة Smooth Scroll
    window.smoothScroll = new SmoothScrollManager();

    // تهيئة الرسوم المتحركة
    window.animations = new AnimationManager();

    console.log('✅ Auto Guardian Core - Initialized successfully');
});

// ==================== Utility Functions ====================

/**
 * نسخ النص إلى الحافظة
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('✅ تم النسخ إلى الحافظة');
    }).catch(err => {
        console.error('❌ خطأ في النسخ:', err);
    });
}

/**
 * فتح رابط في نافذة جديدة
 */
function openLink(url, target = '_blank') {
    window.open(url, target);
}

/**
 * تنسيق الوقت
 */
function formatTime(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * التحقق من الاتصال بالإنترنت
 */
function isOnline() {
    return navigator.onLine;
}

/**
 * إظهار إشعار
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ==================== CSS Animations ====================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    [data-animate] {
        opacity: 0;
        animation: fadeIn 0.6s ease forwards;
    }

    [data-animate].animate-in {
        animation: fadeIn 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

export { DarkModeManager, AnalyticsManager, ContactFormManager, SmoothScrollManager, AnimationManager };
