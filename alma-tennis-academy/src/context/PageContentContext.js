import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();

export function usePageContent() {
  return useContext(PageContentContext);
}

const defaultContentEN = {
  hero_title_1: 'Elevate Your',
  hero_title_2: 'Tennis Game',
  hero_subtitle: "Professional coaching, premium equipment, and a passionate community. Whether you're picking up a racket for the first time or training for competition, Alma Tennis Academy is your home court.",
  hero_badge: 'Now Enrolling for Summer 2026',
  hero_cta_1: 'Explore Programs',
  hero_cta_2: 'Shop Equipment',
  hero_stat_1: '500+', hero_stat_1_label: 'Students',
  hero_stat_2: '15+', hero_stat_2_label: 'Coaches',
  hero_stat_3: '10+', hero_stat_3_label: 'Years',
  featured_title: 'Featured Equipment',
  featured_subtitle: 'Premium tennis gear hand-picked by our coaches to help you perform your best.',
  why_title: 'Why Choose Alma',
  why_subtitle: "More than a tennis academy - we're a community dedicated to excellence.",
  why_1_icon: '🏆', why_1_title: 'Expert Coaches', why_1_desc: 'Our team of certified professionals brings decades of competitive and coaching experience to every lesson.',
  why_2_icon: '🎯', why_2_title: 'Personalized Training', why_2_desc: 'Every player is unique. We tailor our programs to your skill level, goals, and playing style.',
  why_3_icon: '🌟', why_3_title: 'Premium Facilities', why_3_desc: 'Train on beautifully maintained courts with top-tier equipment in an inspiring environment.',
  programs_title: 'Popular Programs',
  programs_subtitle: 'From beginners to advanced players, find the perfect program for your journey.',
  testimonial_title: 'What Our Players Say',
  testimonial_subtitle: 'Hear from the Alma Tennis Academy community',
  testimonial_1_name: 'Sarah M.', testimonial_1_role: 'Adult Beginner Student',
  testimonial_1_text: "I started with zero experience and now I'm playing competitive matches. The coaches are incredibly patient and supportive!",
  testimonial_2_name: 'James R.', testimonial_2_role: 'Parent',
  testimonial_2_text: "My kids love the junior program. They've improved so much and made great friends.",
  testimonial_3_name: 'Lisa T.', testimonial_3_role: 'Competitive Player',
  testimonial_3_text: "The tournament prep program transformed my game. Highly recommend!",
  cta_title: 'Ready to Start Your Tennis Journey?',
  cta_subtitle: 'Join hundreds of players who have found their home court at Alma Tennis Academy.',
  about_title: 'About Alma Tennis Academy',
  about_subtitle: 'Founded with a passion for tennis and a commitment to excellence.',
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
  about_stat_1: '500+', about_stat_1_label: 'Active Students',
  about_stat_2: '15+', about_stat_2_label: 'Certified Coaches',
  about_stat_3: '8', about_stat_3_label: 'Tennis Courts',
  about_stat_4: '10+', about_stat_4_label: 'Years of Excellence',
  contact_title: 'Contact Us',
  contact_subtitle: "Have a question? We'd love to hear from you.",
  contact_address: '123 Tennis Court Lane, Sport City, SC 12345',
  contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com',
  contact_hours: 'Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-7PM',
  footer_desc: 'Elevating your tennis game through professional coaching, quality equipment, and a passionate community.',
  footer_address: '123 Tennis Court Lane', footer_phone: '(555) 123-ALMA', footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'Alma Tennis Academy. All rights reserved.',
  footer_program_1: 'Junior Development', footer_program_2: 'Adult Beginner',
  footer_program_3: 'Private Coaching', footer_program_4: 'Summer Camps',
  shop_title: 'Shop Equipment', shop_subtitle: 'Quality tennis gear recommended by our professional coaches.',
  programs_page_title: 'Programs & Lessons', programs_page_subtitle: 'Find the perfect program for your skill level and goals.',
  // Navigation
  nav_home: 'Home', nav_shop: 'Shop', nav_programs: 'Programs', nav_about: 'About', nav_contact: 'Contact',
  nav_login: 'Login', nav_logout: 'Logout', nav_register: 'Register',
  nav_cart: 'Cart', nav_checkout: 'Checkout',
  // Cart
  cart_empty_title: 'Your Cart is Empty', cart_empty_desc: "Looks like you haven't added any items yet.",
  cart_title: 'Shopping Cart', cart_summary: 'Order Summary', cart_subtotal: 'Subtotal',
  cart_discount: 'Member Discount', cart_shipping: 'Shipping', cart_free: 'Free',
  cart_total: 'Total', cart_checkout_btn: 'Proceed to Checkout', cart_register_prompt: 'Register to save 20% on your order!',
  cart_continue: 'Continue Shopping', cart_clear: 'Clear entire cart',
  // Checkout
  checkout_title: 'Checkout', checkout_contact: 'Contact Information',
  checkout_shipping: 'Shipping Address', checkout_payment: 'Payment Method',
  checkout_card: 'Credit / Debit Card', checkout_card_desc: 'Pay securely with your card',
  checkout_cod: 'Cash on Delivery', checkout_cod_desc: 'Pay when your order arrives at your door',
  checkout_place_order: 'Place Order', checkout_confirmed: 'Order Confirmed!',
  checkout_thank_you: 'Thank you for your order!',
  // Footer sections
  footer_quick_links: 'Quick Links', footer_programs_title: 'Programs', footer_contact_title: 'Contact Us',
};

const defaultContentAR = {
  hero_title_1: 'ارتقِ بمستوى',
  hero_title_2: 'لعبة التنس',
  hero_subtitle: 'تدريب احترافي، معدات عالية الجودة، ومجتمع شغوف. سواء كنت تمسك المضرب لأول مرة أو تتدرب للمنافسات، أكاديمية ألما للتنس هي ملعبك.',
  hero_badge: 'التسجيل مفتوح الآن لصيف 2026',
  hero_cta_1: 'استكشف البرامج',
  hero_cta_2: 'تسوق المعدات',
  hero_stat_1: '+500', hero_stat_1_label: 'طالب',
  hero_stat_2: '+15', hero_stat_2_label: 'مدرب',
  hero_stat_3: '+10', hero_stat_3_label: 'سنوات',
  featured_title: 'معدات مميزة',
  featured_subtitle: 'معدات تنس عالية الجودة اختارها مدربونا المحترفون لمساعدتك على تقديم أفضل أداء.',
  why_title: 'لماذا تختار ألما',
  why_subtitle: 'أكثر من مجرد أكاديمية تنس - نحن مجتمع ملتزم بالتميز.',
  why_1_icon: '🏆', why_1_title: 'مدربون خبراء', why_1_desc: 'فريقنا من المحترفين المعتمدين يجلب عقودًا من الخبرة التنافسية والتدريبية لكل درس.',
  why_2_icon: '🎯', why_2_title: 'تدريب شخصي', why_2_desc: 'كل لاعب فريد. نصمم برامجنا حسب مستوى مهارتك وأهدافك وأسلوب لعبك.',
  why_3_icon: '🌟', why_3_title: 'مرافق متميزة', why_3_desc: 'تدرب على ملاعب محافظ عليها بشكل جميل مع معدات من الدرجة الأولى في بيئة ملهمة.',
  programs_title: 'البرامج الشائعة',
  programs_subtitle: 'من المبتدئين إلى المتقدمين، اعثر على البرنامج المثالي لرحلتك.',
  testimonial_title: 'ماذا يقول لاعبونا',
  testimonial_subtitle: 'اسمع من مجتمع أكاديمية ألما للتنس',
  testimonial_1_name: 'سارة م.', testimonial_1_role: 'طالبة مبتدئة',
  testimonial_1_text: 'بدأت بدون أي خبرة والآن ألعب مباريات تنافسية. المدربون صبورون وداعمون بشكل لا يصدق!',
  testimonial_2_name: 'جيمس ر.', testimonial_2_role: 'ولي أمر',
  testimonial_2_text: 'أطفالي يحبون برنامج الناشئين. تحسنوا كثيرًا وكوّنوا صداقات رائعة.',
  testimonial_3_name: 'ليزا ت.', testimonial_3_role: 'لاعبة تنافسية',
  testimonial_3_text: 'برنامج الإعداد للبطولات غيّر لعبتي. أنصح به بشدة!',
  cta_title: 'هل أنت مستعد لبدء رحلتك في التنس؟',
  cta_subtitle: 'انضم إلى مئات اللاعبين الذين وجدوا ملعبهم في أكاديمية ألما للتنس.',
  about_title: 'عن أكاديمية ألما للتنس',
  about_subtitle: 'تأسست بشغف للتنس والتزام بالتميز.',
  about_story_title: 'قصتنا',
  about_story_p1: 'وُلدت أكاديمية ألما للتنس من إيمان بسيط: أن الجميع يستحق الحصول على تعليم تنس عالي الجودة.',
  about_story_p2: '"ألما" تعني "الروح" - وهذا بالضبط ما نضعه في كل شيء نقوم به.',
  about_story_p3: 'اليوم، نخدم أكثر من 500 طالب عبر جميع الفئات العمرية ومستويات المهارة.',
  about_value_1_icon: '❤️', about_value_1_title: 'الشغف', about_value_1_desc: 'نحب التنس وهذا يظهر في كل ما نقوم به.',
  about_value_2_icon: '🤝', about_value_2_title: 'المجتمع', about_value_2_desc: 'نبني صداقات دائمة وندعم بعضنا البعض.',
  about_value_3_icon: '📈', about_value_3_title: 'النمو', about_value_3_desc: 'هناك دائمًا مجال للتحسن، بغض النظر عن مستواك.',
  about_value_4_icon: '🎯', about_value_4_title: 'التميز', about_value_4_desc: 'نضع معايير عالية ونساعدك على الوصول إليها.',
  about_coach_1_name: 'المدربة ماريا سانتوس', about_coach_1_role: 'المدربة الرئيسية والمؤسسة', about_coach_1_bio: 'لاعبة سابقة مصنفة في WTA مع أكثر من 20 عامًا من الخبرة التدريبية.', about_coach_1_icon: '👩‍🏫',
  about_coach_2_name: 'المدرب ديفيد تشين', about_coach_2_role: 'مدرب أول', about_coach_2_bio: 'بطل القسم الأول NCAA ومحترف USPTA معتمد.', about_coach_2_icon: '👨‍🏫',
  about_coach_3_name: 'المدربة آنا رودريغيز', about_coach_3_role: 'مديرة تطوير الناشئين', about_coach_3_bio: 'شغوفة بتقديم اللاعبين الصغار إلى التنس.', about_coach_3_icon: '👩‍🏫',
  about_coach_4_name: 'المدرب جيمس ويلسون', about_coach_4_role: 'مدرب لياقة بدنية', about_coach_4_bio: 'أخصائي قوة وتكييف معتمد.', about_coach_4_icon: '💪',
  about_stat_1: '+500', about_stat_1_label: 'طالب نشط',
  about_stat_2: '+15', about_stat_2_label: 'مدرب معتمد',
  about_stat_3: '8', about_stat_3_label: 'ملاعب تنس',
  about_stat_4: '+10', about_stat_4_label: 'سنوات من التميز',
  contact_title: 'اتصل بنا',
  contact_subtitle: 'هل لديك سؤال؟ يسعدنا سماعك.',
  contact_address: '123 شارع ملعب التنس، مدينة الرياضة',
  contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com',
  contact_hours: 'الإثنين-الجمعة: 6ص-9م | السبت-الأحد: 7ص-7م',
  footer_desc: 'ارتقِ بلعبة التنس من خلال التدريب الاحترافي والمعدات عالية الجودة والمجتمع الشغوف.',
  footer_address: '123 شارع ملعب التنس', footer_phone: '(555) 123-ALMA', footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'أكاديمية ألما للتنس. جميع الحقوق محفوظة.',
  footer_program_1: 'تطوير الناشئين', footer_program_2: 'المبتدئون البالغون',
  footer_program_3: 'تدريب خاص', footer_program_4: 'معسكرات صيفية',
  shop_title: 'تسوق المعدات', shop_subtitle: 'معدات تنس عالية الجودة يوصي بها مدربونا المحترفون.',
  programs_page_title: 'البرامج والدروس', programs_page_subtitle: 'اعثر على البرنامج المثالي لمستوى مهارتك وأهدافك.',
  nav_home: 'الرئيسية', nav_shop: 'المتجر', nav_programs: 'البرامج', nav_about: 'عن الأكاديمية', nav_contact: 'اتصل بنا',
  nav_login: 'تسجيل الدخول', nav_logout: 'خروج', nav_register: 'إنشاء حساب',
  nav_cart: 'السلة', nav_checkout: 'الدفع',
  cart_empty_title: 'سلة التسوق فارغة', cart_empty_desc: 'يبدو أنك لم تضف أي عناصر بعد.',
  cart_title: 'سلة التسوق', cart_summary: 'ملخص الطلب', cart_subtotal: 'المجموع الفرعي',
  cart_discount: 'خصم الأعضاء', cart_shipping: 'الشحن', cart_free: 'مجاني',
  cart_total: 'المجموع', cart_checkout_btn: 'المتابعة للدفع', cart_register_prompt: 'سجّل لتوفير 20% على طلبك!',
  cart_continue: 'متابعة التسوق', cart_clear: 'إفراغ السلة',
  checkout_title: 'الدفع', checkout_contact: 'معلومات الاتصال',
  checkout_shipping: 'عنوان الشحن', checkout_payment: 'طريقة الدفع',
  checkout_card: 'بطاقة ائتمان / خصم', checkout_card_desc: 'ادفع بأمان ببطاقتك',
  checkout_cod: 'الدفع عند الاستلام', checkout_cod_desc: 'ادفع عند وصول طلبك إلى باب منزلك',
  checkout_place_order: 'تأكيد الطلب', checkout_confirmed: 'تم تأكيد الطلب!',
  checkout_thank_you: 'شكرًا لطلبك!',
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
  const [contentEN, setContentEN] = useState(defaultContentEN);
  const [contentAR, setContentAR] = useState(defaultContentAR);
  const [theme, setTheme] = useState(defaultTheme);
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [heroBg, setHeroBg] = useState({ type: 'color', imageUrl: '' });
  const [loading, setLoading] = useState(true);

  // The active content based on current language
  const content = language === 'ar' ? contentAR : contentEN;
  const defaultContent = language === 'ar' ? defaultContentAR : defaultContentEN;

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'settings', 'pageContent'), (snap) => {
      if (snap.exists()) setContentEN({ ...defaultContentEN, ...snap.data() });
      setLoading(false);
    }, () => setLoading(false));

    const unsub1ar = onSnapshot(doc(db, 'settings', 'pageContentAR'), (snap) => {
      if (snap.exists()) setContentAR({ ...defaultContentAR, ...snap.data() });
    });

    const unsub2 = onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
      if (snap.exists()) { const t = { ...defaultTheme, ...snap.data() }; setTheme(t); applyThemeToDOM(t); }
    });

    const unsub3 = onSnapshot(doc(db, 'settings', 'branding'), (snap) => {
      if (snap.exists()) {
        setLogoUrl(snap.data().logoUrl || '');
        if (snap.data().faviconUrl !== undefined) setFaviconUrl(snap.data().faviconUrl);
        if (snap.data().language) setLanguageState(snap.data().language);
        if (snap.data().heroBg) setHeroBg(snap.data().heroBg);
      }
    });

    applyThemeToDOM(defaultTheme);
    return () => { unsub1(); unsub1ar(); unsub2(); unsub3(); };
  }, []);

  // Apply RTL/LTR direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.style.fontFamily = "'Noto Sans Arabic', 'Inter', system-ui, sans-serif";
    } else {
      document.documentElement.style.fontFamily = "'Inter', system-ui, sans-serif";
    }
  }, [language]);

  useEffect(() => { applyThemeToDOM(theme); }, [theme]);

  const updateContent = async (key, value) => {
    if (language === 'ar') {
      const newContent = { ...contentAR, [key]: value };
      setContentAR(newContent);
      try { await setDoc(doc(db, 'settings', 'pageContentAR'), newContent); } catch (err) { alert('Failed to save: ' + err.message); }
    } else {
      const newContent = { ...contentEN, [key]: value };
      setContentEN(newContent);
      try { await setDoc(doc(db, 'settings', 'pageContent'), newContent); } catch (err) { alert('Failed to save: ' + err.message); }
    }
  };

  const updateTheme = async (newTheme) => {
    setTheme(newTheme); applyThemeToDOM(newTheme);
    try { await setDoc(doc(db, 'settings', 'theme'), newTheme); } catch (err) { alert('Failed to save theme: ' + err.message); }
  };

  const updateLogo = async (url) => {
    setLogoUrl(url);
    try { await setDoc(doc(db, 'settings', 'branding'), { logoUrl: url, language }, { merge: true }); } catch (err) { alert('Failed to save logo: ' + err.message); }
  };

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    try { await setDoc(doc(db, 'settings', 'branding'), { language: lang }, { merge: true }); } catch (err) { alert('Failed to save language: ' + err.message); }
  };

  // Apply favicon to DOM
  useEffect(() => {
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
      link.type = 'image/png';
    }
  }, [faviconUrl]);

  const updateFavicon = async (url) => {
    setFaviconUrl(url);
    try { await setDoc(doc(db, 'settings', 'branding'), { faviconUrl: url }, { merge: true }); } catch (err) { alert('Failed to save favicon: ' + err.message); }
  };

  const updateHeroBg = async (bg) => {
    setHeroBg(bg);
    try { await setDoc(doc(db, 'settings', 'branding'), { heroBg: bg }, { merge: true }); } catch (err) { alert('Failed to save: ' + err.message); }
  };

  return (
    <PageContentContext.Provider value={{ content, theme, logoUrl, faviconUrl, heroBg, language, loading, updateContent, updateTheme, updateLogo, updateFavicon, updateHeroBg, setLanguage, defaultTheme }}>
      {children}
    </PageContentContext.Provider>
  );
}
