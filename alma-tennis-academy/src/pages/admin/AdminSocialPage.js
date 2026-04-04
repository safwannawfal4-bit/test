import { useState, useRef } from 'react';
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

function ExecutiveDashboard({ content, postCount }) {
  const execRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  // Gather data
  const posts = [];
  for (let i = 1; i <= postCount; i++) {
    const url = content[`social_post_${i}`] || '';
    if (!url) continue;
    const views = parseInt(content[`social_views_${i}`]) || 0;
    const likes = parseInt(content[`social_likes_${i}`]) || 0;
    const comments = parseInt(content[`social_comments_${i}`]) || 0;
    const shares = parseInt(content[`social_shares_${i}`]) || 0;
    const platform = detectPlatform(url);
    posts.push({
      index: i, views, likes, comments, shares,
      handle: content[`social_handle_${i}`] || `Post ${i}`,
      title: content[`social_title_${i}`] || '',
      thumbnail: content[`social_thumbnail_${i}`] || '',
      platform: platform?.name || 'Other',
      platformIcon: platform?.icon || '📱',
      total: likes + comments + shares,
      engagement: views > 0 ? (likes + comments + shares) / views * 100 : 0,
      likeability: views > 0 ? likes / views * 100 : 0,
      sharability: views > 0 ? shares / views * 100 : 0,
    });
  }

  const tv = posts.reduce((s, p) => s + p.views, 0);
  const tl = posts.reduce((s, p) => s + p.likes, 0);
  const tc = posts.reduce((s, p) => s + p.comments, 0);
  const ts = posts.reduce((s, p) => s + p.shares, 0);
  const ti = tl + tc + ts;
  const engRate = tv > 0 ? (ti / tv * 100).toFixed(2) : '0.00';
  const likeRate = tv > 0 ? (tl / tv * 100).toFixed(2) : '0.00';
  const shareRate = tv > 0 ? (ts / tv * 100).toFixed(2) : '0.00';

  // Platform data
  const platforms = {};
  posts.forEach(p => {
    if (!platforms[p.platform]) platforms[p.platform] = { icon: p.platformIcon, views: 0, likes: 0, comments: 0, shares: 0, count: 0 };
    platforms[p.platform].views += p.views; platforms[p.platform].likes += p.likes;
    platforms[p.platform].comments += p.comments; platforms[p.platform].shares += p.shares;
    platforms[p.platform].count += 1;
  });

  const bestPost = [...posts].sort((a, b) => b.engagement - a.engagement)[0];
  const mostViewed = [...posts].sort((a, b) => b.views - a.views)[0];
  const mostShared = [...posts].sort((a, b) => b.shares - a.shares)[0];

  const exportPDF = async () => {
    if (!execRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(execRef.current, { scale: 2, backgroundColor: '#0F172A', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Executive-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) { alert('Export failed: ' + err.message); }
    setExporting(false);
  };

  if (posts.length === 0) return (
    <div className="bg-slate-900 rounded-2xl p-16 text-center">
      <p className="text-4xl mb-4">📊</p>
      <p className="text-white/50 text-lg">Add posts and fetch metrics to generate your executive report.</p>
    </div>
  );

  const fmt = (n) => n >= 1000000 ? (n/1000000).toFixed(1) + 'M' : n >= 1000 ? (n/1000).toFixed(1) + 'K' : n.toString();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={exportPDF} disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 shadow-lg">
          {exporting ? <><span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> Exporting...</> : '📄 Export Executive PDF'}
        </button>
      </div>

      <div ref={execRef} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.3em]">Executive Summary</p>
              <h2 className="text-3xl font-bold text-white mt-2">Social Media Performance</h2>
              <p className="text-white/40 text-sm mt-1">Alma Tennis Academy · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-white">{posts.length}</p>
              <p className="text-xs text-white/40 uppercase tracking-wider">Active Posts</p>
            </div>
          </div>
        </div>

        {/* Big Numbers Row */}
        <div className="grid grid-cols-4 divide-x divide-white/5">
          {[
            { label: 'Total Reach', value: fmt(tv), sub: 'impressions', icon: '👁', color: 'text-cyan-400' },
            { label: 'Engagements', value: fmt(ti), sub: 'interactions', icon: '🤝', color: 'text-emerald-400' },
            { label: 'Engagement Rate', value: engRate + '%', sub: 'avg across posts', icon: '📈', color: 'text-amber-400' },
            { label: 'Content Pieces', value: posts.length.toString(), sub: Object.keys(platforms).join(' · '), icon: '📱', color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="p-8 text-center">
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm text-white/70 font-medium mt-2">{s.label}</p>
              <p className="text-xs text-white/30 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Rates Gauges */}
        <div className="px-10 py-8 border-t border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Performance Indicators</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { label: 'Engagement', rate: parseFloat(engRate), color: '#06B6D4', target: 5 },
              { label: 'Likeability', rate: parseFloat(likeRate), color: '#10B981', target: 4 },
              { label: 'Sharability', rate: parseFloat(shareRate), color: '#8B5CF6', target: 1 },
            ].map(g => {
              const pct = Math.min((g.rate / (g.target * 2)) * 100, 100);
              return (
                <div key={g.label} className="text-center">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={g.color} strokeWidth="3"
                        strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round"
                        className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{g.rate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 font-medium mt-3">{g.label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Target: {g.target}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="px-10 py-8 border-t border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Platform Breakdown</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(platforms).map(([name, data]) => {
              const pctOfViews = tv > 0 ? (data.views / tv * 100).toFixed(0) : 0;
              const eng = data.views > 0 ? ((data.likes + data.comments + data.shares) / data.views * 100).toFixed(1) : '0.0';
              return (
                <div key={name} className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">{data.icon} <span className="text-white font-semibold text-sm">{name}</span></span>
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full">{data.count} posts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-xl font-bold text-white">{fmt(data.views)}</p>
                      <p className="text-[10px] text-white/40">Views ({pctOfViews}%)</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{eng}%</p>
                      <p className="text-[10px] text-white/40">Engagement</p>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
                    {data.likes > 0 && <div className="bg-pink-500 rounded-full" style={{ width: `${data.likes / (data.likes + data.comments + data.shares) * 100}%` }} />}
                    {data.comments > 0 && <div className="bg-amber-500 rounded-full" style={{ width: `${data.comments / (data.likes + data.comments + data.shares) * 100}%` }} />}
                    {data.shares > 0 && <div className="bg-violet-500 rounded-full" style={{ width: `${data.shares / (data.likes + data.comments + data.shares) * 100}%` }} />}
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] text-white/30">
                    <span>❤️ {fmt(data.likes)}</span>
                    <span>💬 {fmt(data.comments)}</span>
                    <span>🔄 {fmt(data.shares)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="px-10 py-8 border-t border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Top Performers</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Highest Engagement', post: bestPost, metric: bestPost?.engagement.toFixed(1) + '%', icon: '🏆', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20' },
              { label: 'Most Viewed', post: mostViewed, metric: fmt(mostViewed?.views || 0) + ' views', icon: '👁', color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/20' },
              { label: 'Most Shared', post: mostShared, metric: fmt(mostShared?.shares || 0) + ' shares', icon: '🔄', color: 'from-violet-500/20 to-violet-600/5', border: 'border-violet-500/20' },
            ].map(t => t.post && (
              <div key={t.label} className={`bg-gradient-to-br ${t.color} rounded-xl p-5 border ${t.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{t.icon}</span>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{t.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  {t.post.thumbnail && <img src={t.post.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <p className="text-white font-semibold text-sm">{t.post.handle}</p>
                    <p className="text-white/40 text-xs">{t.post.platformIcon} {t.post.platform}</p>
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{t.metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Performance Table */}
        <div className="px-10 py-8 border-t border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Content Performance</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs">
                  <th className="text-left pb-3 font-medium">#</th>
                  <th className="text-left pb-3 font-medium">Post</th>
                  <th className="text-left pb-3 font-medium">Platform</th>
                  <th className="text-right pb-3 font-medium">Views</th>
                  <th className="text-right pb-3 font-medium">Likes</th>
                  <th className="text-right pb-3 font-medium">Comments</th>
                  <th className="text-right pb-3 font-medium">Shares</th>
                  <th className="text-right pb-3 font-medium">Eng %</th>
                  <th className="text-right pb-3 font-medium">Like %</th>
                  <th className="text-right pb-3 font-medium">Share %</th>
                </tr>
              </thead>
              <tbody>
                {[...posts].sort((a, b) => b.views - a.views).map((p, idx) => (
                  <tr key={p.index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white/30 font-mono text-xs">{idx + 1}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {p.thumbnail && <img src={p.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />}
                        <span className="text-white font-medium text-xs truncate max-w-[140px]">{p.handle}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white/50 text-xs">{p.platformIcon} {p.platform}</td>
                    <td className="py-3 text-right text-white font-semibold">{fmt(p.views)}</td>
                    <td className="py-3 text-right text-pink-400">{fmt(p.likes)}</td>
                    <td className="py-3 text-right text-amber-400">{fmt(p.comments)}</td>
                    <td className="py-3 text-right text-violet-400">{fmt(p.shares)}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        p.engagement > 5 ? 'bg-emerald-500/20 text-emerald-400' :
                        p.engagement > 2 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>{p.engagement.toFixed(1)}%</span>
                    </td>
                    <td className="py-3 text-right text-white/50 text-xs">{p.likeability.toFixed(1)}%</td>
                    <td className="py-3 text-right text-white/50 text-xs">{p.sharability.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-white/20">Generated by Alma Tennis Academy Admin Panel</p>
          <p className="text-[10px] text-white/20">{new Date().toLocaleDateString()} · {posts.length} posts analyzed</p>
        </div>
      </div>
    </div>
  );
}

const DASHBOARD_PALETTES = [
  { name: 'Default', accent: '#3B82F6',
    stats: ['border-blue-200 bg-blue-50', 'border-pink-200 bg-pink-50', 'border-amber-200 bg-amber-50', 'border-purple-200 bg-purple-50'],
    bar: 'from-blue-400 to-blue-600', donut: ['#3B82F6', '#EF4444', '#111827', '#8B5CF6', '#F59E0B'],
    likes: 'bg-pink-400', comments: 'bg-amber-400', shares: 'bg-purple-500',
    heat: { excellent: '#2563EB', good: '#93C5FD', mid: '#BFDBFE', low: '#DBEAFE', none: '#F3F4F6' },
    preview: ['#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6'] },
  { name: 'Ocean', accent: '#06B6D4',
    stats: ['border-cyan-200 bg-cyan-50', 'border-sky-200 bg-sky-50', 'border-teal-200 bg-teal-50', 'border-indigo-200 bg-indigo-50'],
    bar: 'from-cyan-400 to-teal-600', donut: ['#06B6D4', '#0EA5E9', '#14B8A6', '#6366F1', '#0D9488'],
    likes: 'bg-sky-400', comments: 'bg-teal-400', shares: 'bg-indigo-500',
    heat: { excellent: '#0891B2', good: '#67E8F9', mid: '#A5F3FC', low: '#CFFAFE', none: '#F3F4F6' },
    preview: ['#06B6D4', '#0EA5E9', '#14B8A6', '#6366F1'] },
  { name: 'Sunset', accent: '#F97316',
    stats: ['border-orange-200 bg-orange-50', 'border-rose-200 bg-rose-50', 'border-amber-200 bg-amber-50', 'border-red-200 bg-red-50'],
    bar: 'from-orange-400 to-rose-600', donut: ['#F97316', '#FB7185', '#F59E0B', '#EF4444', '#E11D48'],
    likes: 'bg-rose-400', comments: 'bg-orange-400', shares: 'bg-red-500',
    heat: { excellent: '#EA580C', good: '#FDBA74', mid: '#FED7AA', low: '#FFEDD5', none: '#F3F4F6' },
    preview: ['#F97316', '#FB7185', '#F59E0B', '#EF4444'] },
  { name: 'Forest', accent: '#10B981',
    stats: ['border-emerald-200 bg-emerald-50', 'border-green-200 bg-green-50', 'border-lime-200 bg-lime-50', 'border-teal-200 bg-teal-50'],
    bar: 'from-emerald-400 to-green-700', donut: ['#10B981', '#22C55E', '#84CC16', '#14B8A6', '#059669'],
    likes: 'bg-green-400', comments: 'bg-lime-500', shares: 'bg-teal-500',
    heat: { excellent: '#059669', good: '#6EE7B7', mid: '#A7F3D0', low: '#D1FAE5', none: '#F3F4F6' },
    preview: ['#10B981', '#22C55E', '#84CC16', '#14B8A6'] },
  { name: 'Neon', accent: '#D946EF',
    stats: ['border-fuchsia-200 bg-fuchsia-50', 'border-violet-200 bg-violet-50', 'border-pink-200 bg-pink-50', 'border-cyan-200 bg-cyan-50'],
    bar: 'from-fuchsia-500 to-violet-600', donut: ['#D946EF', '#8B5CF6', '#EC4899', '#06B6D4', '#A855F7'],
    likes: 'bg-fuchsia-400', comments: 'bg-violet-400', shares: 'bg-cyan-500',
    heat: { excellent: '#C026D3', good: '#E879F9', mid: '#F0ABFC', low: '#FAE8FF', none: '#F3F4F6' },
    preview: ['#D946EF', '#8B5CF6', '#EC4899', '#06B6D4'] },
  { name: 'Mono', accent: '#374151',
    stats: ['border-gray-300 bg-gray-50', 'border-gray-300 bg-gray-100', 'border-gray-300 bg-gray-50', 'border-gray-300 bg-gray-100'],
    bar: 'from-gray-500 to-gray-800', donut: ['#374151', '#6B7280', '#9CA3AF', '#4B5563', '#D1D5DB'],
    likes: 'bg-gray-500', comments: 'bg-gray-400', shares: 'bg-gray-700',
    heat: { excellent: '#1F2937', good: '#6B7280', mid: '#D1D5DB', low: '#E5E7EB', none: '#F3F4F6' },
    preview: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB'] },
];

function SocialDashboard({ content, postCount }) {
  const [paletteIdx, setPaletteIdx] = useState(parseInt(localStorage.getItem('alma_social_palette') || '0'));
  const [exporting, setExporting] = useState(false);
  const palette = DASHBOARD_PALETTES[paletteIdx] || DASHBOARD_PALETTES[0];
  const dashRef = useRef(null);

  const savePalette = (idx) => { setPaletteIdx(idx); localStorage.setItem('alma_social_palette', idx.toString()); };

  const exportPDF = async () => {
    if (!dashRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(dashRef.current, { scale: 2, backgroundColor: '#F9FAFB', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Social-Dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed: ' + err.message);
    }
    setExporting(false);
  };

  // Gather all post data
  const posts = [];
  for (let i = 1; i <= postCount; i++) {
    const url = content[`social_post_${i}`] || '';
    if (!url) continue;
    const views = parseInt(content[`social_views_${i}`]) || 0;
    const likes = parseInt(content[`social_likes_${i}`]) || 0;
    const comments = parseInt(content[`social_comments_${i}`]) || 0;
    const shares = parseInt(content[`social_shares_${i}`]) || 0;
    const platform = detectPlatform(url);
    posts.push({
      index: i, url, views, likes, comments, shares,
      handle: content[`social_handle_${i}`] || '',
      title: content[`social_title_${i}`] || `Post ${i}`,
      thumbnail: content[`social_thumbnail_${i}`] || '',
      platform: platform?.name || 'Unknown',
      platformIcon: platform?.icon || '📱',
      engagement: views > 0 ? ((likes + comments + shares) / views * 100) : 0,
      likeability: views > 0 ? (likes / views * 100) : 0,
      sharability: views > 0 ? (shares / views * 100) : 0,
    });
  }

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const totalShares = posts.reduce((s, p) => s + p.shares, 0);
  const totalInteractions = totalLikes + totalComments + totalShares;
  const avgEngagement = totalViews > 0 ? (totalInteractions / totalViews * 100).toFixed(2) : '0.00';
  const avgLikeability = totalViews > 0 ? (totalLikes / totalViews * 100).toFixed(2) : '0.00';
  const avgSharability = totalViews > 0 ? (totalShares / totalViews * 100).toFixed(2) : '0.00';

  // Platform breakdown
  const platforms = {};
  posts.forEach(p => {
    if (!platforms[p.platform]) platforms[p.platform] = { icon: p.platformIcon, views: 0, likes: 0, comments: 0, shares: 0, count: 0 };
    platforms[p.platform].views += p.views;
    platforms[p.platform].likes += p.likes;
    platforms[p.platform].comments += p.comments;
    platforms[p.platform].shares += p.shares;
    platforms[p.platform].count += 1;
  });

  // Top post by views
  const topByViews = [...posts].sort((a, b) => b.views - a.views);
  const topByEngagement = [...posts].sort((a, b) => b.engagement - a.engagement);
  const maxViews = Math.max(...posts.map(p => p.views), 1);

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-alma-charcoal/50">Add posts and fetch their metrics to see the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Palette Selector + Export */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-alma-green">Theme</span>
          <div className="flex gap-2">
            {DASHBOARD_PALETTES.map((p, idx) => (
              <button key={p.name} onClick={() => savePalette(idx)} title={p.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                  idx === paletteIdx ? 'border-alma-green bg-white shadow-md scale-105' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                }`}>
                <div className="flex gap-0.5">
                  {p.preview.map((c, ci) => (
                    <div key={ci} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className={`text-[11px] font-medium ${idx === paletteIdx ? 'text-alma-green' : 'text-alma-charcoal/50'}`}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={exportPDF} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-alma-green text-white text-xs font-semibold rounded-xl hover:bg-alma-green-light transition-all disabled:opacity-50">
          {exporting ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Exporting...</> : '📄 Export PDF'}
        </button>
      </div>

      <div ref={dashRef}>
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '👁', label: 'Total Views', value: totalViews.toLocaleString(), color: palette.stats[0] },
          { icon: '❤️', label: 'Total Likes', value: totalLikes.toLocaleString(), color: palette.stats[1] },
          { icon: '💬', label: 'Total Comments', value: totalComments.toLocaleString(), color: palette.stats[2] },
          { icon: '🔄', label: 'Total Shares', value: totalShares.toLocaleString(), color: palette.stats[3] },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border-2 p-4 ${s.color}`}>
            <span className="text-xl">{s.icon}</span>
            <p className="text-2xl font-bold text-alma-charcoal mt-1">{s.value}</p>
            <p className="text-xs text-alma-charcoal/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Average Rates */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Avg Engagement', rate: avgEngagement, icon: '📊', thresholds: [5, 2], desc: 'All interactions / views' },
          { label: 'Avg Likeability', rate: avgLikeability, icon: '👍', thresholds: [4, 1.5], desc: 'Likes / views' },
          { label: 'Avg Sharability', rate: avgSharability, icon: '📤', thresholds: [1, 0.3], desc: 'Shares / views' },
        ].map(r => (
          <div key={r.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
            <span className="text-2xl">{r.icon}</span>
            <p className={`text-3xl font-bold mt-2 ${
              parseFloat(r.rate) > r.thresholds[0] ? 'text-green-600' :
              parseFloat(r.rate) > r.thresholds[1] ? 'text-alma-green' : 'text-yellow-600'
            }`}>{r.rate}%</p>
            <p className="text-sm font-medium text-alma-charcoal/70 mt-1">{r.label}</p>
            <p className="text-[10px] text-alma-charcoal/40 mt-0.5">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Views Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-alma-green mb-4">Views by Post</h3>
        <div className="space-y-3">
          {topByViews.map(p => (
            <div key={p.index} className="flex items-center gap-3">
              <div className="w-8 text-center text-xs font-bold text-alma-charcoal/40">#{p.index}</div>
              {p.thumbnail && <img src={p.thumbnail} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-alma-charcoal/70 truncate max-w-[200px]">{p.title}</span>
                  <span className="text-xs font-bold text-alma-charcoal">{p.views.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`bg-gradient-to-r ${palette.bar} rounded-full h-3 transition-all relative`}
                    style={{ width: `${(p.views / maxViews) * 100}%`, minWidth: p.views > 0 ? '8px' : '0' }}>
                  </div>
                </div>
              </div>
              <span className="text-sm flex-shrink-0">{p.platformIcon}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-alma-green mb-4">Views by Platform</h3>
          <div className="flex items-center gap-6">
            {/* Donut chart */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  const colors = palette.donut;
                  let offset = 0;
                  return Object.entries(platforms).map(([name, data], idx) => {
                    const pct = totalViews > 0 ? (data.views / totalViews) * 100 : 0;
                    const el = (
                      <circle key={name} cx="18" cy="18" r="14" fill="none"
                        stroke={colors[idx % colors.length]} strokeWidth="5"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-500" />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-alma-charcoal">{posts.length}</span>
                <span className="text-[9px] text-alma-charcoal/40">posts</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2 flex-grow">
              {(() => {
                const colors = palette.donut.map(c => '');  // use inline style instead
                return Object.entries(platforms).map(([name, data], idx) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: palette.donut[idx % palette.donut.length] }} />
                      <span className="text-xs font-medium">{data.icon} {name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold">{data.views.toLocaleString()}</span>
                      <span className="text-[10px] text-alma-charcoal/40 ml-1">({data.count})</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Top by Engagement Rate */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-alma-green mb-4">Engagement Rate Ranking</h3>
          <div className="space-y-3">
            {topByEngagement.slice(0, 5).map((p, idx) => (
              <div key={p.index} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-700' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{idx + 1}</div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium truncate">{p.handle || p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-grow bg-gray-100 rounded-full h-1.5">
                      <div className={`rounded-full h-1.5 ${
                        p.engagement > 5 ? 'bg-green-500' : p.engagement > 2 ? 'bg-alma-lime' : 'bg-yellow-400'
                      }`} style={{ width: `${Math.min(p.engagement * 5, 100)}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-alma-charcoal">{p.engagement.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="text-sm">{p.platformIcon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Heatmap */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-alma-green mb-4">Performance Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-alma-charcoal/40">
                <th className="text-left py-2 px-2 font-medium">Post</th>
                <th className="text-center py-2 px-2 font-medium">Platform</th>
                <th className="text-center py-2 px-2 font-medium">Views</th>
                <th className="text-center py-2 px-2 font-medium">Likes</th>
                <th className="text-center py-2 px-2 font-medium">Comments</th>
                <th className="text-center py-2 px-2 font-medium">Shares</th>
                <th className="text-center py-2 px-2 font-medium">Engage %</th>
                <th className="text-center py-2 px-2 font-medium">Like %</th>
                <th className="text-center py-2 px-2 font-medium">Share %</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => {
                const heatStyle = (val, thresholds) => {
                  const h = palette.heat;
                  if (val > thresholds[0]) return { background: h.excellent, color: '#fff' };
                  if (val > thresholds[1]) return { background: h.good, color: '#1a1a1a' };
                  if (val > thresholds[2]) return { background: h.mid, color: '#1a1a1a' };
                  if (val > 0) return { background: h.low, color: '#666' };
                  return { background: h.none, color: '#aaa' };
                };
                return (
                  <tr key={p.index} className="border-t border-gray-100">
                    <td className="py-2 px-2 font-medium text-alma-charcoal truncate max-w-[120px]">{p.handle || `#${p.index}`}</td>
                    <td className="py-2 px-2 text-center">{p.platformIcon}</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.views, [100000, 10000, 1000])}>{p.views > 999 ? (p.views / 1000).toFixed(1) + 'K' : p.views}</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.likes, [10000, 1000, 100])}>{p.likes > 999 ? (p.likes / 1000).toFixed(1) + 'K' : p.likes}</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.comments, [1000, 100, 10])}>{p.comments > 999 ? (p.comments / 1000).toFixed(1) + 'K' : p.comments}</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.shares, [1000, 100, 10])}>{p.shares > 999 ? (p.shares / 1000).toFixed(1) + 'K' : p.shares}</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.engagement, [5, 2, 0.5])}>{p.engagement.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.likeability, [4, 1.5, 0.5])}>{p.likeability.toFixed(1)}%</td>
                    <td className="py-2 px-2 text-center rounded font-bold" style={heatStyle(p.sharability, [1, 0.3, 0.05])}>{p.sharability.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[9px] text-alma-charcoal/40">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: palette.heat.excellent }} /> Excellent</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: palette.heat.good }} /> Good</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: palette.heat.mid }} /> Average</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: palette.heat.low }} /> Low</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: palette.heat.none }} /> None</span>
        </div>
      </div>

      {/* Interaction Breakdown Bars */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-alma-green mb-4">Interaction Breakdown</h3>
        <div className="space-y-4">
          {posts.map(p => {
            const total = p.likes + p.comments + p.shares;
            if (total === 0) return null;
            return (
              <div key={p.index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-alma-charcoal/70">{p.platformIcon} {p.handle || `Post ${p.index}`}</span>
                  <span className="text-[10px] text-alma-charcoal/40">{total.toLocaleString()} total</span>
                </div>
                <div className="flex h-5 rounded-full overflow-hidden bg-gray-100">
                  {p.likes > 0 && <div className={`${palette.likes} transition-all flex items-center justify-center`} style={{ width: `${(p.likes / total) * 100}%` }}>
                    <span className="text-[8px] text-white font-bold">{Math.round((p.likes / total) * 100)}%</span>
                  </div>}
                  {p.comments > 0 && <div className={`${palette.comments} transition-all flex items-center justify-center`} style={{ width: `${(p.comments / total) * 100}%` }}>
                    <span className="text-[8px] text-white font-bold">{Math.round((p.comments / total) * 100)}%</span>
                  </div>}
                  {p.shares > 0 && <div className={`${palette.shares} transition-all flex items-center justify-center`} style={{ width: `${(p.shares / total) * 100}%` }}>
                    <span className="text-[8px] text-white font-bold">{Math.round((p.shares / total) * 100)}%</span>
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-alma-charcoal/40">
          <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${palette.likes}`} /> Likes</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${palette.comments}`} /> Comments</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${palette.shares}`} /> Shares</span>
        </div>
      </div>
      </div>{/* end dashRef */}
    </div>
  );
}

export default function AdminSocialPage() {
  const { content, updateContent } = usePageContent();
  const [fetching, setFetching] = useState({});
  const [fetchingAll, setFetchingAll] = useState(false);
  const [saved, setSaved] = useState('');
  const [view, setView] = useState('posts'); // 'posts', 'dashboard', or 'executive'

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
          {postCount > 0 && view === 'posts' && (
            <button onClick={fetchAllPosts} disabled={fetchingAll}
              className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-1.5">
              {fetchingAll ? <><span className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Fetching...</> : '🔄 Update All'}
            </button>
          )}
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => setView('posts')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'posts' ? 'bg-white shadow-sm text-alma-green' : 'text-alma-charcoal/50 hover:text-alma-charcoal'
          }`}>
          📝 Manage Posts
        </button>
        <button onClick={() => setView('dashboard')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'dashboard' ? 'bg-white shadow-sm text-alma-green' : 'text-alma-charcoal/50 hover:text-alma-charcoal'
          }`}>
          📊 Dashboard
        </button>
        <button onClick={() => setView('executive')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'executive' ? 'bg-white shadow-sm text-alma-green' : 'text-alma-charcoal/50 hover:text-alma-charcoal'
          }`}>
          👔 Executive
        </button>
      </div>

      {view === 'executive' ? (
        <ExecutiveDashboard content={content} postCount={postCount} />
      ) : view === 'dashboard' ? (
        <SocialDashboard content={content} postCount={postCount} />
      ) : (
      <>

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
      </>
      )}
    </div>
  );
}
