import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import DemoSection from './components/DemoSection';
import Architecture from './components/Architecture';
import UseCases from './components/UseCases';
import SocialProof from './components/SocialProof';
import DeveloperExperience from './components/DeveloperExperience';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-navy-900 text-gray-200 font-sans">
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <Products />
      <div className="section-divider" />
      <DemoSection />
      <div className="section-divider" />
      <Architecture />
      <div className="section-divider" />
      <UseCases />
      <div className="section-divider" />
      <SocialProof />
      <div className="section-divider" />
      <DeveloperExperience />
      <div className="section-divider" />
      <GetStarted />
      <Footer />
    </div>
  );
}
