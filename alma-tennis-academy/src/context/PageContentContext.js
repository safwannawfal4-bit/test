import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();
export function usePageContent() { return useContext(PageContentContext); }

const defaultContentEN = {
  site_title: 'Alma Tennis Academy', favicon_emoji: '🎾',
  social_media_enabled: 'no', social_title: 'Follow Us',
  social_subtitle: "Stay connected and see what's happening at Alma Tennis Academy.",
  social_post_1: '', social_post_2: '', social_post_3: '',
  hero_title_1: 'Elevate Your', hero_title_2: 'Tennis Game',
  hero_subtitle: "Professional coaching, premium equipment, and a passionate community. Whether you're picking up a racket for the first time or training for competition, Alma Tennis Academy is your home court.",
  hero_badge: 'Now Enrolling for Summer 2026', hero_cta_1: 'Explore Programs', hero_cta_2: 'Shop Equipment',
  hero_stat_1: '500+', hero_stat_1_label: 'Students', hero_stat_2: '15+', hero_stat_2_label: 'Coaches', hero_stat_3: '10+', hero_stat_3_label: 'Years',
  featured_title: 'Featured Equipment', featured_subtitle: 'Premium tennis gear hand-picked by our coaches.',
  why_title: 'Why Choose Alma', why_subtitle: "More than a tennis academy - we're a community dedicated to excellence.",
  why_1_icon: '🏆', why_1_title: 'Expert Coaches', why_1_desc: 'Our team of certified professionals brings decades of experience.',
  why_2_icon: '🎯', why_2_title: 'Personalized Training', why_2_desc: 'Every player is unique. We tailor our programs to you.',
  why_3_icon: '🌟', why_3_title: 'Premium Facilities', why_3_desc: 'Train on beautifully maintained courts.',
  programs_title: 'Popular Programs', programs_subtitle: 'From beginners to advanced players.',
  testimonial_title: 'What Our Players Say', testimonial_subtitle: 'Hear from our community',
  testimonial_1_name: 'Sarah M.', testimonial_1_role: 'Adult Beginner', testimonial_1_text: "I started with zero experience and now I'm playing competitive matches!",
  testimonial_2_name: 'James R.', testimonial_2_role: 'Parent', testimonial_2_text: "My kids love the junior program!",
  testimonial_3_name: 'Lisa T.', testimonial_3_role: 'Competitive Player', testimonial_3_text: "The tournament prep program transformed my game!",
  cta_title: 'Ready to Start Your Tennis Journey?', cta_subtitle: 'Join hundreds of players at Alma Tennis Academy.',
  about_title: 'About Alma Tennis Academy', about_subtitle: 'Founded with a passion for tennis.',
  about_story_title: 'Our Story',
  about_story_p1: "Alma Tennis Academy was born from a simple belief: everyone deserves quality tennis instruction.",
  about_story_p2: '"Alma" means "soul" - and that\'s what we put into everything we do.',
  about_story_p3: 'Today, we serve over 500 students across all levels.',
  about_value_1_icon: '❤️', about_value_1_title: 'Passion', about_value_1_desc: 'We love tennis.',
  about_value_2_icon: '🤝', about_value_2_title: 'Community', about_value_2_desc: 'We build lasting friendships.',
  about_value_3_icon: '📈', about_value_3_title: 'Growth', about_value_3_desc: 'Always room to improve.',
  about_value_4_icon: '🎯', about_value_4_title: 'Excellence', about_value_4_desc: 'We set high standards.',
  about_coach_1_name: 'Coach Maria Santos', about_coach_1_role: 'Head Coach & Founder', about_coach_1_bio: 'Former WTA-ranked player.', about_coach_1_icon: '👩‍🏫',
  about_coach_2_name: 'Coach David Chen', about_coach_2_role: 'Senior Coach', about_coach_2_bio: 'NCAA Division I champion.', about_coach_2_icon: '👨‍🏫',
  about_coach_3_name: 'Coach Ana Rodriguez', about_coach_3_role: 'Junior Director', about_coach_3_bio: 'Passionate about young players.', about_coach_3_icon: '👩‍🏫',
  about_coach_4_name: 'Coach James Wilson', about_coach_4_role: 'Fitness Coach', about_coach_4_bio: 'Strength & conditioning specialist.', about_coach_4_icon: '💪',
  about_stat_1: '500+', about_stat_1_label: 'Active Students', about_stat_2: '15+', about_stat_2_label: 'Certified Coaches',
  about_stat_3: '8', about_stat_3_label: 'Tennis Courts', about_stat_4: '10+', about_stat_4_label: 'Years of Excellence',
  contact_title: 'Contact Us', contact_subtitle: "Have a question? We'd love to hear from you.",
  contact_address: '123 Tennis Court Lane, Sport City, SC 12345', contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com', contact_hours: 'Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-7PM',
  footer_desc: 'Elevating your tennis game through professional coaching.', footer_address: '123 Tennis Court Lane',
  footer_phone: '(555) 123-ALMA', footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'Alma Tennis Academy. All rights reserved.',
  footer_program_1: 'Junior Development', footer_program_2: 'Adult Beginner', footer_program_3: 'Private Coaching', footer_program_4: 'Summer Camps',
  shop_title: 'Shop Equipment', shop_subtitle: 'Quality tennis gear recommended by our coaches.',
  programs_page_title: 'Programs & Lessons', programs_page_subtitle: 'Find the perfect program for you.',
  nav_home: 'Home', nav_shop: 'Shop', nav_programs: 'Programs', nav_about: 'About', nav_contact: 'Contact',
  nav_login: 'Login', nav_logout: 'Logout', nav_register: 'Register', nav_cart: 'Cart', nav_checkout: 'Checkout',
  cart_empty_title: 'Your Cart is Empty', cart_empty_desc: "No items added yet.",
  cart_title: 'Shopping Cart', cart_summary: 'Order Summary', cart_subtotal: 'Subtotal',
  cart_discount: 'Member Discount', cart_shipping: 'Shipping', cart_free: 'Free', cart_total: 'Total',
  cart_checkout_btn: 'Proceed to Checkout', cart_register_prompt: 'Register to save 20%!',
  cart_continue: 'Continue Shopping', cart_clear: 'Clear cart',
  checkout_title: 'Checkout', checkout_contact: 'Contact Information', checkout_shipping: 'Shipping Address', checkout_payment: 'Payment Method',
  checkout_card: 'Credit / Debit Card', checkout_card_desc: 'Pay with your card',
  checkout_cod: 'Cash on Delivery', checkout_cod_desc: 'Pay when order arrives',
  checkout_place_order: 'Place Order', checkout_confirmed: 'Order Confirmed!', checkout_thank_you: 'Thank you!',
  footer_quick_links: 'Quick Links', footer_programs_title: 'Programs', footer_contact_title: 'Contact Us',
};

const defaultContentAR = { ...defaultContentEN,
  site_title: 'أكاديمية ألما للتنس', hero_title_1: 'ارتقِ بمستوى', hero_title_2: 'لعبة التنس',
  hero_subtitle: 'تدريب احترافي ومعدات عالية الجودة.', hero_badge: 'التسجيل مفتوح الآن',
  hero_cta_1: 'استكشف البرامج', hero_cta_2: 'تسوق المعدات',
  hero_stat_1_label: 'طالب', hero_stat_2_label: 'مدرب', hero_stat_3_label: 'سنوات',
  featured_title: 'معدات مميزة', featured_subtitle: 'معدات تنس عالية الجودة.',
  why_title: 'لماذا تختار ألما', why_subtitle: 'أكثر من مجرد أكاديمية تنس.',
  nav_home: 'الرئيسية', nav_shop: 'المتجر', nav_programs: 'البرامج', nav_about: 'عن الأكاديمية', nav_contact: 'اتصل بنا',
  contact_title: 'اتصل بنا', footer_copyright: 'أكاديمية ألما للتنس. جميع الحقوق محفوظة.',
};

const defaultTheme = { primary: '#2D4A2D', primaryLight: '#3D6B3D', accent: '#A8D86E', accentLight: '#C4E8A0', cream: '#FDF6E3', creamDark: '#F5EDDA', charcoal: '#1A1A1A' };

function applyThemeToDOM(t) {
  const r = document.documentElement;
  r.style.setProperty('--color-primary', t.primary);
  r.style.setProperty('--color-primary-light', t.primaryLight);
  r.style.setProperty('--color-accent', t.accent);
  r.style.setProperty('--color-accent-light', t.accentLight);
  r.style.setProperty('--color-cream', t.cream);
  r.style.setProperty('--color-cream-dark', t.creamDark);
  r.style.setProperty('--color-charcoal', t.charcoal);
}

// ---- localStorage helpers (ALWAYS works) ----
function lsGet(key, fallback) {
  try { const v = localStorage.getItem('alma_' + key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem('alma_' + key, JSON.stringify(value)); } catch {}
}

// ---- Firestore write (MIGHT fail, that's OK) ----
async function firestoreWrite(path, data) {
  try { await setDoc(doc(db, 'settings', path), data); return true; }
  catch (err) { console.warn('Firestore write failed:', path, err.message); return false; }
}

export function PageContentProvider({ children }) {
  // Load from localStorage first (instant), then Firestore overrides if available
  const [contentEN, setContentEN] = useState(() => lsGet('contentEN', defaultContentEN));
  const [contentAR, setContentAR] = useState(() => lsGet('contentAR', defaultContentAR));
  const [theme, setTheme] = useState(() => lsGet('theme', defaultTheme));
  const [branding, setBranding] = useState(() => lsGet('branding', {}));
  const [loading, setLoading] = useState(true);
  const [firestoreOK, setFirestoreOK] = useState(false);

  // Draft state
  const [draftEN, setDraftEN] = useState(null);
  const [draftAR, setDraftAR] = useState(null);
  const [draftTheme, setDraftTheme] = useState(null);
  const [draftBranding, setDraftBranding] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const hasChanges = !!(draftEN || draftAR || draftTheme || draftBranding);
  const language = branding.language || (draftBranding?.language) || 'en';

  // Active values
  const activeEN = draftEN || contentEN;
  const activeAR = draftAR || contentAR;
  const activeTheme = draftTheme || theme;
  const activeBranding = draftBranding ? { ...branding, ...draftBranding } : branding;
  const content = language === 'ar' ? activeAR : activeEN;
  const logoUrl = activeBranding.logoUrl || '';
  const faviconUrl = activeBranding.faviconUrl || '';
  const heroBg = activeBranding.heroBg || { type: 'color', imageUrl: '' };

  // Try Firestore listeners (might fail if rules block reads too)
  useEffect(() => {
    const unsubs = [];
    try {
      unsubs.push(onSnapshot(doc(db, 'settings', 'pageContent'), (snap) => {
        if (snap.exists()) {
          const data = { ...defaultContentEN, ...snap.data() };
          setContentEN(data);
          lsSet('contentEN', data);
          setFirestoreOK(true);
        }
        setLoading(false);
      }, () => setLoading(false)));

      unsubs.push(onSnapshot(doc(db, 'settings', 'pageContentAR'), (snap) => {
        if (snap.exists()) { const d = { ...defaultContentAR, ...snap.data() }; setContentAR(d); lsSet('contentAR', d); }
      }, () => {}));

      unsubs.push(onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
        if (snap.exists()) { const t = { ...defaultTheme, ...snap.data() }; setTheme(t); lsSet('theme', t); applyThemeToDOM(t); }
      }, () => {}));

      unsubs.push(onSnapshot(doc(db, 'settings', 'branding'), (snap) => {
        if (snap.exists()) { setBranding(snap.data()); lsSet('branding', snap.data()); }
      }, () => {}));
    } catch {}

    applyThemeToDOM(lsGet('theme', defaultTheme));
    setLoading(false);
    return () => unsubs.forEach(u => { try { u(); } catch {} });
  }, []);

  useEffect(() => { applyThemeToDOM(activeTheme); }, [activeTheme]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.style.fontFamily = language === 'ar' ? "'Noto Sans Arabic', 'Inter', sans-serif" : "'Inter', sans-serif";
  }, [language]);

  useEffect(() => {
    document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach(el => el.remove());
    if (faviconUrl) {
      const link = document.createElement('link'); link.rel = 'icon';
      link.href = faviconUrl + '?v=' + Date.now(); document.head.appendChild(link);
    } else {
      const emoji = content.favicon_emoji || '🎾';
      const c = document.createElement('canvas'); c.width = 64; c.height = 64;
      const ctx = c.getContext('2d'); ctx.font = '52px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 32, 36);
      const link = document.createElement('link'); link.rel = 'icon'; link.href = c.toDataURL(); document.head.appendChild(link);
    }
  }, [faviconUrl, content.favicon_emoji]);

  useEffect(() => { document.title = content.site_title || 'Alma Tennis Academy'; }, [content.site_title]);

  // ---- DRAFT UPDATES (local preview only) ----
  const updateContent = (key, value) => {
    if (language === 'ar') setDraftAR(prev => ({ ...(prev || contentAR), [key]: value }));
    else setDraftEN(prev => ({ ...(prev || contentEN), [key]: value }));
  };
  const updateTheme = (t) => { setDraftTheme(t); applyThemeToDOM(t); };
  const updateLogo = (url) => { setDraftBranding(prev => ({ ...(prev || branding), logoUrl: url })); };
  const updateFavicon = (url) => { setDraftBranding(prev => ({ ...(prev || branding), faviconUrl: url })); };
  const updateHeroBg = (bg) => { setDraftBranding(prev => ({ ...(prev || branding), heroBg: bg })); };
  const setLanguage = (lang) => { setDraftBranding(prev => ({ ...(prev || branding), language: lang })); };

  // ---- PUBLISH: Save to localStorage (always works) + try Firestore ----
  const publishAll = async () => {
    setPublishing(true);
    setPublishError('');
    let firestoreSuccess = true;

    if (draftEN) {
      lsSet('contentEN', draftEN);
      setContentEN(draftEN);
      if (!await firestoreWrite('pageContent', draftEN)) firestoreSuccess = false;
      setDraftEN(null);
    }
    if (draftAR) {
      lsSet('contentAR', draftAR);
      setContentAR(draftAR);
      if (!await firestoreWrite('pageContentAR', draftAR)) firestoreSuccess = false;
      setDraftAR(null);
    }
    if (draftTheme) {
      lsSet('theme', draftTheme);
      setTheme(draftTheme);
      if (!await firestoreWrite('theme', draftTheme)) firestoreSuccess = false;
      setDraftTheme(null);
    }
    if (draftBranding) {
      const merged = { ...branding, ...draftBranding };
      lsSet('branding', merged);
      setBranding(merged);
      if (!await firestoreWrite('branding', merged)) firestoreSuccess = false;
      setDraftBranding(null);
    }

    setPublishing(false);

    if (!firestoreSuccess) {
      setPublishError('Changes saved locally but could not sync to database. Other visitors may not see changes until Firestore rules are fixed.');
      return { success: true, partial: true };
    }

    return { success: true };
  };

  const discardChanges = () => {
    setDraftEN(null); setDraftAR(null); setDraftTheme(null); setDraftBranding(null);
    applyThemeToDOM(theme);
  };

  return (
    <PageContentContext.Provider value={{
      content, theme: activeTheme, logoUrl, faviconUrl, heroBg, language, loading,
      hasChanges, publishing, publishError, setPublishError, firestoreOK,
      updateContent, updateTheme, updateLogo, updateFavicon, updateHeroBg, setLanguage,
      publishAll, discardChanges, defaultTheme,
    }}>
      {children}
    </PageContentContext.Provider>
  );
}
