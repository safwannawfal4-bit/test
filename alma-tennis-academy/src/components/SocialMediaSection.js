import { useState, useRef, useEffect } from 'react';
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

function IPhoneFrame({ children, post, isCenter }) {
  const platform = platformStyles[post.embed.type] || {};

  return (
    <div className={`flex flex-col items-center transition-all duration-500 ${isCenter ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}
      style={{ minWidth: 300 }}>
      <div className="relative mx-auto" style={{ width: 280 }}>
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10 flex items-center justify-center">
            <div className="w-16 h-3 bg-gray-800 rounded-full" />
          </div>
          <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: 480 }}>
            {children}
          </div>
          <div className="flex justify-center mt-2">
            <div className="w-28 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Handle + platform */}
      <a href={post.url} target="_blank" rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 group hover:scale-105 transition-transform">
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${platform.gradient}`}>
          {platform.icon} {post.handle || platform.name}
        </span>
        <svg className="w-3.5 h-3.5 text-alma-charcoal/30 group-hover:text-alma-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export default function SocialMediaSection() {
  const { content } = usePageContent();
  const [ref, isVisible] = useScrollReveal(0.1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const carouselRef = useRef(null);

  if (content.social_media_enabled !== 'yes') return null;

  // Parse all posts from content (unlimited, using counter)
  const postCount = parseInt(content.social_post_count) || 0;
  const posts = [];
  for (let i = 1; i <= postCount; i++) {
    const url = content[`social_post_${i}`];
    if (!url || !url.trim()) continue;
    const embed = parseEmbed(url);
    if (embed) {
      posts.push({
        url,
        handle: content[`social_handle_${i}`] || '',
        embed,
      });
    }
  }

  if (posts.length === 0) return null;

  const goTo = (idx) => {
    setCurrentIndex(Math.max(0, Math.min(idx, posts.length - 1)));
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) goTo(currentIndex + 1);
    else if (diff < -50) goTo(currentIndex - 1);
    setTouchStart(null);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="section-title"><EditableText contentKey="social_title" /></h2>
            <p className="section-subtitle mx-auto"><EditableText contentKey="social_subtitle" /></p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Arrow buttons */}
            {posts.length > 1 && (
              <>
                <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-alma-green hover:bg-alma-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === posts.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-alma-green hover:bg-alma-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Carousel track */}
            <div className="overflow-hidden mx-12" ref={carouselRef}
              onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(calc(-${currentIndex * 100}% / ${Math.min(posts.length, 3)} + ${posts.length <= 3 ? 0 : (currentIndex > 0 ? 33 : 0)}%))` }}>

                {/* Show 1 at a time on mobile, up to 3 on desktop */}
                {posts.length <= 3 ? (
                  // Grid for 3 or fewer
                  <div className={`w-full flex justify-center gap-8 flex-wrap md:flex-nowrap`}>
                    {posts.map((post, idx) => (
                      <IPhoneFrame key={idx} post={post} isCenter={true}>
                        <iframe src={post.embed.embedUrl} title={`Post ${idx + 1}`}
                          width="100%" height="100%" frameBorder="0" allow="encrypted-media" allowFullScreen loading="lazy" style={{ border: 0 }} />
                      </IPhoneFrame>
                    ))}
                  </div>
                ) : (
                  // Slider for more than 3
                  posts.map((post, idx) => (
                    <div key={idx} className="flex-shrink-0 px-4" style={{ width: '33.333%' }}>
                      <IPhoneFrame post={post} isCenter={idx === currentIndex + 1 || (posts.length <= 3)}>
                        <iframe src={post.embed.embedUrl} title={`Post ${idx + 1}`}
                          width="100%" height="100%" frameBorder="0" allow="encrypted-media" allowFullScreen loading="lazy" style={{ border: 0 }} />
                      </IPhoneFrame>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dots */}
            {posts.length > 3 && (
              <div className="flex justify-center gap-2 mt-8">
                {posts.map((_, idx) => (
                  <button key={idx} onClick={() => goTo(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-alma-green scale-125' : 'bg-alma-charcoal/20 hover:bg-alma-charcoal/40'
                    }`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
