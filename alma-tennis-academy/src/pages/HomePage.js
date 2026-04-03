import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import ProgramCard from '../components/ProgramCard';
import useScrollReveal from '../hooks/useScrollReveal';
import products from '../data/products';
import programs from '../data/programs';

function RevealSection({ children, className = '' }) {
  const [ref, isVisible] = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const popularPrograms = programs.slice(0, 3);

  return (
    <div>
      <HeroSection />

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Equipment</h2>
            <p className="section-subtitle mx-auto">
              Premium tennis gear hand-picked by our coaches to help you perform your best.
            </p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </RevealSection>
        <RevealSection className="text-center mt-10">
          <Link to="/shop" className="btn-outline">
            View All Equipment →
          </Link>
        </RevealSection>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="section-title">Why Choose Alma</h2>
              <p className="section-subtitle mx-auto">
                More than a tennis academy - we're a community dedicated to excellence.
              </p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🏆',
                  title: 'Expert Coaches',
                  desc: 'Our team of certified professionals brings decades of competitive and coaching experience to every lesson.',
                },
                {
                  icon: '🎯',
                  title: 'Personalized Training',
                  desc: 'Every player is unique. We tailor our programs to your skill level, goals, and playing style.',
                },
                {
                  icon: '🌟',
                  title: 'Premium Facilities',
                  desc: 'Train on beautifully maintained courts with top-tier equipment in an inspiring environment.',
                },
              ].map(item => (
                <div key={item.title} className="text-center p-8 rounded-2xl bg-alma-cream hover:bg-alma-cream-dark transition-colors">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-alma-green mb-3">{item.title}</h3>
                  <p className="text-alma-charcoal/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Popular Programs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Programs</h2>
            <p className="section-subtitle mx-auto">
              From beginners to advanced players, find the perfect program for your journey.
            </p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </RevealSection>
        <RevealSection className="text-center mt-10">
          <Link to="/programs" className="btn-outline">
            View All Programs →
          </Link>
        </RevealSection>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-alma-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">What Our Players Say</h2>
              <p className="text-white/70 mt-2 text-lg">Hear from the Alma Tennis Academy community</p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sarah M.',
                  role: 'Adult Beginner Student',
                  text: "I started with zero experience and now I'm playing competitive matches. The coaches are incredibly patient and supportive!",
                },
                {
                  name: 'James R.',
                  role: 'Parent',
                  text: "My kids love the junior program. They've improved so much and made great friends. The summer camp was the highlight of their year.",
                },
                {
                  name: 'Lisa T.',
                  role: 'Competitive Player',
                  text: "The tournament prep program transformed my game. Coach-recommended equipment from the shop is always top quality. Highly recommend!",
                },
              ].map(testimonial => (
                <div key={testimonial.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex text-alma-lime mb-4">{'★★★★★'}</div>
                  <p className="text-white/90 italic mb-6">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-4">
        <RevealSection>
          <h2 className="section-title mb-4">Ready to Start Your Tennis Journey?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Join hundreds of players who have found their home court at Alma Tennis Academy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/programs" className="btn-primary text-lg px-8 py-4">
              Browse Programs
            </Link>
            <Link to="/contact" className="btn-outline text-lg px-8 py-4">
              Get in Touch
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
