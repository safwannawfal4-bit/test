import { Link } from 'react-router-dom';
import Logo from './Logo';
import EditableText from './EditableText';

export default function Footer() {
  return (
    <footer className="bg-alma-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="mb-4"><Logo size="sm" variant="light" /></div>
            <p className="text-white/70 text-sm leading-relaxed">
              <EditableText contentKey="footer_desc" className="text-white/70" />
            </p>
          </div>

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
                  <Link to={link.to} className="text-white/70 hover:text-alma-lime transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-alma-lime mb-4">Programs</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><EditableText contentKey="footer_program_1" className="text-white/70" /></li>
              <li><EditableText contentKey="footer_program_2" className="text-white/70" /></li>
              <li><EditableText contentKey="footer_program_3" className="text-white/70" /></li>
              <li><EditableText contentKey="footer_program_4" className="text-white/70" /></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-alma-lime mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <EditableText contentKey="footer_address" className="text-white/70" />
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <EditableText contentKey="footer_phone" className="text-white/70" />
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-alma-lime flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <EditableText contentKey="footer_email" className="text-white/70" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} <EditableText contentKey="footer_copyright" className="text-white/50" /></p>
        </div>
      </div>
    </footer>
  );
}
