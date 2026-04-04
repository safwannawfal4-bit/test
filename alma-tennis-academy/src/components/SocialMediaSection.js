import { useState } from 'react';
import { usePageContent } from '../context/PageContentContext';
import EditableText from './EditableText';
import useScrollReveal from '../hooks/useScrollReveal';

function parseEmbed(url) {
  if (!url) return null;
  if (url.includes('instagram.com')) {
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/);
    if (match) return { type: 'instagram', id: match[2], embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed`, postUrl: url };
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    else if (url.includes('v=')) videoId = url.split('v=')[1]?.split(/[?&#]/)[0];
    else if (url.includes('/shorts/')) videoId = url.split('/shorts/')[1]?.split(/[?&#]/)[0];
    if (videoId) return { type: 'youtube', id: videoId, embedUrl: `https://www.youtube.com/embed/${videoId}`, postUrl: url };
  }
  if (url.includes('tiktok.com')) {
    const match = url.match(/video\/(\d+)/);
    if (match) return { type: 'tiktok', id: match[1], embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}`, postUrl: url };
  }
  return null;
}

const platformStyles = {
  instagram: { gradient: 'from-purple-500 via-pink-500 to-yellow-500', icon: '📸', name: 'Instagram' },
  youtube: { gradient: 'from-red-600 to-red-500', icon: '▶️', name: 'YouTube' },
  tiktok: { gradient: 'from-gray-900 to-gray-800', icon: '🎵', name: 'TikTok' },
};

function IPhoneFrame({ post, isActive }) {
  const platform = platformStyles[post.embed.type] || {};

  return (
    <div className={`flex flex-col items-center transition-all duration-500 ease-out ${
      isActive ? 'scale-100 opacity-100' : 'scale-[0.85] opacity-40 blur-[1px]'
    }`}>
      <div className="relative mx-auto" style={{ width: 280 }}>
        {/* Phone shell */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-[10px] shadow-2xl">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-[22px] bg-black rounded-full z-10" />
          {/* Screen */}
          <div className="bg-black rounded-[2rem] overflow-hidden" style={{ height: 490 }}>
            <iframe
              src={post.embed.embedUrl}
              title={post.handle || 'Social post'}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              loading="lazy"
              style={{ border: 0, background: '#000' }}
            />
          </div>
          {/* Home bar */}
          <div className="flex justify-center py-2">
            <div className="w-28 h-1 bg-gray-500 rounded-full" />
          </div>
        </div>

        {/* Reflection effect */}
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
      </div>

      {/* Handle + link to post */}
      <a href={post.url} target="_blank" rel="noopener noreferrer"
        className="mt-5 flex items-center gap-2 group hover:scale-105 transition-transform">
        <span className={`px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${platform.gradient} shadow-lg`}>
          {platform.icon} {post.handle || platform.name}
        </span>
        <span className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center group-hover:shadow-md transition-shadow">
          <svg className="w-3 h-3 text-alma-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </a>
    </div>
  );
}

export default function SocialMediaSection() {
  const { content } = usePageContent();
  const [ref, isVisible] = useScrollReveal(0.1);
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  if (content.social_media_enabled !== 'yes') return null;

  const postCount = parseInt(content.social_post_count) || 0;
  const posts = [];
  for (let i = 1; i <= postCount; i++) {
    const url = content[`social_post_${i}`];
    if (!url || !url.trim()) continue;
    const embed = parseEmbed(url);
    if (embed) posts.push({ url, handle: content[`social_handle_${i}`] || '', embed });
  }

  if (posts.length === 0) return null;

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(posts.length - 1, c + 1));

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-14">
            <h2 className="section-title"><EditableText contentKey="social_title" /></h2>
            <p className="section-subtitle mx-auto"><EditableText contentKey="social_subtitle" /></p>
          </div>

          {posts.length <= 3 ? (
            /* Grid for 1-3 posts */
            <div className={`flex justify-center gap-8 flex-wrap`}>
              {posts.map((post, idx) => (
                <IPhoneFrame key={idx} post={post} isActive={true} />
              ))}
            </div>
          ) : (
            /* Carousel for 4+ posts */
            <div className="relative">
              {/* Left arrow */}
              <button onClick={prev} disabled={current === 0}
                className="absolute -left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center text-alma-green hover:bg-white hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right arrow */}
              <button onClick={next} disabled={current === posts.length - 1}
                className="absolute -right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center text-alma-green hover:bg-white hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel viewport */}
              <div className="overflow-hidden px-8 md:px-16"
                onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
                onTouchEnd={e => {
                  if (touchStartX === null) return;
                  const diff = touchStartX - e.changedTouches[0].clientX;
                  if (diff > 50) next();
                  else if (diff < -50) prev();
                  setTouchStartX(null);
                }}>
                <div className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(calc(-${current} * (300px + 2rem) + (50% - 150px)))`,
                  }}>
                  {posts.map((post, idx) => (
                    <div key={idx} className="flex-shrink-0 px-4" style={{ width: 300 }}>
                      <IPhoneFrame post={post} isActive={idx === current} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-10">
                {posts.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrent(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === current
                        ? 'w-8 h-2.5 bg-alma-green'
                        : 'w-2.5 h-2.5 bg-alma-charcoal/15 hover:bg-alma-charcoal/30'
                    }`} />
                ))}
              </div>

              {/* Counter */}
              <p className="text-center text-xs text-alma-charcoal/30 mt-3">
                {current + 1} / {posts.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
