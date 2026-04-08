import useScrollReveal from '../hooks/useScrollReveal';
import EditableText from '../components/EditableText';

function RevealSection({ children, className = '' }) {
  const [ref, isVisible] = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <section className="bg-alma-green text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6"><EditableText contentKey="about_title" className="text-white" /></h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto"><EditableText contentKey="about_subtitle" className="text-white/80" /></p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6"><EditableText contentKey="about_story_title" /></h2>
              <div className="space-y-4 text-alma-charcoal/70 leading-relaxed">
                <p><EditableText contentKey="about_story_p1" /></p>
                <p><EditableText contentKey="about_story_p2" /></p>
                <p><EditableText contentKey="about_story_p3" /></p>
              </div>
            </div>
            <div className="bg-alma-green/5 rounded-2xl p-12 text-center">
              <div className="text-8xl mb-4">🏟️</div>
              <p className="text-alma-green font-semibold">Our Academy Campus</p>
              <p className="text-sm text-alma-charcoal/50 mt-1">8 courts, pro shop, fitness center</p>
            </div>
          </div>
        </RevealSection>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="text-center mb-12"><h2 className="section-title">Our Values</h2></div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-center p-6 rounded-2xl bg-alma-cream">
                  <div className="text-4xl mb-3"><EditableText contentKey={`about_value_${i}_icon`} /></div>
                  <h3 className="font-semibold text-alma-green mb-2"><EditableText contentKey={`about_value_${i}_title`} /></h3>
                  <p className="text-sm text-alma-charcoal/60"><EditableText contentKey={`about_value_${i}_desc`} /></p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Coaches</h2>
            <p className="section-subtitle mx-auto">Experienced professionals dedicated to your success.</p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card p-6 text-center">
                <div className="w-20 h-20 bg-alma-cream rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  <EditableText contentKey={`about_coach_${i}_icon`} />
                </div>
                <h3 className="font-semibold text-alma-green"><EditableText contentKey={`about_coach_${i}_name`} /></h3>
                <p className="text-sm text-alma-lime font-medium mt-1"><EditableText contentKey={`about_coach_${i}_role`} /></p>
                <p className="text-sm text-alma-charcoal/60 mt-3"><EditableText contentKey={`about_coach_${i}_bio`} /></p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      <section className="py-16 bg-alma-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="text-4xl font-bold text-alma-lime"><EditableText contentKey={`about_stat_${i}`} className="text-alma-lime" /></div>
                <div className="text-white/70 mt-1"><EditableText contentKey={`about_stat_${i}_label`} className="text-white/70" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
