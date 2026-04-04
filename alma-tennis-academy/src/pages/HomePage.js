import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import ProgramCard from '../components/ProgramCard';
import EditableText from '../components/EditableText';
import SocialMediaSection from '../components/SocialMediaSection';
import useScrollReveal from '../hooks/useScrollReveal';
import { useData } from '../context/DataContext';

function RevealSection({ children, className = '' }) {
  const [ref, isVisible] = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { products, programs } = useData();
  const featuredProducts = products.slice(0, 4);
  const popularPrograms = programs.slice(0, 3);

  return (
    <div>
      <HeroSection />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title"><EditableText contentKey="featured_title" /></h2>
            <p className="section-subtitle mx-auto"><EditableText contentKey="featured_subtitle" /></p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </RevealSection>
        <RevealSection className="text-center mt-10">
          <Link to="/shop" className="btn-outline">View All Equipment →</Link>
        </RevealSection>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="section-title"><EditableText contentKey="why_title" /></h2>
              <p className="section-subtitle mx-auto"><EditableText contentKey="why_subtitle" /></p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🏆', titleKey: 'why_1_title', descKey: 'why_1_desc' },
                { icon: '🎯', titleKey: 'why_2_title', descKey: 'why_2_desc' },
                { icon: '🌟', titleKey: 'why_3_title', descKey: 'why_3_desc' },
              ].map(item => (
                <div key={item.titleKey} className="text-center p-8 rounded-2xl bg-alma-cream hover:bg-alma-cream-dark transition-colors">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-alma-green mb-3"><EditableText contentKey={item.titleKey} /></h3>
                  <p className="text-alma-charcoal/70"><EditableText contentKey={item.descKey} /></p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title"><EditableText contentKey="programs_title" /></h2>
            <p className="section-subtitle mx-auto"><EditableText contentKey="programs_subtitle" /></p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPrograms.map(program => <ProgramCard key={program.id} program={program} />)}
          </div>
        </RevealSection>
        <RevealSection className="text-center mt-10">
          <Link to="/programs" className="btn-outline">View All Programs →</Link>
        </RevealSection>
      </section>

      <section className="py-20 bg-alma-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white"><EditableText contentKey="testimonial_title" className="text-white" /></h2>
              <p className="text-white/70 mt-2 text-lg"><EditableText contentKey="testimonial_subtitle" className="text-white/70" /></p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex text-alma-lime mb-4">★★★★★</div>
                  <p className="text-white/90 italic mb-6">"<EditableText contentKey={`testimonial_${i}_text`} className="text-white/90" />"</p>
                  <div>
                    <p className="font-semibold text-white"><EditableText contentKey={`testimonial_${i}_name`} className="text-white" /></p>
                    <p className="text-sm text-white/60"><EditableText contentKey={`testimonial_${i}_role`} className="text-white/60" /></p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Social Media Posts */}
      <SocialMediaSection />

      <section className="py-20 text-center px-4">
        <RevealSection>
          <h2 className="section-title mb-4"><EditableText contentKey="cta_title" /></h2>
          <p className="section-subtitle mx-auto mb-8"><EditableText contentKey="cta_subtitle" /></p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/programs" className="btn-primary text-lg px-8 py-4">Browse Programs</Link>
            <Link to="/contact" className="btn-outline text-lg px-8 py-4">Get in Touch</Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
