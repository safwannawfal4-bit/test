import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PageContentContext = createContext();

export function usePageContent() {
  return useContext(PageContentContext);
}

// Default content for all editable sections across the site
const defaultContent = {
  hero_title_1: 'Elevate Your',
  hero_title_2: 'Tennis Game',
  hero_subtitle: 'Professional coaching, premium equipment, and a passionate community. Whether you\'re picking up a racket for the first time or training for competition, Alma Tennis Academy is your home court.',
  hero_badge: 'Now Enrolling for Summer 2026',
  hero_cta_1: 'Explore Programs',
  hero_cta_2: 'Shop Equipment',
  hero_stat_1: '500+',
  hero_stat_1_label: 'Students',
  hero_stat_2: '15+',
  hero_stat_2_label: 'Coaches',
  hero_stat_3: '10+',
  hero_stat_3_label: 'Years',
  featured_title: 'Featured Equipment',
  featured_subtitle: 'Premium tennis gear hand-picked by our coaches to help you perform your best.',
  why_title: 'Why Choose Alma',
  why_subtitle: 'More than a tennis academy - we\'re a community dedicated to excellence.',
  why_1_title: 'Expert Coaches',
  why_1_desc: 'Our team of certified professionals brings decades of competitive and coaching experience to every lesson.',
  why_2_title: 'Personalized Training',
  why_2_desc: 'Every player is unique. We tailor our programs to your skill level, goals, and playing style.',
  why_3_title: 'Premium Facilities',
  why_3_desc: 'Train on beautifully maintained courts with top-tier equipment in an inspiring environment.',
  programs_title: 'Popular Programs',
  programs_subtitle: 'From beginners to advanced players, find the perfect program for your journey.',
  testimonial_title: 'What Our Players Say',
  testimonial_subtitle: 'Hear from the Alma Tennis Academy community',
  testimonial_1_name: 'Sarah M.',
  testimonial_1_role: 'Adult Beginner Student',
  testimonial_1_text: "I started with zero experience and now I'm playing competitive matches. The coaches are incredibly patient and supportive!",
  testimonial_2_name: 'James R.',
  testimonial_2_role: 'Parent',
  testimonial_2_text: "My kids love the junior program. They've improved so much and made great friends. The summer camp was the highlight of their year.",
  testimonial_3_name: 'Lisa T.',
  testimonial_3_role: 'Competitive Player',
  testimonial_3_text: "The tournament prep program transformed my game. Coach-recommended equipment from the shop is always top quality. Highly recommend!",
  cta_title: 'Ready to Start Your Tennis Journey?',
  cta_subtitle: 'Join hundreds of players who have found their home court at Alma Tennis Academy.',
  about_title: 'About Alma Tennis Academy',
  about_subtitle: 'Founded with a passion for tennis and a commitment to excellence, Alma Tennis Academy has been nurturing players of all levels for over a decade.',
  about_story_title: 'Our Story',
  about_story_p1: 'Alma Tennis Academy was born from a simple belief: that everyone deserves access to quality tennis instruction in a welcoming environment. What started as a small group of passionate players has grown into one of the region\'s most respected tennis programs.',
  about_story_p2: '"Alma" means "soul" - and that\'s exactly what we put into everything we do. From our carefully designed programs to our hand-selected equipment in our shop, every detail is crafted with the player\'s experience in mind.',
  about_story_p3: 'Today, we serve over 500 students across all age groups and skill levels, with a team of 15+ certified coaches who share our passion for developing players both on and off the court.',
  contact_title: 'Contact Us',
  contact_subtitle: 'Have a question? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  contact_address: '123 Tennis Court Lane, Sport City, SC 12345',
  contact_phone: '(555) 123-ALMA (2562)',
  contact_email: 'info@almatennisacademy.com',
  contact_hours: 'Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-7PM',
  footer_text: 'Elevating your tennis game through professional coaching, quality equipment, and a passionate community.',
};

export function PageContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'pageContent'));
        if (snap.exists()) {
          setContent({ ...defaultContent, ...snap.data() });
        }
      } catch (err) {
        console.error('Error loading page content:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateContent = async (key, value) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    try {
      await setDoc(doc(db, 'settings', 'pageContent'), newContent);
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  const updateMultiple = async (updates) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    try {
      await setDoc(doc(db, 'settings', 'pageContent'), newContent);
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  return (
    <PageContentContext.Provider value={{ content, loading, updateContent, updateMultiple }}>
      {children}
    </PageContentContext.Provider>
  );
}
