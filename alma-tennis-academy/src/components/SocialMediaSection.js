import { usePageContent } from '../context/PageContentContext';
import EditableText from './EditableText';
import useScrollReveal from '../hooks/useScrollReveal';

function parseEmbed(url) {
  if (!url) return null;

  // Instagram
  if (url.includes('instagram.com')) {
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/);
    if (match) return { type: 'instagram', id: match[2], embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed` };
  }

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    else if (url.includes('v=')) videoId = url.split('v=')[1]?.split(/[?&#]/)[0];
    else if (url.includes('/shorts/')) videoId = url.split('/shorts/')[1]?.split(/[?&#]/)[0];
    if (videoId) return { type: 'youtube', id: videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` };
  }

  // TikTok
  if (url.includes('tiktok.com')) {
    const match = url.match(/video\/(\d+)/);
    if (match) return { type: 'tiktok', id: match[1], embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` };
  }

  return null;
}

function IPhoneFrame({ children, platform }) {
  const platformColors = {
    instagram: 'from-purple-500 via-pink-500 to-yellow-500',
    youtube: 'from-red-600 to-red-500',
    tiktok: 'from-gray-900 to-gray-800',
  };

  const platformIcons = {
    instagram: '📸 Instagram',
    youtube: '▶️ YouTube',
    tiktok: '🎵 TikTok',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto" style={{ width: 280 }}>
        {/* iPhone outer shell */}
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10 flex items-center justify-center">
            <div className="w-16 h-3 bg-gray-800 rounded-full" />
          </div>
          {/* Screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: 500 }}>
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center mt-2">
            <div className="w-28 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
      {/* Platform label */}
      {platform && (
        <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${platformColors[platform] || 'from-gray-500 to-gray-400'}`}>
          {platformIcons[platform] || platform}
        </div>
      )}
    </div>
  );
}

export default function SocialMediaSection() {
  const { content } = usePageContent();
  const [ref, isVisible] = useScrollReveal(0.1);

  const showSection = content.social_media_enabled === 'yes';
  if (!showSection) return null;

  const posts = [
    { url: content.social_post_1 || '', label: '1' },
    { url: content.social_post_2 || '', label: '2' },
    { url: content.social_post_3 || '', label: '3' },
  ].map(p => ({ ...p, embed: parseEmbed(p.url) })).filter(p => p.embed);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <h2 className="section-title">
              <EditableText contentKey="social_title" />
            </h2>
            <p className="section-subtitle mx-auto">
              <EditableText contentKey="social_subtitle" />
            </p>
          </div>

          <div className={`grid gap-8 justify-items-center ${
            posts.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
            posts.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {posts.map((post, i) => (
              <IPhoneFrame key={i} platform={post.embed.type}>
                <iframe
                  src={post.embed.embedUrl}
                  title={`Social post ${i + 1}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="encrypted-media"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 0 }}
                />
              </IPhoneFrame>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
