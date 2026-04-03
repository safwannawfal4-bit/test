import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();

export function usePageContent() {
  return useContext(PageContentContext);
}

const defaultContent = {
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
  testimonial_2_text: "My kids love the junior program. They've improved so much and made great friends. The summer camp was the highlight of their year.",
  testimonial_3_name: 'Lisa T.', testimonial_3_role: 'Competitive Player',
  testimonial_3_text: "The tournament prep program transformed my game. Coach-recommended equipment from the shop is always top quality. Highly recommend!",
  cta_title: 'Ready to Start Your Tennis Journey?',
  cta_subtitle: 'Join hundreds of players who have found their home court at Alma Tennis Academy.',
  about_title: 'About Alma Tennis Academy',
  about_subtitle: 'Founded with a passion for tennis and a commitment to excellence, Alma Tennis Academy has been nurturing players of all levels for over a decade.',
  about_story_title: 'Our Story',
  about_story_p1: "Alma Tennis Academy was born from a simple belief: that everyone deserves access to quality tennis instruction in a welcoming environment.",
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
};

const defaultTheme = {
  primary: '#2D4A2D',
  primaryLight: '#3D6B3D',
  accent: '#A8D86E',
  accentLight: '#C4E8A0',
  cream: '#FDF6E3',
  creamDark: '#F5EDDA',
  charcoal: '#1A1A1A',
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
  const [content, setContent] = useState(defaultContent);
  const [theme, setTheme] = useState(defaultTheme);
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Use real-time listeners so ALL visitors see changes instantly
  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'settings', 'pageContent'), (snap) => {
      if (snap.exists()) setContent({ ...defaultContent, ...snap.data() });
      setLoading(false);
    }, () => setLoading(false));

    const unsub2 = onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
      if (snap.exists()) {
        const t = { ...defaultTheme, ...snap.data() };
        setTheme(t);
        applyThemeToDOM(t);
      }
    });

    const unsub3 = onSnapshot(doc(db, 'settings', 'branding'), (snap) => {
      if (snap.exists()) {
        setLogoUrl(snap.data().logoUrl || '');
      }
    });

    // Apply default theme immediately
    applyThemeToDOM(defaultTheme);

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const updateContent = async (key, value) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    try {
      await setDoc(doc(db, 'settings', 'pageContent'), newContent);
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Failed to save: ' + err.message);
    }
  };

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    try {
      await setDoc(doc(db, 'settings', 'theme'), newTheme);
    } catch (err) {
      console.error('Error saving theme:', err);
      alert('Failed to save theme: ' + err.message);
    }
  };

  const updateLogo = async (url) => {
    setLogoUrl(url);
    try {
      await setDoc(doc(db, 'settings', 'branding'), { logoUrl: url });
    } catch (err) {
      console.error('Error saving logo:', err);
      alert('Failed to save logo: ' + err.message);
    }
  };

  return (
    <PageContentContext.Provider value={{ content, theme, logoUrl, loading, updateContent, updateTheme, updateLogo, defaultTheme }}>
      {children}
    </PageContentContext.Provider>
  );
}
