import React, { useState } from 'react';

const columns = [
  {
    title: 'Products',
    links: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise', 'Cloud Serverless', 'Cloud Dedicated', 'Telegraf', 'InfluxDB 3 Explorer'],
  },
  {
    title: 'Developers',
    links: ['Documentation', 'Client Libraries', 'API Reference', 'University', 'Community Forum', 'GitHub'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Press', 'Partners', 'Contact'],
  },
  {
    title: 'Community',
    links: ['Slack', 'Events', 'InfluxDays', 'Community Showcase', 'Contributor Guide'],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative border-t border-white/5 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#22ADF6" strokeWidth="2" />
                <path d="M8 20 L14 12 L20 16 L26 8" stroke="#22ADF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-white font-semibold">
                influx<span className="text-cyan-400">data</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The open-source platform for time series data.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {['GitHub', 'X', 'Slack', 'YT'].map((s) => (
                <span key={s} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-500 text-xs hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-200 cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="text-white font-semibold text-sm mb-4">{col.title}</h5>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-12">
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
            <p className="text-gray-500 text-sm">Get the latest on InfluxDB 3, tutorials, and community news.</p>
          </div>
          <div className="flex w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-l-xl bg-navy-900 border border-white/10 border-r-0 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50"
            />
            <button className="px-5 py-2.5 rounded-r-xl bg-cyan-400 text-navy-900 font-semibold text-sm hover:shadow-[0_0_20px_rgba(34,173,246,0.3)] transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-gray-600 text-sm">&copy; 2026 InfluxData Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Security'].map((l) => (
              <a key={l} href="#top" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
