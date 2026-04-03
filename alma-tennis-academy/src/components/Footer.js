import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-alma-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Alma Tennis Academy"
              className="h-10 w-auto brightness-200 mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Elevating your tennis game through professional coaching,
              quality equipment, and a passionate community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-alma-lime mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/shop', label: 'Shop Equipment' },
                { to: '/programs', label: 'Programs' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-alma-lime transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-alma-lime mb-4">Programs</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Junior Development</li>
              <li>Adult Beginner</li>
              <li>Private Coaching</li>
              <li>Summer Camps</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-alma-lime mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Tennis Court Lane
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (555) 123-ALMA
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@almatennisacademy.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Alma Tennis Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
