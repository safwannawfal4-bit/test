import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();

export function usePageContent() {
  return useContext(PageContentContext);
}

const defaultContentEN = {
  site_title: 'Alma Tennis Academy',
  favicon_emoji: '🎾',
  social_media_enabled: 'no',
  social_title: 'Follow Us',
  social_subtitle: "Stay connected and see what's happening at Alma Tennis Academy.",
  social_post_1: '', social_post_2: '', social_post_3: '',
  hero_title_1: 'Elevate Your', hero_title_2: 'Tennis Game',
  hero_subtitle: "Professional coaching, premium equipment, and a passionate community. Whether you're picking up a racket for the first time or training for competition, Alma Tennis Academy is your home court.",
  hero_badge: 'Now Enrolling for Summer 2026',
  hero_cta_1: 'Explore Programs', hero_cta_2: 'Shop Equipment',
  hero_stat_1: '500+', hero_stat_1_label: 'Students',
  hero_stat_2: '15+', hero_stat_2_label: 'Coaches',
  hero_stat_3: '10+', hero_stat_3_label: 'Years',
  featured_title: 'Featured Equipment', featured_subtitle: 'Premium tennis gear hand-picked by our coaches to help you perform your best.',
  why_title: 'Why Choose Alma', why_subtitle: "More than a tennis academy - we're a community dedicated to excellence.",
  why_1_icon: '🏆', why_1_title: 'Expert Coaches', why_1_desc: 'Our team of certified professionals brings decades of competitive and coaching experience to every lesson.',
  why_2_icon: '🎯', why_2_title: 'Personalized Training', why_2_desc: 'Every player is unique. We tailor our programs to your skill level, goals, and playing style.',
  why_3_icon: '🌟', why_3_title: 'Premium Facilities', why_3_desc: 'Train on beautifully maintained courts with top-tier equipment in an inspiring environment.',
  programs_title: 'Popular Programs', programs_subtitle: 'From beginners to advanced players, find the perfect program for your journey.',
  testimonial_title: 'What Our Players Say', testimonial_subtitle: 'Hear from the Alma Tennis Academy community',
  testimonial_1_name: 'Sarah M.', testimonial_1_role: 'Adult Beginner Student', testimonial_1_text: "I started with zero experience and now I'm playing competitive matches. The coaches are incredibly patient and supportive!",
  testimonial_2_name: 'James R.', testimonial_2_role: 'Parent', testimonial_2_text: "My kids love the junior program. They've improved so much and made great friends.",
  testimonial_3_name: 'Lisa T.', testimonial_3_role: 'Competitive Player', testimonial_3_text: "The tournament prep program transformed my game. Highly recommend!",
  cta_title: 'Ready to Start Your Tennis Journey?', cta_subtitle: 'Join hundreds of players who have found their home court at Alma Tennis Academy.',
  about_title: 'About Alma Tennis Academy', about_subtitle: 'Founded with a passion for tennis and a commitment to excellence.',
  about_story_title: 'Our Story',
  about_story_p1: "Alma Tennis Academy was born from a simple belief: that everyone deserves access to quality tennis instruction.",
  about_story_p2: '"Alma" means "soul" - and that\'s exactly what we put into everything we do.',
  about_story_p3: 'Today, we serve over 500 students across all age groups and skill levels.',
  about_value_1_icon: '❤️', about_value_1_title: 'Passion', about_value_1_desc: 'We love tennis and it shows in everything we do.',
  about_value_2_icon: '🤝', about_value_2_title: 'Community', about_value_2_desc: 'We build lasting friendships and support each other.',
  about_value_3_icon: '📈', about_value_3_title: 'Growth', about_value_3_desc: "There's always room to improve, no matter your level.",
  about_value_4_icon: '🎯', about_value_4_title: 'Excellence', about_value_4_desc: 'We set high standards and help you reach them.',
  about_coach_1_name: 'Coach Maria Santos', about_coach_1_role: 'Head Coach & Founder', about_coach_1_bio: 'Former WTA-ranked player with 20+ years of coaching experience.', about_coach_1_icon: '👩‍🏫',
  about_coach_2_name: 'Coach David Chen', about_coach_2_role: 'Senior Coach', about_coach_2_bio: 'NCAA Division I champion and certified USPTA Elite Professional.', about_coach_2_icon: '👨‍🏫',
  about_coach_3_name: 'Coach Ana Rodriguez', about_coach_3_role: 'Junior Development Director', about_coach_3_bio: 'Passionate about introducing young players to tennis.', about_coach_3_icon: '👩‍🏫',
  about_coach_4_name: 'Coach James Wilson', about_coach_4_role: 'Fitness Coach', about_coach_4_bio: 'Certified strength and conditioning specialist.', about_coach_4_icon: '💪',
  about_stat_1: '500+', about_stat_1_label: 'Active Students', about_stat_2: '15+', about_stat_2_label: 'Certified Coaches',
  about_stat_3: '8', about_stat_3_label: 'Tennis Courts', about_stat_4: '10+', about_stat_4_label: 'Years of Excellence',
  contact_title: 'Contact Us', contact_subtitle: "Have a question? We'd love to hear from you.",
  contact_address: '123 Tennis Court Lane, Sport City, SC 12345', contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com', contact_hours: 'Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-7PM',
  footer_desc: 'Elevating your tennis game through professional coaching, quality equipment, and a passionate community.',
  footer_address: '123 Tennis Court Lane', footer_phone: '(555) 123-ALMA', footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'Alma Tennis Academy. All rights reserved.',
  footer_program_1: 'Junior Development', footer_program_2: 'Adult Beginner', footer_program_3: 'Private Coaching', footer_program_4: 'Summer Camps',
  shop_title: 'Shop Equipment', shop_subtitle: 'Quality tennis gear recommended by our professional coaches.',
  programs_page_title: 'Programs & Lessons', programs_page_subtitle: 'Find the perfect program for your skill level and goals.',
  nav_home: 'Home', nav_shop: 'Shop', nav_programs: 'Programs', nav_about: 'About', nav_contact: 'Contact',
  nav_login: 'Login', nav_logout: 'Logout', nav_register: 'Register', nav_cart: 'Cart', nav_checkout: 'Checkout',
  cart_empty_title: 'Your Cart is Empty', cart_empty_desc: "Looks like you haven't added any items yet.",
  cart_title: 'Shopping Cart', cart_summary: 'Order Summary', cart_subtotal: 'Subtotal',
  cart_discount: 'Member Discount', cart_shipping: 'Shipping', cart_free: 'Free',
  cart_total: 'Total', cart_checkout_btn: 'Proceed to Checkout', cart_register_prompt: 'Register to save 20% on your order!',
  cart_continue: 'Continue Shopping', cart_clear: 'Clear entire cart',
  checkout_title: 'Checkout', checkout_contact: 'Contact Information', checkout_shipping: 'Shipping Address', checkout_payment: 'Payment Method',
  checkout_card: 'Credit / Debit Card', checkout_card_desc: 'Pay securely with your card',
  checkout_cod: 'Cash on Delivery', checkout_cod_desc: 'Pay when your order arrives at your door',
  checkout_place_order: 'Place Order', checkout_confirmed: 'Order Confirmed!', checkout_thank_you: 'Thank you for your order!',
  footer_quick_links: 'Quick Links', footer_programs_title: 'Programs', footer_contact_title: 'Contact Us',
};

const defaultContentAR = {
  site_title: 'أكاديمية ألما للتنس', favicon_emoji: '🎾',
  social_media_enabled: 'no', social_title: 'تابعونا', social_subtitle: 'ابقوا على اتصال وشاهدوا ما يحدث في أكاديمية ألما للتنس.',
  social_post_1: '', social_post_2: '', social_post_3: '',
  hero_title_1: 'ارتقِ بمستوى', hero_title_2: 'لعبة التنس',
  hero_subtitle: 'تدريب احترافي، معدات عالية الجودة، ومجتمع شغوف. سواء كنت تمسك المضرب لأول مرة أو تتدرب للمنافسات، أكاديمية ألما للتنس هي ملعبك.',
  hero_badge: 'التسجيل مفتوح الآن لصيف 2026', hero_cta_1: 'استكشف البرامج', hero_cta_2: 'تسوق المعدات',
  hero_stat_1: '+500', hero_stat_1_label: 'طالب', hero_stat_2: '+15', hero_stat_2_label: 'مدرب', hero_stat_3: '+10', hero_stat_3_label: 'سنوات',
  featured_title: 'معدات مميزة', featured_subtitle: 'معدات تنس عالية الجودة اختارها مدربونا المحترفون.',
  why_title: 'لماذا تختار ألما', why_subtitle: 'أكثر من مجرد أكاديمية تنس - نحن مجتمع ملتزم بالتميز.',
  why_1_icon: '🏆', why_1_title: 'مدربون خبراء', why_1_desc: 'فريقنا من المحترفين المعتمدين يجلب عقودًا من الخبرة.',
  why_2_icon: '🎯', why_2_title: 'تدريب شخصي', why_2_desc: 'كل لاعب فريد. نصمم برامجنا حسب مستواك.',
  why_3_icon: '🌟', why_3_title: 'مرافق متميزة', why_3_desc: 'تدرب على ملاعب محافظ عليها بشكل جميل.',
  programs_title: 'البرامج الشائعة', programs_subtitle: 'من المبتدئين إلى المتقدمين.',
  testimonial_title: 'ماذا يقول لاعبونا', testimonial_subtitle: 'اسمع من مجتمع أكاديمية ألما للتنس',
  testimonial_1_name: 'سارة م.', testimonial_1_role: 'طالبة مبتدئة', testimonial_1_text: 'بدأت بدون أي خبرة والآن ألعب مباريات تنافسية!',
  testimonial_2_name: 'جيمس ر.', testimonial_2_role: 'ولي أمر', testimonial_2_text: 'أطفالي يحبون برنامج الناشئين.',
  testimonial_3_name: 'ليزا ت.', testimonial_3_role: 'لاعبة تنافسية', testimonial_3_text: 'برنامج الإعداد للبطولات غيّر لعبتي!',
  cta_title: 'هل أنت مستعد لبدء رحلتك في التنس؟', cta_subtitle: 'انضم إلى مئات اللاعبين الذين وجدوا ملعبهم في أكاديمية ألما.',
  about_title: 'عن أكاديمية ألما للتنس', about_subtitle: 'تأسست بشغف للتنس والتزام بالتميز.',
  about_story_title: 'قصتنا', about_story_p1: 'وُلدت أكاديمية ألما من إيمان بسيط.',
  about_story_p2: '"ألما" تعني "الروح".', about_story_p3: 'نخدم أكثر من 500 طالب.',
  about_value_1_icon: '❤️', about_value_1_title: 'الشغف', about_value_1_desc: 'نحب التنس.',
  about_value_2_icon: '🤝', about_value_2_title: 'المجتمع', about_value_2_desc: 'نبني صداقات دائمة.',
  about_value_3_icon: '📈', about_value_3_title: 'النمو', about_value_3_desc: 'هناك دائمًا مجال للتحسن.',
  about_value_4_icon: '🎯', about_value_4_title: 'التميز', about_value_4_desc: 'نضع معايير عالية.',
  about_coach_1_name: 'المدربة ماريا', about_coach_1_role: 'المدربة الرئيسية', about_coach_1_bio: 'لاعبة سابقة.', about_coach_1_icon: '👩‍🏫',
  about_coach_2_name: 'المدرب ديفيد', about_coach_2_role: 'مدرب أول', about_coach_2_bio: 'بطل القسم الأول.', about_coach_2_icon: '👨‍🏫',
  about_coach_3_name: 'المدربة آنا', about_coach_3_role: 'مديرة تطوير الناشئين', about_coach_3_bio: 'شغوفة بالتنس.', about_coach_3_icon: '👩‍🏫',
  about_coach_4_name: 'المدرب جيمس', about_coach_4_role: 'مدرب لياقة', about_coach_4_bio: 'أخصائي معتمد.', about_coach_4_icon: '💪',
  about_stat_1: '+500', about_stat_1_label: 'طالب', about_stat_2: '+15', about_stat_2_label: 'مدرب',
  about_stat_3: '8', about_stat_3_label: 'ملاعب', about_stat_4: '+10', about_stat_4_label: 'سنوات',
  contact_title: 'اتصل بنا', contact_subtitle: 'هل لديك سؤال؟',
  contact_address: '123 شارع ملعب التنس', contact_phone: '(555) 123-ALMA', contact_email: 'info@almatennisacademy.com', contact_hours: 'الإثنين-الجمعة: 6ص-9م | السبت-الأحد: 7ص-7م',
  footer_desc: 'ارتقِ بلعبة التنس من خلال التدريب الاحترافي.', footer_address: '123 شارع ملعب التنس', footer_phone: '(555) 123-ALMA', footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'أكاديمية ألما للتنس. جميع الحقوق محفوظة.',
  footer_program_1: 'تطوير الناشئين', footer_program_2: 'المبتدئون', footer_program_3: 'تدريب خاص', footer_program_4: 'معسكرات صيفية',
  shop_title: 'تسوق المعدات', shop_subtitle: 'معدات عالية الجودة.',
  programs_page_title: 'البرامج والدروس', programs_page_subtitle: 'اعثر على البرنامج المثالي.',
  nav_home: 'الرئيسية', nav_shop: 'المتجر', nav_programs: 'البرامج', nav_about: 'عن الأكاديمية', nav_contact: 'اتصل بنا',
  nav_login: 'تسجيل الدخول', nav_logout: 'خروج', nav_register: 'إنشاء حساب', nav_cart: 'السلة', nav_checkout: 'الدفع',
  cart_empty_title: 'سلة التسوق فارغة', cart_empty_desc: 'لم تضف أي عناصر بعد.',
  cart_title: 'سلة التسوق', cart_summary: 'ملخص الطلب', cart_subtotal: 'المجموع الفرعي',
  cart_discount: 'خصم الأعضاء', cart_shipping: 'الشحن', cart_free: 'مجاني', cart_total: 'المجموع',
  cart_checkout_btn: 'المتابعة للدفع', cart_register_prompt: 'سجّل لتوفير 20%!',
  cart_continue: 'متابعة التسوق', cart_clear: 'إفراغ السلة',
  checkout_title: 'الدفع', checkout_contact: 'معلومات الاتصال', checkout_shipping: 'عنوان الشحن', checkout_payment: 'طريقة الدفع',
  checkout_card: 'بطاقة ائتمان', checkout_card_desc: 'ادفع ببطاقتك', checkout_cod: 'الدفع عند الاستلام', checkout_cod_desc: 'ادفع عند وصول طلبك',
  checkout_place_order: 'تأكيد الطلب', checkout_confirmed: 'تم تأكيد الطلب!', checkout_thank_you: 'شكرًا لطلبك!',
  footer_quick_links: 'روابط سريعة', footer_programs_title: 'البرامج', footer_contact_title: 'اتصل بنا',
};

const defaultTheme = {
  primary: '#2D4A2D', primaryLight: '#3D6B3D',
  accent: '#A8D86E', accentLight: '#C4E8A0',
  cream: '#FDF6E3', creamDark: '#F5EDDA', charcoal: '#1A1A1A',
};

function applyThemeToDOM(t) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', t.primary);
  root.style.setProperty('--color-primary-light', t.primaryLight);
  root.style.setProperty('--color-accent', t.accent);
  root.style.setProperty('--color-accent-light', t.accentLight);
  root.style.setProperty('--color-cream', t.cream);
  root.style.setProperty('--color-cream-dark', t.creamDark);
  root.style.setProperty('--color-charcoal', t.charcoal);
}

export function PageContentProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  // Published = what visitors see (from Firestore)
  const [publishedEN, setPublishedEN] = useState(defaultContentEN);
  const [publishedAR, setPublishedAR] = useState(defaultContentAR);
  const [publishedTheme, setPublishedTheme] = useState(defaultTheme);
  const [publishedBranding, setPublishedBranding] = useState({});

  // Draft = admin's local edits (not yet published)
  const [draftEN, setDraftEN] = useState(null);
  const [draftAR, setDraftAR] = useState(null);
  const [draftTheme, setDraftTheme] = useState(null);
  const [draftBranding, setDraftBranding] = useState(null);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Determine if admin has unpublished changes
  const hasChanges = !!(draftEN || draftAR || draftTheme || draftBranding);

  // Active values: use draft if exists (admin preview), else published
  const contentEN = draftEN || publishedEN;
  const contentAR = draftAR || publishedAR;
  const theme = draftTheme || publishedTheme;
  const branding = draftBranding || publishedBranding;

  const content = language === 'ar' ? contentAR : contentEN;
  const logoUrl = branding.logoUrl || '';
  const faviconUrl = branding.faviconUrl || '';
  const heroBg = branding.heroBg || { type: 'color', imageUrl: '' };

  // Listen to Firestore for published data
  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'settings', 'pageContent'), (snap) => {
      if (snap.exists()) setPublishedEN({ ...defaultContentEN, ...snap.data() });
      setLoading(false);
    }, () => setLoading(false));

    const unsub1ar = onSnapshot(doc(db, 'settings', 'pageContentAR'), (snap) => {
      if (snap.exists()) setPublishedAR({ ...defaultContentAR, ...snap.data() });
    });

    const unsub2 = onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
      if (snap.exists()) {
        const t = { ...defaultTheme, ...snap.data() };
        setPublishedTheme(t);
        if (!draftTheme) applyThemeToDOM(t);
      }
    });

    const unsub3 = onSnapshot(doc(db, 'settings', 'branding'), (snap) => {
      if (snap.exists()) {
        setPublishedBranding(snap.data());
        if (snap.data().language) setLanguageState(snap.data().language);
      }
    });

    applyThemeToDOM(defaultTheme);
    return () => { unsub1(); unsub1ar(); unsub2(); unsub3(); };
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.style.fontFamily = language === 'ar'
      ? "'Noto Sans Arabic', 'Inter', system-ui, sans-serif"
      : "'Inter', system-ui, sans-serif";
  }, [language]);

  useEffect(() => { applyThemeToDOM(theme); }, [theme]);

  // Favicon
  useEffect(() => {
    document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach(el => el.remove());
    if (faviconUrl) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl + (faviconUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
      document.head.appendChild(link);
    } else {
      const emoji = content.favicon_emoji || '🎾';
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.font = '52px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 32, 36);
      const link = document.createElement('link');
      link.rel = 'icon'; link.href = canvas.toDataURL();
      document.head.appendChild(link);
    }
  }, [faviconUrl, content.favicon_emoji]);

  useEffect(() => {
    document.title = content.site_title || 'Alma Tennis Academy';
  }, [content.site_title]);

  // ---- LOCAL UPDATE FUNCTIONS (draft only, no Firestore write) ----

  const updateContent = (key, value) => {
    if (language === 'ar') {
      setDraftAR(prev => ({ ...(prev || publishedAR), [key]: value }));
    } else {
      setDraftEN(prev => ({ ...(prev || publishedEN), [key]: value }));
    }
  };

  const updateTheme = (newTheme) => {
    setDraftTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  const updateLogo = (url) => {
    setDraftBranding(prev => ({ ...(prev || publishedBranding), logoUrl: url }));
  };

  const updateFavicon = (url) => {
    setDraftBranding(prev => ({ ...(prev || publishedBranding), faviconUrl: url }));
  };

  const updateHeroBg = (bg) => {
    setDraftBranding(prev => ({ ...(prev || publishedBranding), heroBg: bg }));
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
    setDraftBranding(prev => ({ ...(prev || publishedBranding), language: lang }));
  };

  // ---- PUBLISH ALL CHANGES TO FIRESTORE ----

  const publishAll = async () => {
    setPublishing(true);
    try {
      const promises = [];

      if (draftEN) {
        promises.push(setDoc(doc(db, 'settings', 'pageContent'), draftEN));
      }
      if (draftAR) {
        promises.push(setDoc(doc(db, 'settings', 'pageContentAR'), draftAR));
      }
      if (draftTheme) {
        promises.push(setDoc(doc(db, 'settings', 'theme'), draftTheme));
      }
      if (draftBranding) {
        promises.push(setDoc(doc(db, 'settings', 'branding'), { ...publishedBranding, ...draftBranding }));
      }

      await Promise.all(promises);

      // VERIFY the write actually reached the server by reading it back
      const verifyDoc = await getDoc(doc(db, 'settings', 'pageContent'));
      if (draftEN && verifyDoc.exists()) {
        const serverData = verifyDoc.data();
        // Check if at least one changed field actually persisted
        const testKey = Object.keys(draftEN).find(k => draftEN[k] !== defaultContentEN[k]);
        if (testKey && serverData[testKey] !== draftEN[testKey]) {
          throw new Error('Write appeared to succeed but data did not persist on server. Your Firestore security rules are blocking writes. Go to Firebase Console → Firestore Database → Rules and allow read/write.');
        }
      }

      // Update published state with draft values BEFORE clearing drafts
      if (draftEN) setPublishedEN(draftEN);
      if (draftAR) setPublishedAR(draftAR);
      if (draftTheme) setPublishedTheme(draftTheme);
      if (draftBranding) setPublishedBranding(prev => ({ ...prev, ...draftBranding }));

      // Now clear drafts
      setDraftEN(null);
      setDraftAR(null);
      setDraftTheme(null);
      setDraftBranding(null);

      setPublishing(false);
      return { success: true };
    } catch (err) {
      console.error('PUBLISH FAILED:', err);
      setPublishing(false);
      return { success: false, error: err.message };
    }
  };

  // ---- DISCARD CHANGES ----

  const discardChanges = () => {
    setDraftEN(null);
    setDraftAR(null);
    setDraftTheme(null);
    setDraftBranding(null);
    applyThemeToDOM(publishedTheme);
  };

  return (
    <PageContentContext.Provider value={{
      content, theme, logoUrl, faviconUrl, heroBg, language, loading,
      hasChanges, publishing,
      updateContent, updateTheme, updateLogo, updateFavicon, updateHeroBg, setLanguage,
      publishAll, discardChanges, defaultTheme,
    }}>
      {children}
    </PageContentContext.Provider>
  );
}
