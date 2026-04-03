import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();

export function usePageContent() {
  return useContext(PageContentContext);
}

const defaultContent = {
  // Hero
  hero_title_1: 'Elevate Your',
  hero_title_2: 'Tennis Game',
  hero_subtitle: "Professional coaching, premium equipment, and a passionate community. Whether you're picking up a racket for the first time or training for competition, Alma Tennis Academy is your home court.",
  hero_badge: 'Now Enrolling for Summer 2026',
  hero_cta_1: 'Explore Programs',
  hero_cta_2: 'Shop Equipment',
  hero_stat_1: '500+', hero_stat_1_label: 'Students',
  hero_stat_2: '15+', hero_stat_2_label: 'Coaches',
  hero_stat_3: '10+', hero_stat_3_label: 'Years',
  // Featured
  featured_title: 'Featured Equipment',
  featured_subtitle: 'Premium tennis gear hand-picked by our coaches to help you perform your best.',
  // Why Choose
  why_title: 'Why Choose Alma',
  why_subtitle: "More than a tennis academy - we're a community dedicated to excellence.",
  why_1_icon: '🏆', why_1_title: 'Expert Coaches', why_1_desc: 'Our team of certified professionals brings decades of competitive and coaching experience to every lesson.',
  why_2_icon: '🎯', why_2_title: 'Personalized Training', why_2_desc: 'Every player is unique. We tailor our programs to your skill level, goals, and playing style.',
  why_3_icon: '🌟', why_3_title: 'Premium Facilities', why_3_desc: 'Train on beautifully maintained courts with top-tier equipment in an inspiring environment.',
  // Programs
  programs_title: 'Popular Programs',
  programs_subtitle: 'From beginners to advanced players, find the perfect program for your journey.',
  // Testimonials
  testimonial_title: 'What Our Players Say',
  testimonial_subtitle: 'Hear from the Alma Tennis Academy community',
  testimonial_1_name: 'Sarah M.', testimonial_1_role: 'Adult Beginner Student',
  testimonial_1_text: "I started with zero experience and now I'm playing competitive matches. The coaches are incredibly patient and supportive!",
  testimonial_2_name: 'James R.', testimonial_2_role: 'Parent',
  testimonial_2_text: "My kids love the junior program. They've improved so much and made great friends. The summer camp was the highlight of their year.",
  testimonial_3_name: 'Lisa T.', testimonial_3_role: 'Competitive Player',
  testimonial_3_text: "The tournament prep program transformed my game. Coach-recommended equipment from the shop is always top quality. Highly recommend!",
  // CTA
  cta_title: 'Ready to Start Your Tennis Journey?',
  cta_subtitle: 'Join hundreds of players who have found their home court at Alma Tennis Academy.',
  // About Page
  about_title: 'About Alma Tennis Academy',
  about_subtitle: 'Founded with a passion for tennis and a commitment to excellence, Alma Tennis Academy has been nurturing players of all levels for over a decade.',
  about_story_title: 'Our Story',
  about_story_p1: "Alma Tennis Academy was born from a simple belief: that everyone deserves access to quality tennis instruction in a welcoming environment. What started as a small group of passionate players has grown into one of the region's most respected tennis programs.",
  about_story_p2: '"Alma" means "soul" - and that\'s exactly what we put into everything we do. From our carefully designed programs to our hand-selected equipment in our shop, every detail is crafted with the player\'s experience in mind.',
  about_story_p3: 'Today, we serve over 500 students across all age groups and skill levels, with a team of 15+ certified coaches who share our passion for developing players both on and off the court.',
  about_value_1_icon: '❤️', about_value_1_title: 'Passion', about_value_1_desc: 'We love tennis and it shows in everything we do.',
  about_value_2_icon: '🤝', about_value_2_title: 'Community', about_value_2_desc: 'We build lasting friendships and support each other.',
  about_value_3_icon: '📈', about_value_3_title: 'Growth', about_value_3_desc: "There's always room to improve, no matter your level.",
  about_value_4_icon: '🎯', about_value_4_title: 'Excellence', about_value_4_desc: 'We set high standards and help you reach them.',
  about_coach_1_name: 'Coach Maria Santos', about_coach_1_role: 'Head Coach & Founder', about_coach_1_bio: 'Former WTA-ranked player with 20+ years of coaching experience. Maria founded Alma Tennis Academy with a vision to make professional tennis training accessible to everyone.', about_coach_1_icon: '👩‍🏫',
  about_coach_2_name: 'Coach David Chen', about_coach_2_role: 'Senior Coach - Competitive Program', about_coach_2_bio: 'NCAA Division I champion and certified USPTA Elite Professional. David specializes in developing competitive juniors and advanced adult players.', about_coach_2_icon: '👨‍🏫',
  about_coach_3_name: 'Coach Ana Rodriguez', about_coach_3_role: 'Junior Development Director', about_coach_3_bio: 'Passionate about introducing young players to tennis. Ana creates fun, engaging programs that build skills and confidence in players ages 4-12.', about_coach_3_icon: '👩‍🏫',
  about_coach_4_name: 'Coach James Wilson', about_coach_4_role: 'Fitness & Performance Coach', about_coach_4_bio: 'Certified strength and conditioning specialist who designs sport-specific training programs to enhance speed, agility, and endurance on the court.', about_coach_4_icon: '💪',
  about_stat_1: '500+', about_stat_1_label: 'Active Students',
  about_stat_2: '15+', about_stat_2_label: 'Certified Coaches',
  about_stat_3: '8', about_stat_3_label: 'Tennis Courts',
  about_stat_4: '10+', about_stat_4_label: 'Years of Excellence',
  // Contact
  contact_title: 'Contact Us',
  contact_subtitle: "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  contact_address: '123 Tennis Court Lane, Sport City, SC 12345',
  contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com',
  contact_hours: 'Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-7PM',
  // Footer
  footer_desc: 'Elevating your tennis game through professional coaching, quality equipment, and a passionate community.',
  footer_address: '123 Tennis Court Lane',
  footer_phone: '(555) 123-ALMA',
  footer_email: 'info@almatennisacademy.com',
  footer_copyright: 'Alma Tennis Academy. All rights reserved.',
  footer_program_1: 'Junior Development', footer_program_2: 'Adult Beginner',
  footer_program_3: 'Private Coaching', footer_program_4: 'Summer Camps',
  // Shop
  shop_title: 'Shop Equipment',
  shop_subtitle: 'Quality tennis gear recommended by our professional coaches.',
  programs_page_title: 'Programs & Lessons',
  programs_page_subtitle: 'Find the perfect program for your skill level and goals.',
};

// Default color theme
const defaultTheme = {
  primary: '#2D4A2D',
  primaryLight: '#3D6B3D',
  accent: '#A8D86E',
  accentLight: '#C4E8A0',
  cream: '#FDF6E3',
  creamDark: '#F5EDDA',
  charcoal: '#1A1A1A',
};

export function PageContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [theme, setTheme] = useState(defaultTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [contentSnap, themeSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'pageContent')),
          getDoc(doc(db, 'settings', 'theme')),
        ]);
        if (contentSnap.exists()) setContent({ ...defaultContent, ...contentSnap.data() });
        if (themeSnap.exists()) setTheme({ ...defaultTheme, ...themeSnap.data() });
      } catch (err) {
        console.error('Error loading settings:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Apply theme colors as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-light', theme.accentLight);
    root.style.setProperty('--color-cream', theme.cream);
    root.style.setProperty('--color-cream-dark', theme.creamDark);
    root.style.setProperty('--color-charcoal', theme.charcoal);
  }, [theme]);

  const updateContent = async (key, value) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    try { await setDoc(doc(db, 'settings', 'pageContent'), newContent); } catch (err) { console.error(err); }
  };

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    try { await setDoc(doc(db, 'settings', 'theme'), newTheme); } catch (err) { console.error(err); }
  };

  return (
    <PageContentContext.Provider value={{ content, theme, loading, updateContent, updateTheme, defaultTheme }}>
      {children}
    </PageContentContext.Provider>
  );
}
