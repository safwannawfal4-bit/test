import useScrollReveal from '../hooks/useScrollReveal';

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

export default function AboutPage() {
  const coaches = [
    {
      name: 'Coach Maria Santos',
      role: 'Head Coach & Founder',
      bio: 'Former WTA-ranked player with 20+ years of coaching experience. Maria founded Alma Tennis Academy with a vision to make professional tennis training accessible to everyone.',
      emoji: '👩‍🏫',
    },
    {
      name: 'Coach David Chen',
      role: 'Senior Coach - Competitive Program',
      bio: 'NCAA Division I champion and certified USPTA Elite Professional. David specializes in developing competitive juniors and advanced adult players.',
      emoji: '👨‍🏫',
    },
    {
      name: 'Coach Ana Rodriguez',
      role: 'Junior Development Director',
      bio: 'Passionate about introducing young players to tennis. Ana creates fun, engaging programs that build skills and confidence in players ages 4-12.',
      emoji: '👩‍🏫',
    },
    {
      name: 'Coach James Wilson',
      role: 'Fitness & Performance Coach',
      bio: 'Certified strength and conditioning specialist who designs sport-specific training programs to enhance speed, agility, and endurance on the court.',
      emoji: '💪',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-alma-green text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About Alma Tennis Academy</h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Founded with a passion for tennis and a commitment to excellence,
            Alma Tennis Academy has been nurturing players of all levels for over a decade.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our Story</h2>
              <div className="space-y-4 text-alma-charcoal/70 leading-relaxed">
                <p>
                  Alma Tennis Academy was born from a simple belief: that everyone deserves
                  access to quality tennis instruction in a welcoming environment. What started
                  as a small group of passionate players has grown into one of the region's
                  most respected tennis programs.
                </p>
                <p>
                  "Alma" means "soul" - and that's exactly what we put into everything we do.
                  From our carefully designed programs to our hand-selected equipment in our shop,
                  every detail is crafted with the player's experience in mind.
                </p>
                <p>
                  Today, we serve over 500 students across all age groups and skill levels,
                  with a team of 15+ certified coaches who share our passion for developing
                  players both on and off the court.
                </p>
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

      {/* Values */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="section-title">Our Values</h2>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: '❤️', title: 'Passion', desc: 'We love tennis and it shows in everything we do.' },
                { icon: '🤝', title: 'Community', desc: 'We build lasting friendships and support each other.' },
                { icon: '📈', title: 'Growth', desc: "There's always room to improve, no matter your level." },
                { icon: '🎯', title: 'Excellence', desc: 'We set high standards and help you reach them.' },
              ].map(value => (
                <div key={value.title} className="text-center p-6 rounded-2xl bg-alma-cream">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="font-semibold text-alma-green mb-2">{value.title}</h3>
                  <p className="text-sm text-alma-charcoal/60">{value.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Coaches */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Coaches</h2>
            <p className="section-subtitle mx-auto">
              Experienced professionals dedicated to your success.
            </p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map(coach => (
              <div key={coach.name} className="card p-6 text-center">
                <div className="w-20 h-20 bg-alma-cream rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {coach.emoji}
                </div>
                <h3 className="font-semibold text-alma-green">{coach.name}</h3>
                <p className="text-sm text-alma-lime font-medium mt-1">{coach.role}</p>
                <p className="text-sm text-alma-charcoal/60 mt-3">{coach.bio}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Stats */}
      <section className="py-16 bg-alma-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Active Students' },
              { number: '15+', label: 'Certified Coaches' },
              { number: '8', label: 'Tennis Courts' },
              { number: '10+', label: 'Years of Excellence' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-alma-lime">{stat.number}</div>
                <div className="text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
