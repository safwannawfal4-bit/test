import { useState } from 'react';
import EditableText from '../components/EditableText';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="section-title"><EditableText contentKey="contact_title" /></h1>
        <p className="section-subtitle mx-auto"><EditableText contentKey="contact_subtitle" /></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-2xl font-semibold text-alma-green mb-2">Message Sent!</h2>
              <p className="text-alma-charcoal/60">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-alma-green mb-1">First Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-alma-green mb-1">Last Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-alma-green mb-1">Email</label>
                <input required type="email" className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-alma-green mb-1">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all">
                  <option>General Inquiry</option><option>Program Information</option>
                  <option>Shop / Equipment</option><option>Private Lessons</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-alma-green mb-1">Message</label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-alma-green/5 rounded-2xl h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">📍</div>
              <p className="text-alma-green font-semibold">Map Placeholder</p>
              <p className="text-sm text-alma-charcoal/50">Your address would appear here</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'contact_address', title: 'Address', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              { key: 'contact_phone', title: 'Phone', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
              { key: 'contact_email', title: 'Email', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
              { key: 'contact_hours', title: 'Hours', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            ].map(info => (
              <div key={info.key} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-12 h-12 bg-alma-lime/20 rounded-full flex items-center justify-center text-alma-green flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-alma-green">{info.title}</h3>
                  <p className="text-sm text-alma-charcoal/60 mt-1"><EditableText contentKey={info.key} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
