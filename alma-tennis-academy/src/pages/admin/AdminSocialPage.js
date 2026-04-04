import { useState } from 'react';
import { usePageContent } from '../../context/PageContentContext';

// CORS proxies
const PROXIES = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
];

async function fetchViaProxy(url) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.text();
    } catch {}
  }
  return null;
}

async function fetchPostMetrics(url) {
  const result = { views: 0, likes: 0, comments: 0, shares: 0, handle: '', title: '', thumbnail: '', fetched: false };
  try {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1]?.split(/[?&#]/)[0];
      else if (url.includes('/shorts/')) videoId = url.split('/shorts/')[1]?.split(/[?&#]/)[0];
      const YT_KEY = 'AIzaSyC144vvBold_KvkxOkqgCsbI6TuIlaJqe4';
      if (videoId) {
        const [ytRes, dislikeRes, oembedRes] = await Promise.allSettled([
          fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${YT_KEY}`),
          fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`),
          fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`),
        ]);
        if (ytRes.status === 'fulfilled' && ytRes.value.ok) {
          const v = (await ytRes.value.json())?.items?.[0];
          if (v) {
            result.views = parseInt(v.statistics?.viewCount) || 0;
            result.likes = parseInt(v.statistics?.likeCount) || 0;
            result.comments = parseInt(v.statistics?.commentCount) || 0;
            result.handle = v.snippet?.channelTitle || '';
            result.title = v.snippet?.title || '';
            result.thumbnail = v.snippet?.thumbnails?.high?.url || '';
            result.fetched = true;
          }
        }
        if (!result.fetched && dislikeRes.status === 'fulfilled' && dislikeRes.value.ok) {
          const d = await dislikeRes.value.json();
          result.views = d.viewCount || 0; result.likes = d.likes || 0; result.fetched = true;
        }
        if (!result.handle && oembedRes.status === 'fulfilled' && oembedRes.value.ok) {
          const d = await oembedRes.value.json();
          result.handle = d.author_name || ''; result.title = result.title || d.title || '';
          result.thumbnail = result.thumbnail || d.thumbnail_url || '';
        }
      }
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      try {
        const r = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (r.ok) { const d = await r.json(); result.handle = d.author_name || ''; result.title = d.title || ''; result.thumbnail = d.thumbnail_url || ''; result.fetched = true; }
      } catch {}
      try {
        const html = await fetchViaProxy(url);
        if (html) {
          const m = html.match(/<script\s+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
          if (m) {
            const j = JSON.parse(m[1]);
            const s = j?.['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct?.stats;
            if (s) { result.views = s.playCount || 0; result.likes = s.diggCount || 0; result.comments = s.commentCount || 0; result.shares = s.shareCount || 0; result.fetched = true; }
          }
          if (!result.views) {
            const v = html.match(/"playCount":\s*(\d+)/); const l = html.match(/"diggCount":\s*(\d+)/);
            const c = html.match(/"commentCount":\s*(\d+)/); const sh = html.match(/"shareCount":\s*(\d+)/);
            if (v) { result.views = parseInt(v[1]); result.fetched = true; }
            if (l) result.likes = parseInt(l[1]); if (c) result.comments = parseInt(c[1]); if (sh) result.shares = parseInt(sh[1]);
          }
        }
      } catch {}
    }

    // Instagram
    if (url.includes('instagram.com')) {
      const code = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/)?.[2];
      const RK = '64e684dbf2mshe45e0b3add984b6p136f6ajsne89a41528e4f';
      if (code) {
        const apis = [
          { host: 'instagram-scraper-api3.p.rapidapi.com', path: `/post_info?code=${code}` },
          { host: 'instagram-scraper-api2.p.rapidapi.com', path: `/v1/post_info?code_or_id_or_url=${code}` },
          { host: 'instagram-bulk-scraper-latest.p.rapidapi.com', path: `/media_info_v2/${code}` },
          { host: 'instagram-scraper21.p.rapidapi.com', path: `/api/v1/post-info?code=${code}` },
        ];
        for (const api of apis) {
          if (result.fetched) break;
          try {
            const r = await fetch(`https://${api.host}${api.path}`, { headers: { 'x-rapidapi-host': api.host, 'x-rapidapi-key': RK }, signal: AbortSignal.timeout(10000) });
            if (r.ok) {
              const raw = await r.json(); const m = raw?.data?.post || raw?.data || raw?.items?.[0] || raw?.graphql?.shortcode_media || raw;
              const lk = m?.like_count || m?.likes?.count || m?.edge_media_preview_like?.count;
              if (lk || m?.comment_count || m?.play_count) {
                result.likes = lk || 0; result.comments = m?.comment_count || m?.comments?.count || 0;
                result.views = m?.play_count || m?.video_view_count || 0; result.shares = m?.share_count || 0;
                const u = m?.user?.username || m?.owner?.username; if (u) result.handle = '@' + u;
                result.title = (m?.caption?.text || '').substring(0, 100);
                result.thumbnail = m?.thumbnail_url || m?.image_versions2?.candidates?.[0]?.url || m?.display_url || '';
                result.fetched = true;
              }
            }
          } catch {}
        }
      }
      if (!result.handle) {
        try { const r = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`); if (r.ok) { const d = await r.json(); result.handle = d.author_name ? '@'+d.author_name : ''; result.title = result.title || d.title || ''; result.thumbnail = result.thumbnail || d.thumbnail_url || ''; result.fetched = true; } } catch {}
      }
    }
  } catch {}
  return result;
}

function detectPlatform(url) {
  if (!url) return null;
  if (url.includes('instagram')) return { icon: '📸', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500' };
  if (url.includes('youtube') || url.includes('youtu.be')) return { icon: '▶️', name: 'YouTube', color: 'bg-red-500' };
  if (url.includes('tiktok')) return { icon: '🎵', name: 'TikTok', color: 'bg-gray-900' };
  return null;
}

export default function AdminSocialPage() {
  const { content, updateContent } = usePageContent();
  const [fetching, setFetching] = useState({});
  const [fetchingAll, setFetchingAll] = useState(false);
  const [saved, setSaved] = useState('');

  const postCount = parseInt(content.social_post_count) || 0;

  const addPost = () => updateContent('social_post_count', (postCount + 1).toString());

  const removePost = (index) => {
    for (let i = index; i < postCount; i++) {
      ['post', 'handle', 'views', 'likes', 'comments', 'shares', 'title', 'thumbnail'].forEach(f => {
        updateContent(`social_${f}_${i}`, content[`social_${f}_${i + 1}`] || '');
      });
    }
    ['post', 'handle', 'views', 'likes', 'comments', 'shares', 'title', 'thumbnail'].forEach(f => {
      updateContent(`social_${f}_${postCount}`, '');
    });
    updateContent('social_post_count', (postCount - 1).toString());
  };

  const fetchSinglePost = async (i) => {
    const url = content[`social_post_${i}`];
    if (!url || !url.trim()) return;
    setFetching(prev => ({ ...prev, [i]: true }));
    try {
      const data = await fetchPostMetrics(url.trim());
      if (data.handle) updateContent(`social_handle_${i}`, data.handle);
      if (data.views) updateContent(`social_views_${i}`, data.views.toString());
      if (data.likes) updateContent(`social_likes_${i}`, data.likes.toString());
      if (data.comments) updateContent(`social_comments_${i}`, data.comments.toString());
      if (data.shares) updateContent(`social_shares_${i}`, data.shares.toString());
      if (data.title) updateContent(`social_title_${i}`, data.title);
      if (data.thumbnail) updateContent(`social_thumbnail_${i}`, data.thumbnail);
      const parts = [];
      if (data.views) parts.push(`${data.views.toLocaleString()} views`);
      if (data.likes) parts.push(`${data.likes.toLocaleString()} likes`);
      if (data.comments) parts.push(`${data.comments.toLocaleString()} comments`);
      if (data.shares) parts.push(`${data.shares.toLocaleString()} shares`);
      setSaved(parts.length > 0 ? `Post ${i}: ${parts.join(' · ')}` : `Post ${i}: Basic info only`);
      setTimeout(() => setSaved(''), 5000);
    } catch {}
    setFetching(prev => ({ ...prev, [i]: false }));
  };

  const fetchAllPosts = async () => {
    setFetchingAll(true);
    for (let i = 1; i <= postCount; i++) { if (content[`social_post_${i}`]) await fetchSinglePost(i); }
    setFetchingAll(false);
    setSaved('All posts updated!'); setTimeout(() => setSaved(''), 3000);
  };

  const posts = [];
  for (let i = 1; i <= postCount; i++) posts.push(i);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-alma-green">Social Media Posts</h1>
          <p className="text-sm text-alma-charcoal/50 mt-1">{postCount} posts · Displayed in iPhone frames on homepage</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">{saved}</span>}
          {postCount > 0 && (
            <button onClick={fetchAllPosts} disabled={fetchingAll}
              className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-1.5">
              {fetchingAll ? <><span className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Fetching...</> : '🔄 Update All'}
            </button>
          )}
        </div>
      </div>

      {/* Toggle + Section Title/Subtitle */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-alma-green">Show on Homepage</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${content.social_media_enabled === 'yes' ? 'text-green-600' : 'text-alma-charcoal/40'}`}>
              {content.social_media_enabled === 'yes' ? 'Visible' : 'Hidden'}
            </span>
            <button onClick={() => updateContent('social_media_enabled', content.social_media_enabled === 'yes' ? 'no' : 'yes')}
              className={`relative w-11 h-6 rounded-full transition-colors ${content.social_media_enabled === 'yes' ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.social_media_enabled === 'yes' ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-alma-green mb-1">Section Title</label>
            <input type="text" value={content.social_title || 'Follow Us'} onChange={e => updateContent('social_title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-alma-green mb-1">Section Subtitle</label>
            <input type="text" value={content.social_subtitle || ''} onChange={e => updateContent('social_subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map(i => {
          const url = content[`social_post_${i}`] || '';
          const platform = detectPlatform(url);
          const views = parseInt(content[`social_views_${i}`]) || 0;
          const likes = parseInt(content[`social_likes_${i}`]) || 0;
          const comments = parseInt(content[`social_comments_${i}`]) || 0;
          const shares = parseInt(content[`social_shares_${i}`]) || 0;
          const totalInteractions = likes + comments + shares;
          const engagementRate = views > 0 ? ((totalInteractions / views) * 100).toFixed(2) : '0.00';
          const likeabilityRate = views > 0 ? ((likes / views) * 100).toFixed(2) : '0.00';
          const sharabilityRate = views > 0 ? ((shares / views) * 100).toFixed(2) : '0.00';
          const isFetching = fetching[i];

          return (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-alma-green">Post {i}</span>
                  {platform && <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${platform.color}`}>{platform.icon} {platform.name}</span>}
                  {content[`social_title_${i}`] && <span className="text-[10px] text-alma-charcoal/40 truncate max-w-[200px]">— {content[`social_title_${i}`]}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {url && <button onClick={() => fetchSinglePost(i)} disabled={isFetching}
                    className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-50 flex items-center gap-1">
                    {isFetching ? <><span className="w-2.5 h-2.5 border border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Fetching...</> : '🔄 Update'}
                  </button>}
                  {url && <button onClick={() => removePost(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                </div>
              </div>

              {content[`social_thumbnail_${i}`] && (
                <div className="mb-3 flex items-center gap-3">
                  <img src={content[`social_thumbnail_${i}`]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="text-xs text-alma-charcoal/50">
                    {content[`social_handle_${i}`] && <p className="font-semibold text-alma-green">{content[`social_handle_${i}`]}</p>}
                    {content[`social_title_${i}`] && <p className="truncate max-w-xs">{content[`social_title_${i}`]}</p>}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-medium text-alma-charcoal/50 mb-1 uppercase tracking-wide">Post URL</label>
                  <input type="url" value={url} onChange={e => updateContent(`social_post_${i}`, e.target.value)}
                    placeholder="Paste Instagram, YouTube, or TikTok link..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-alma-charcoal/50 mb-1 uppercase tracking-wide">Handle</label>
                  <input type="text" value={content[`social_handle_${i}`] || ''} onChange={e => updateContent(`social_handle_${i}`, e.target.value)}
                    placeholder="@account" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
                </div>
              </div>

              {url && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[{ key: 'views', icon: '👁', label: 'Views' }, { key: 'likes', icon: '❤️', label: 'Likes' },
                      { key: 'comments', icon: '💬', label: 'Comments' }, { key: 'shares', icon: '🔄', label: 'Shares' }].map(m => (
                      <div key={m.key}>
                        <label className="block text-[9px] text-alma-charcoal/40 mb-0.5">{m.icon} {m.label}</label>
                        <input type="number" min="0" value={content[`social_${m.key}_${i}`] || ''} onChange={e => updateContent(`social_${m.key}_${i}`, e.target.value)}
                          placeholder="0" className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs outline-none focus:border-alma-lime" />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: '📊 Engagement', rate: engagementRate, formula: '(L+C+S)/Views', thresholds: [5, 2] },
                      { label: '👍 Likeability', rate: likeabilityRate, formula: 'Likes/Views', thresholds: [4, 1.5] },
                      { label: '📤 Sharability', rate: sharabilityRate, formula: 'Shares/Views', thresholds: [1, 0.3] },
                    ].map(r => (
                      <div key={r.label}>
                        <label className="block text-[9px] text-alma-charcoal/40 mb-0.5">{r.label}</label>
                        <div className={`px-2 py-2 rounded text-xs font-bold text-center ${
                          parseFloat(r.rate) > r.thresholds[0] ? 'bg-green-100 text-green-700' :
                          parseFloat(r.rate) > r.thresholds[1] ? 'bg-alma-lime/10 text-alma-green' :
                          parseFloat(r.rate) > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                        }`}>{r.rate}%</div>
                        <p className="text-[8px] text-alma-charcoal/30 mt-0.5 text-center">{r.formula}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {[
                      { label: 'Engagement', rate: engagementRate, scale: 5, colors: ['bg-green-500', 'bg-alma-lime', 'bg-yellow-400'], thresholds: [5, 2] },
                      { label: 'Likeability', rate: likeabilityRate, scale: 10, colors: ['bg-green-500', 'bg-blue-400', 'bg-yellow-400'], thresholds: [4, 1.5] },
                      { label: 'Sharability', rate: sharabilityRate, scale: 30, colors: ['bg-green-500', 'bg-purple-400', 'bg-yellow-400'], thresholds: [1, 0.3] },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-2">
                        <span className="text-[9px] text-alma-charcoal/40 w-20">{b.label}</span>
                        <div className="flex-grow bg-gray-100 rounded-full h-1.5">
                          <div className={`rounded-full h-1.5 transition-all ${
                            parseFloat(b.rate) > b.thresholds[0] ? b.colors[0] : parseFloat(b.rate) > b.thresholds[1] ? b.colors[1] : b.colors[2]
                          }`} style={{ width: `${Math.min(parseFloat(b.rate) * b.scale, 100)}%` }} />
                        </div>
                        <span className="text-[9px] text-alma-charcoal/40 w-12 text-right">{b.rate}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={addPost}
        className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-alma-charcoal/50 hover:border-alma-lime hover:text-alma-green transition-all">
        + Add Another Post
      </button>

      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-alma-charcoal/50 space-y-1">
        <p className="font-semibold text-alma-charcoal/60">Supported: 📸 Instagram · ▶️ YouTube · 🎵 TikTok</p>
        <p className="text-alma-charcoal/40">📊 Engagement = (L+C+S)/Views · 👍 Likeability = Likes/Views · 📤 Sharability = Shares/Views</p>
        <p className="text-alma-charcoal/40">🟢 Great | 🟡 Good | 🔴 Low</p>
      </div>
    </div>
  );
}
