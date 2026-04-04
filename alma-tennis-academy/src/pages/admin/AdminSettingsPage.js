import { useState, useRef } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { uploadImage } from '../../utils/uploadImage';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function DatabaseTest() {
  const [status, setStatus] = useState(null); // null | 'testing' | 'success' | 'fail'
  const [error, setError] = useState('');

  const runTest = async () => {
    setStatus('testing');
    setError('');
    try {
      // Step 1: Write a test document
      const testData = { test: true, timestamp: Date.now() };
      await setDoc(doc(db, 'settings', '_connection_test'), testData);

      // Step 2: Read it back
      const snap = await getDoc(doc(db, 'settings', '_connection_test'));
      if (!snap.exists() || snap.data().timestamp !== testData.timestamp) {
        throw new Error('Write succeeded but data did not persist. Firestore rules are blocking writes.');
      }

      // Step 3: Clean up
      await deleteDoc(doc(db, 'settings', '_connection_test'));

      setStatus('success');
    } catch (err) {
      setStatus('fail');
      setError(err.message);
    }
  };

  return (
    <div className={`rounded-xl p-4 mb-6 ${
      status === 'success' ? 'bg-green-50 border border-green-200' :
      status === 'fail' ? 'bg-red-50 border border-red-200' :
      'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {status === 'success' ? '✅' : status === 'fail' ? '❌' : status === 'testing' ? '⏳' : '🔌'}
          </span>
          <div>
            <p className="text-sm font-semibold text-alma-green">
              {status === 'success' ? 'Database connected! Saves will work.' :
               status === 'fail' ? 'Database write FAILED!' :
               status === 'testing' ? 'Testing connection...' :
               'Database Connection'}
            </p>
            <p className="text-xs text-alma-charcoal/50">
              {status === 'success' ? 'Your Firestore rules are correctly configured.' :
               status === 'fail' ? '' :
               'Test if your changes can be saved to the database.'}
            </p>
          </div>
        </div>
        <button onClick={runTest} disabled={status === 'testing'}
          className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {status === 'fail' && (
        <div className="mt-3 bg-red-100 rounded-lg p-3 text-xs text-red-700 space-y-2">
          <p className="font-bold">Error: {error}</p>
          <p className="font-bold text-red-800">To fix this, you MUST update your Firestore rules:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open <a href="https://console.firebase.google.com/project/alma-tennis-academy/firestore/rules" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-600">this direct link to your Firestore Rules</a></li>
            <li>Delete everything in the editor</li>
            <li>Paste this exactly:</li>
          </ol>
          <pre className="bg-red-200 rounded p-2 font-mono text-[11px] whitespace-pre select-all">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
          </pre>
          <ol start={4} className="list-decimal list-inside space-y-1">
            <li>Click <strong>Publish</strong></li>
            <li>Come back here and click <strong>Test Connection</strong> again</li>
          </ol>
        </div>
      )}
    </div>
  );
}

const EMOJI_CATEGORIES = [
  { name: 'Sports', emojis: ['🎾','🏆','🥇','🥈','🥉','🏅','🎖️','⚽','🏀','🏈','⚾','🥎','🎳','🏓','🏸','🥊','🥋','🏒','🥅','⛳','🏹','🎣','🤿','🏄','🏊','🚴','🏃','🤸','⛹️','🏋️','🤺','🧗','🤾','🏇','⛷️','🏂','🛹','🪂'] },
  { name: 'Stars & Sparkles', emojis: ['⭐','🌟','✨','💫','🔥','💥','❤️‍🔥','⚡','☀️','🌈','🎇','🎆','💎','👑','🔮','💡','🕯️','🪩','🎀','🎗️'] },
  { name: 'Hearts & Love', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💝','💘','💕','💞','💓','💗','♥️','❣️','💟','😍'] },
  { name: 'Nature', emojis: ['🌿','🍀','🌱','🌲','🌳','🌴','🌵','🌸','🌺','🌻','🌹','🌷','💐','🪻','🪷','🍁','🍂','🍃','☘️','🌾'] },
  { name: 'Hands & People', emojis: ['👋','🤚','✋','🖐️','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','🤝','🙏','💪'] },
  { name: 'Faces', emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😋','😛','😜','🤪','😎','🤓','🧐','🤗','🤭','😏','😌','🥳'] },
  { name: 'Animals', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦅','🦆','🦋','🐝','🐞','🦎','🐍','🐢','🐙','🦈','🐬','🐳'] },
  { name: 'Food', emojis: ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥝','🍅','🥑','🌽','🥕','🍕','🍔','🍟','🌮','🍣','🍦','🎂','🍩','🍪','☕','🧃','🥤','🍷'] },
  { name: 'Travel & Places', emojis: ['🏠','🏢','🏗️','🏟️','⛪','🕌','🛕','🏰','🗼','🗽','⛲','🌁','🌉','🏖️','🏝️','🏔️','⛰️','🌋','🗻','🏕️','🚗','🚕','🚌','✈️','🚀','🛸','⛵','🚢','🗺️','🧭'] },
  { name: 'Objects', emojis: ['⌚','📱','💻','⌨️','🖥️','🖨️','📷','📹','🎥','📺','📻','🎙️','🎵','🎶','🎤','🎧','🎹','🥁','🎸','🎺','🎨','🧩','♟️','🎯','🎲','🎰','🧸','📚','📖','✏️'] },
  { name: 'Symbols', emojis: ['❤️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔶','🔷','🔸','🔹','▪️','▫️','◾','◽','⬛','⬜','♠️','♥️','♦️','♣️','🔔','🔕','📢','📣','💬','💭'] },
  { name: 'Flags', emojis: ['🏁','🚩','🎌','🏴','🏳️','🇦🇪','🇸🇦','🇬🇧','🇺🇸','🇫🇷','🇩🇪','🇪🇸','🇮🇹','🇯🇵','🇨🇳','🇰🇷','🇧🇷','🇮🇳','🇹🇷','🇪🇬'] },
];

function EmojiPickerSection({ content, updateContent }) {
  const [activeSlot, setActiveSlot] = useState(null); // 'emoji1' or 'emoji2'
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCategories = searchFilter
    ? EMOJI_CATEGORIES.map(cat => ({
        ...cat,
        emojis: cat.emojis.filter(() => cat.name.toLowerCase().includes(searchFilter.toLowerCase())),
      })).filter(cat => cat.emojis.length > 0)
    : EMOJI_CATEGORIES;

  const handlePick = (emoji) => {
    if (activeSlot === 'emoji1') updateContent('hero_float_emoji_1', emoji);
    else if (activeSlot === 'emoji2') updateContent('hero_float_emoji_2', emoji);
    setActiveSlot(null);
  };

  return (
    <div className="space-y-3">
      {/* Two emoji slots */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-alma-charcoal/50 mb-1">Large emoji (top-right)</label>
          <button
            onClick={() => setActiveSlot(activeSlot === 'emoji1' ? null : 'emoji1')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              activeSlot === 'emoji1' ? 'border-alma-lime bg-alma-lime/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl">{content.hero_float_emoji_1 || '🎾'}</span>
            <span className="text-xs text-alma-charcoal/50">{activeSlot === 'emoji1' ? 'Pick below ↓' : 'Click to change'}</span>
          </button>
        </div>
        <div>
          <label className="block text-xs text-alma-charcoal/50 mb-1">Small emoji (bottom-left)</label>
          <button
            onClick={() => setActiveSlot(activeSlot === 'emoji2' ? null : 'emoji2')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              activeSlot === 'emoji2' ? 'border-alma-lime bg-alma-lime/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl">{content.hero_float_emoji_2 || '🎾'}</span>
            <span className="text-xs text-alma-charcoal/50">{activeSlot === 'emoji2' ? 'Pick below ↓' : 'Click to change'}</span>
          </button>
        </div>
      </div>

      {/* Emoji picker grid */}
      {activeSlot && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-alma-green">
              Pick emoji for {activeSlot === 'emoji1' ? 'large (top-right)' : 'small (bottom-left)'}
            </p>
            <button onClick={() => setActiveSlot(null)} className="text-xs text-alma-charcoal/40 hover:text-alma-charcoal/70">Close</button>
          </div>

          <input
            type="text"
            placeholder="Search category..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 outline-none focus:border-alma-lime"
          />

          <div className="max-h-64 overflow-y-auto space-y-3">
            {(searchFilter ? filteredCategories : EMOJI_CATEGORIES).map(cat => (
              <div key={cat.name}>
                <p className="text-[10px] font-semibold text-alma-charcoal/40 uppercase tracking-wide mb-1">{cat.name}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.emojis.map((emoji, i) => (
                    <button
                      key={`${cat.name}-${i}`}
                      onClick={() => handlePick(emoji)}
                      className="w-9 h-9 text-xl flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm hover:scale-110 transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <label className="block text-xs text-alma-charcoal/40 mb-1">Or type/paste any emoji:</label>
            <input
              type="text"
              placeholder="Paste emoji here"
              className="w-32 text-center text-2xl px-2 py-1 rounded-lg border border-gray-200 focus:border-alma-lime outline-none"
              onChange={e => { if (e.target.value) handlePick(e.target.value); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const presets = [
  { name: 'Alma Green', primary: '#2D4A2D', primaryLight: '#3D6B3D', accent: '#A8D86E', accentLight: '#C4E8A0', cream: '#FDF6E3', creamDark: '#F5EDDA', charcoal: '#1A1A1A' },
  { name: 'Ocean Blue', primary: '#1E3A5F', primaryLight: '#2D5F8A', accent: '#5BC0EB', accentLight: '#8DD4F0', cream: '#F0F8FF', creamDark: '#DCE8F0', charcoal: '#1A1A2E' },
  { name: 'Royal Purple', primary: '#3D1F5C', primaryLight: '#5B3A7A', accent: '#B07CD8', accentLight: '#D4B5E9', cream: '#FAF5FF', creamDark: '#EDE5F5', charcoal: '#1A1A2E' },
  { name: 'Sunset Red', primary: '#7A1B1B', primaryLight: '#A03030', accent: '#F0A050', accentLight: '#F5C08A', cream: '#FFF8F0', creamDark: '#F5E8DA', charcoal: '#1A1A1A' },
  { name: 'Midnight Gold', primary: '#1A1A2E', primaryLight: '#2D2D44', accent: '#D4AF37', accentLight: '#E8D080', cream: '#FFFDF5', creamDark: '#F5F0E0', charcoal: '#0F0F1A' },
  { name: 'Coral Pink', primary: '#8B2252', primaryLight: '#B03070', accent: '#FF6B9D', accentLight: '#FF9EC0', cream: '#FFF5F8', creamDark: '#FFE8EE', charcoal: '#2A1A20' },
  { name: 'Forest Teal', primary: '#1A4040', primaryLight: '#2D6060', accent: '#4ECDC4', accentLight: '#80E0DA', cream: '#F0FAFA', creamDark: '#DCF0EE', charcoal: '#1A2A2A' },
  { name: 'Earth Tone', primary: '#5C4033', primaryLight: '#7A5A4A', accent: '#C19A6B', accentLight: '#D4B896', cream: '#FBF7F2', creamDark: '#F0E8DD', charcoal: '#2A1F1A' },
];

const colorFields = [
  { key: 'primary', label: 'Primary Color' },
  { key: 'primaryLight', label: 'Primary Light' },
  { key: 'accent', label: 'Accent Color' },
  { key: 'accentLight', label: 'Accent Light' },
  { key: 'cream', label: 'Background' },
  { key: 'creamDark', label: 'Background Alt' },
  { key: 'charcoal', label: 'Text Color' },
];

// CORS proxies to try (fallback chain)
const PROXIES = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://proxy.cors.sh/${u}`,
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

// Fetch public metrics from platforms
async function fetchPostMetrics(url) {
  const result = { views: 0, likes: 0, comments: 0, shares: 0, handle: '', title: '', thumbnail: '', fetched: false };

  try {
    // ==================== YOUTUBE ====================
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1]?.split(/[?&#]/)[0];
      else if (url.includes('/shorts/')) videoId = url.split('/shorts/')[1]?.split(/[?&#]/)[0];

      const YT_API_KEY = 'AIzaSyC144vvBold_KvkxOkqgCsbI6TuIlaJqe4';

      if (videoId) {
        // Fetch from YouTube Data API, Return YT Dislike API, and oEmbed in parallel
        const [ytApiRes, metricsRes, oembedRes] = await Promise.allSettled([
          fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${YT_API_KEY}`),
          fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`),
          fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`),
        ]);

        // YouTube Data API v3 - gives views, likes, comments, title, channel, thumbnail
        if (ytApiRes.status === 'fulfilled' && ytApiRes.value.ok) {
          const data = await ytApiRes.value.json();
          const video = data?.items?.[0];
          if (video) {
            const stats = video.statistics || {};
            const snippet = video.snippet || {};
            result.views = parseInt(stats.viewCount) || 0;
            result.likes = parseInt(stats.likeCount) || 0;
            result.comments = parseInt(stats.commentCount) || 0;
            result.handle = snippet.channelTitle || '';
            result.title = snippet.title || '';
            result.thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '';
            result.fetched = true;
          }
        }

        // Fallback: Return YouTube Dislike API for views/likes if Google API failed
        if (!result.fetched && metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
          const data = await metricsRes.value.json();
          result.views = data.viewCount || 0;
          result.likes = data.likes || 0;
          result.fetched = true;
        }

        // Fallback: oEmbed for title/channel/thumbnail if not already set
        if (!result.handle && oembedRes.status === 'fulfilled' && oembedRes.value.ok) {
          const data = await oembedRes.value.json();
          result.handle = result.handle || data.author_name || '';
          result.title = result.title || data.title || '';
          result.thumbnail = result.thumbnail || data.thumbnail_url || '';
        }
      }
    }

    // ==================== TIKTOK ====================
    if (url.includes('tiktok.com')) {
      // First get basic info from oEmbed
      try {
        const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          result.handle = data.author_name || '';
          result.title = data.title || '';
          result.thumbnail = data.thumbnail_url || '';
          result.fetched = true;
        }
      } catch {}

      // Then try to get metrics by fetching the page via proxy
      try {
        const html = await fetchViaProxy(url);
        if (html) {
          // TikTok embeds JSON data in <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">
          const jsonMatch = html.match(/<script\s+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[1]);
            const videoData = jsonData?.['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct;
            if (videoData?.stats) {
              result.views = videoData.stats.playCount || 0;
              result.likes = videoData.stats.diggCount || 0;
              result.comments = videoData.stats.commentCount || 0;
              result.shares = videoData.stats.shareCount || 0;
              result.handle = '@' + (videoData.author?.uniqueId || result.handle);
              result.fetched = true;
            }
          }

          // Fallback: try meta tags
          if (!result.views) {
            const viewMatch = html.match(/"playCount":\s*(\d+)/);
            const likeMatch = html.match(/"diggCount":\s*(\d+)/);
            const commentMatch = html.match(/"commentCount":\s*(\d+)/);
            const shareMatch = html.match(/"shareCount":\s*(\d+)/);
            if (viewMatch) result.views = parseInt(viewMatch[1]);
            if (likeMatch) result.likes = parseInt(likeMatch[1]);
            if (commentMatch) result.comments = parseInt(commentMatch[1]);
            if (shareMatch) result.shares = parseInt(shareMatch[1]);
            if (viewMatch) result.fetched = true;
          }
        }
      } catch (err) {
        console.warn('TikTok proxy fetch failed:', err);
      }
    }

    // ==================== INSTAGRAM ====================
    if (url.includes('instagram.com')) {
      const postCode = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/)?.[2];
      const RAPID_KEY = '64e684dbf2mshe45e0b3add984b6p136f6ajsne89a41528e4f';

      if (postCode) {
        // Try multiple RapidAPI Instagram scrapers (different providers)
        const apisToTry = [
          { host: 'instagram-scraper-api3.p.rapidapi.com', path: `/post_info?code=${postCode}` },
          { host: 'instagram-scraper-api2.p.rapidapi.com', path: `/v1/post_info?code_or_id_or_url=${postCode}` },
          { host: 'instagram-bulk-scraper-latest.p.rapidapi.com', path: `/media_info_v2/${postCode}` },
          { host: 'instagram-scraper21.p.rapidapi.com', path: `/api/v1/post-info?code=${postCode}` },
        ];

        for (const api of apisToTry) {
          if (result.fetched) break;
          try {
            const res = await fetch(`https://${api.host}${api.path}`, {
              headers: { 'x-rapidapi-host': api.host, 'x-rapidapi-key': RAPID_KEY },
              signal: AbortSignal.timeout(10000),
            });
            if (res.ok) {
              const raw = await res.json();
              // Deep-search for the media object in various response shapes
              const media = raw?.data?.post || raw?.data || raw?.items?.[0] || raw?.graphql?.shortcode_media || raw;
              const likes = media?.like_count || media?.likes?.count || media?.edge_media_preview_like?.count;
              const comments = media?.comment_count || media?.comments?.count || media?.edge_media_preview_comment?.count;
              const views = media?.play_count || media?.video_play_count || media?.video_view_count || media?.view_count;
              const username = media?.user?.username || media?.owner?.username || media?.caption?.user?.username;

              if (likes || comments || views) {
                result.likes = likes || 0;
                result.comments = comments || 0;
                result.views = views || 0;
                result.shares = media?.share_count || media?.reshare_count || 0;
                if (username) result.handle = '@' + username;
                result.title = (media?.caption?.text || '').substring(0, 100);
                result.thumbnail = media?.thumbnail_url || media?.image_versions2?.candidates?.[0]?.url || media?.thumbnail_src || media?.display_url || '';
                result.fetched = true;
              }
            }
          } catch {}
        }
      }

      // Fallback: noembed for basic info
      if (!result.handle) {
        try {
          const oRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
          if (oRes.ok) {
            const d = await oRes.json();
            result.handle = d.author_name ? '@' + d.author_name : '';
            result.title = result.title || d.title || '';
            result.thumbnail = result.thumbnail || d.thumbnail_url || '';
            if (!result.fetched) result.fetched = true;
          }
        } catch {}
      }
    }
  } catch (err) {
    console.warn('Failed to fetch metrics:', err);
  }

  return result;
}

function detectPlatform(url) {
  if (!url) return null;
  if (url.includes('instagram')) return { icon: '📸', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500' };
  if (url.includes('youtube') || url.includes('youtu.be')) return { icon: '▶️', name: 'YouTube', color: 'bg-red-500' };
  if (url.includes('tiktok')) return { icon: '🎵', name: 'TikTok', color: 'bg-gray-900' };
  return null;
}

function SocialMediaAdmin({ content, updateContent, saved, setSaved }) {
  const [fetching, setFetching] = useState({});
  const [fetchingAll, setFetchingAll] = useState(false);

  // Use an explicit counter stored in content
  const postCount = parseInt(content.social_post_count) || 0;

  const addPost = () => {
    const newCount = postCount + 1;
    updateContent('social_post_count', newCount.toString());
  };

  const removePost = (index) => {
    // Shift all posts after this one up
    for (let i = index; i < postCount; i++) {
      ['post', 'handle', 'views', 'likes', 'comments', 'shares', 'title', 'thumbnail'].forEach(f => {
        updateContent(`social_${f}_${i}`, content[`social_${f}_${i + 1}`] || '');
      });
    }
    // Clear the last slot
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

      // Build specific status message
      const parts = [];
      if (data.views) parts.push(`${data.views.toLocaleString()} views`);
      if (data.likes) parts.push(`${data.likes.toLocaleString()} likes`);
      if (data.comments) parts.push(`${data.comments.toLocaleString()} comments`);
      if (data.shares) parts.push(`${data.shares.toLocaleString()} shares`);
      if (data.handle) parts.push(data.handle);

      if (parts.length > 0) {
        setSaved(`Post ${i}: ${parts.join(' · ')}`);
      } else if (data.fetched) {
        setSaved(`Post ${i}: Basic info fetched (metrics may need manual entry)`);
      } else {
        setSaved(`Post ${i}: Could not fetch data. Platform may be blocking access.`);
      }
      setTimeout(() => setSaved(''), 5000);
    } catch (err) {
      console.error('Fetch error:', err);
      setSaved(`Post ${i}: Fetch failed - ${err.message}`);
      setTimeout(() => setSaved(''), 5000);
    }
    setFetching(prev => ({ ...prev, [i]: false }));
  };

  const fetchAllPosts = async () => {
    setFetchingAll(true);
    for (let i = 1; i <= postCount; i++) {
      if (content[`social_post_${i}`]) await fetchSinglePost(i);
    }
    setFetchingAll(false);
    setSaved('All posts updated!');
    setTimeout(() => setSaved(''), 3000);
  };

  const posts = [];
  for (let i = 1; i <= postCount; i++) posts.push(i);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-alma-green">Social Media Posts ({postCount})</h2>
        <div className="flex items-center gap-3">
          {postCount > 0 && (
            <button onClick={fetchAllPosts} disabled={fetchingAll}
              className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-1.5">
              {fetchingAll ? <><span className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Fetching...</> : '🔄 Update All Results'}
            </button>
          )}
          <span className={`text-xs font-medium ${content.social_media_enabled === 'yes' ? 'text-green-600' : 'text-alma-charcoal/40'}`}>
            {content.social_media_enabled === 'yes' ? 'Visible' : 'Hidden'}
          </span>
          <button
            onClick={() => {
              const v = content.social_media_enabled === 'yes' ? 'no' : 'yes';
              updateContent('social_media_enabled', v);
              setSaved(v === 'yes' ? 'Enabled!' : 'Hidden'); setTimeout(() => setSaved(''), 3000);
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${content.social_media_enabled === 'yes' ? 'bg-green-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.social_media_enabled === 'yes' ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>
      <p className="text-sm text-alma-charcoal/50 mb-4">Add unlimited social media posts. Click "Update Results" to auto-fetch public data from each platform.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-alma-green mb-1">Section Title</label>
          <input type="text" value={content.social_title || 'Follow Us'} onChange={e => updateContent('social_title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-alma-green mb-1">Section Subtitle</label>
          <input type="text" value={content.social_subtitle || ''} onChange={e => updateContent('social_subtitle', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
        </div>
      </div>

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
          const isFetching = fetching[i];

          return (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-alma-green">Post {i}</span>
                  {platform && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${platform.color}`}>
                      {platform.icon} {platform.name}
                    </span>
                  )}
                  {content[`social_title_${i}`] && (
                    <span className="text-[10px] text-alma-charcoal/40 truncate max-w-[200px]" title={content[`social_title_${i}`]}>
                      — {content[`social_title_${i}`]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {url && (
                    <button onClick={() => fetchSinglePost(i)} disabled={isFetching}
                      className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-1">
                      {isFetching ? <><span className="w-2.5 h-2.5 border border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Fetching...</> : '🔄 Update Results'}
                    </button>
                  )}
                  {url && (
                    <button onClick={() => removePost(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                  )}
                </div>
              </div>

              {/* Thumbnail preview */}
              {content[`social_thumbnail_${i}`] && (
                <div className="mb-3 flex items-center gap-3">
                  <img src={content[`social_thumbnail_${i}`]} alt="" className="w-16 h-16 rounded-lg object-cover" />
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
                    placeholder="@almatennisacademy"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-alma-lime outline-none text-sm" />
                </div>
              </div>

              {url && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-medium text-alma-charcoal/50 uppercase tracking-wide">Post Metrics</label>
                    <span className="text-[9px] text-alma-charcoal/30">{views > 0 ? 'Last fetched data shown' : 'Click "Update Results" to fetch'}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { key: 'views', icon: '👁', label: 'Views' },
                      { key: 'likes', icon: '❤️', label: 'Likes' },
                      { key: 'comments', icon: '💬', label: 'Comments' },
                      { key: 'shares', icon: '🔄', label: 'Shares' },
                    ].map(m => (
                      <div key={m.key}>
                        <label className="block text-[9px] text-alma-charcoal/40 mb-0.5">{m.icon} {m.label}</label>
                        <input type="number" min="0" value={content[`social_${m.key}_${i}`] || ''}
                          onChange={e => updateContent(`social_${m.key}_${i}`, e.target.value)}
                          placeholder="0" className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs outline-none focus:border-alma-lime" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[9px] text-alma-charcoal/40 mb-0.5">📊 Engagement</label>
                      <div className={`px-2 py-1.5 rounded text-xs font-bold text-center ${
                        parseFloat(engagementRate) > 5 ? 'bg-green-100 text-green-700' :
                        parseFloat(engagementRate) > 2 ? 'bg-alma-lime/10 text-alma-green' :
                        parseFloat(engagementRate) > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {engagementRate}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-grow bg-gray-100 rounded-full h-1.5">
                      <div className={`rounded-full h-1.5 transition-all ${
                        parseFloat(engagementRate) > 5 ? 'bg-green-500' : parseFloat(engagementRate) > 2 ? 'bg-alma-lime' : 'bg-yellow-400'
                      }`} style={{ width: `${Math.min(parseFloat(engagementRate) * 5, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-alma-charcoal/40 whitespace-nowrap">
                      {totalInteractions.toLocaleString()} / {views.toLocaleString()} views
                    </span>
                  </div>
                </div>
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
        <p className="font-semibold text-alma-charcoal/60">Auto-fetch capabilities:</p>
        <p>▶️ <strong>YouTube</strong> — Views, Likes, Channel, Title, Thumbnail ✅ full metrics</p>
        <p>🎵 <strong>TikTok</strong> — Views, Likes, Comments, Shares, Author, Title, Thumbnail ✅ full metrics</p>
        <p>📸 <strong>Instagram</strong> — Likes, Comments, Views (videos), Author, Title ✅ most metrics</p>
        <p className="mt-2 text-alma-charcoal/40">📊 Engagement = (Likes + Comments + Shares) ÷ Views × 100</p>
        <p className="text-alma-charcoal/40">🟢 &gt;5% Great | 🟡 2-5% Good | 🔴 &lt;2% Low</p>
        <p className="text-alma-charcoal/30 mt-1">Data fetched via public APIs. Some metrics may require manual entry if the platform blocks access.</p>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { theme, updateTheme, defaultTheme, logoUrl, updateLogo, faviconUrl, updateFavicon, heroBg, updateHeroBg, language, setLanguage, content, updateContent } = usePageContent();
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [saved, setSaved] = useState('');
  const fileRef = useRef();
  const heroFileRef = useRef();
  const faviconRef = useRef();

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'branding');
      await updateLogo(url);
      setSaved('Logo saved!');
      setTimeout(() => setSaved(''), 3000);
    } catch (err) {
      alert('Failed to upload logo: ' + err.message);
    }
    setUploading(false);
  };

  const handleRemoveLogo = async () => {
    if (window.confirm('Remove the custom logo and use the default text logo?')) {
      await updateLogo('');
      setSaved('Logo removed');
      setTimeout(() => setSaved(''), 3000);
    }
  };

  const applyPreset = (preset) => {
    const { name, ...colors } = preset;
    updateTheme(colors);
    setSaved(`${name} palette applied!`);
    setTimeout(() => setSaved(''), 3000);
  };

  const handleColorChange = (key, value) => {
    updateTheme({ ...theme, [key]: value });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Site Settings</h1>
        {saved && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">{saved}</span>
        )}
      </div>

      {/* Database Connection Test */}
      <DatabaseTest />

      {/* Quick Jump Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'lang', label: '🌐 Language' },
          { id: 'logo', label: '🖼️ Logo' },
          { id: 'favicon', label: '🔖 Browser Icon' },
          { id: 'hero', label: '🏔️ Hero Background' },
          { id: 'social', label: '📱 Social Media' },
          { id: 'colors', label: '🎨 Colors' },
        ].map(s => (
          <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-medium text-alma-charcoal/70 hover:border-alma-lime hover:text-alma-green transition-all">
            {s.label}
          </button>
        ))}
      </div>

      {/* Language Section */}
      <div id="lang"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Website Language</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">Switch the entire website between English and Arabic. Arabic enables right-to-left (RTL) layout. All visitors see the change instantly.</p>

        <div className="flex gap-3">
          <button
            onClick={() => { setLanguage('en'); setSaved('Switched to English'); setTimeout(() => setSaved(''), 3000); }}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all flex-1 ${
              language === 'en' ? 'border-alma-lime bg-alma-lime/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <div className="text-left">
              <p className={`font-semibold text-sm ${language === 'en' ? 'text-alma-green' : 'text-alma-charcoal/70'}`}>English</p>
              <p className="text-xs text-alma-charcoal/40">Left-to-right layout</p>
            </div>
            {language === 'en' && <span className="ml-auto text-alma-lime text-lg">✓</span>}
          </button>

          <button
            onClick={() => { setLanguage('ar'); setSaved('تم التحويل إلى العربية'); setTimeout(() => setSaved(''), 3000); }}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all flex-1 ${
              language === 'ar' ? 'border-alma-lime bg-alma-lime/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🇸🇦</span>
            <div className="text-left">
              <p className={`font-semibold text-sm ${language === 'ar' ? 'text-alma-green' : 'text-alma-charcoal/70'}`}>العربية</p>
              <p className="text-xs text-alma-charcoal/40">Right-to-left layout</p>
            </div>
            {language === 'ar' && <span className="ml-auto text-alma-lime text-lg">✓</span>}
          </button>
        </div>

        <div className="mt-4 bg-amber-50 rounded-lg p-3 text-xs text-amber-700">
          <strong>Tip:</strong> When in Arabic mode, you can click any text on the site to edit the Arabic translation.
          Switch back to English to edit English text. Each language has its own content stored separately.
        </div>
      </div>

      {/* Logo Section */}
      <div id="logo"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Logo</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">Upload your academy logo. It will appear in the navbar and footer for all visitors.</p>

        <div className="flex items-start gap-6">
          {/* Current logo preview */}
          <div className="w-40 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Current logo" className="max-w-full max-h-full object-contain p-2" />
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-1">🎾</div>
                <p className="text-[10px] text-alma-charcoal/40">Default text logo</p>
              </div>
            )}
          </div>

          <div className="flex-grow space-y-3">
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              {logoUrl && (
                <button onClick={handleRemoveLogo} className="ml-3 text-sm text-red-400 hover:text-red-600 transition-colors">
                  Remove Logo
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files[0] && handleLogoUpload(e.target.files[0])} />
            </div>
            <p className="text-xs text-alma-charcoal/40">Recommended: PNG or SVG with transparent background. Max height displayed: 40-80px.</p>
          </div>
        </div>
      </div>

      {/* Favicon / Browser Icon & Tab Title Section */}
      <div id="favicon"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Browser Tab</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">Customize the icon and title text that appear in the browser tab.</p>

        {/* Tab Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-alma-green mb-2">Tab Title</label>
          <input
            type="text"
            value={content.site_title || 'Alma Tennis Academy'}
            onChange={e => updateContent('site_title', e.target.value)}
            placeholder="Alma Tennis Academy"
            className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm"
          />
          <p className="text-xs text-alma-charcoal/40 mt-1">This is the text shown in the browser tab next to the icon.</p>
        </div>

        {/* Favicon */}
        <div>
          <label className="block text-sm font-medium text-alma-green mb-2">Tab Icon (Favicon)</label>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {faviconUrl ? (
                <img src={faviconUrl} alt="Current favicon" className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-3xl">{content.favicon_emoji || '🎾'}</span>
              )}
            </div>

            <div className="flex-grow space-y-3">
              {/* Option 1: Upload image */}
              <div>
                <p className="text-xs font-semibold text-alma-charcoal/50 mb-2 uppercase tracking-wide">Option 1: Upload an image</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => faviconRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {uploadingFavicon ? 'Uploading...' : faviconUrl ? 'Change Image' : 'Upload Image'}
                  </button>
                  {faviconUrl && (
                    <button
                      onClick={async () => {
                        await updateFavicon('');
                        setSaved('Image icon removed');
                        setTimeout(() => setSaved(''), 3000);
                      }}
                      className="text-sm text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <input ref={faviconRef} type="file" accept="image/png,image/svg+xml,image/x-icon,image/ico" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingFavicon(true);
                      try {
                        const url = await uploadImage(file, 'branding');
                        await updateFavicon(url);
                        setSaved('Favicon uploaded!');
                        setTimeout(() => setSaved(''), 3000);
                      } catch (err) { alert('Failed: ' + err.message); }
                      setUploadingFavicon(false);
                    }} />
                </div>
                <p className="text-xs text-alma-charcoal/40 mt-1">Square, 32x32 or 64x64 px. PNG or SVG.</p>
              </div>

              {/* Option 2: Use emoji */}
              {!faviconUrl && (
                <div>
                  <p className="text-xs font-semibold text-alma-charcoal/50 mb-2 uppercase tracking-wide">Option 2: Use an emoji</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={content.favicon_emoji || '🎾'}
                      onChange={e => { updateContent('favicon_emoji', e.target.value); }}
                      className="w-16 text-center text-2xl px-2 py-1.5 rounded-lg border border-gray-200 focus:border-alma-lime outline-none"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['🎾','🏆','⭐','💚','🎯','🏅','🌟','✨','🥇','🎪','🏟️','💎'].map(e => (
                        <button key={e} onClick={() => updateContent('favicon_emoji', e)}
                          className="text-lg hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded px-3 py-1.5 shadow-sm border border-gray-200">
              <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[10px]">{content.favicon_emoji || '🎾'}</span>
                )}
              </div>
              <span className="text-xs text-alma-charcoal/70">{content.site_title || 'Alma Tennis Academy'}</span>
              <span className="text-xs text-alma-charcoal/30 ml-2">✕</span>
            </div>
            <span className="text-[10px] text-alma-charcoal/30">← Preview of browser tab</span>
          </div>
        </div>
      </div>

      {/* Hero Background Section */}
      <div id="hero"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Hero Background</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">Choose between a solid color (uses your primary color palette) or upload a custom background image for the main hero section.</p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => { updateHeroBg({ type: 'color', imageUrl: '' }); setSaved('Switched to color'); setTimeout(() => setSaved(''), 3000); }}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all flex-1 ${
              heroBg?.type !== 'image' ? 'border-alma-lime bg-alma-lime/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🎨</span>
            <div className="text-left">
              <p className={`font-semibold text-sm ${heroBg?.type !== 'image' ? 'text-alma-green' : 'text-alma-charcoal/70'}`}>Color Gradient</p>
              <p className="text-xs text-alma-charcoal/40">Uses your primary color palette</p>
            </div>
            {heroBg?.type !== 'image' && <span className="ml-auto text-alma-lime text-lg">✓</span>}
          </button>

          <button
            onClick={() => heroFileRef.current?.click()}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all flex-1 ${
              heroBg?.type === 'image' ? 'border-alma-lime bg-alma-lime/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left">
              <p className={`font-semibold text-sm ${heroBg?.type === 'image' ? 'text-alma-green' : 'text-alma-charcoal/70'}`}>Custom Image</p>
              <p className="text-xs text-alma-charcoal/40">{uploadingHero ? 'Uploading...' : 'Click to upload a photo'}</p>
            </div>
            {heroBg?.type === 'image' && <span className="ml-auto text-alma-lime text-lg">✓</span>}
          </button>
          <input ref={heroFileRef} type="file" accept="image/*" className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setUploadingHero(true);
              try {
                const url = await uploadImage(file, 'branding');
                await updateHeroBg({ type: 'image', imageUrl: url });
                setSaved('Hero image uploaded!');
                setTimeout(() => setSaved(''), 3000);
              } catch (err) { alert('Failed: ' + err.message); }
              setUploadingHero(false);
            }} />
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden border border-gray-200 h-40">
          {heroBg?.type === 'image' && heroBg?.imageUrl ? (
            <div className="relative w-full h-full">
              <img src={heroBg.imageUrl} alt="Hero preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white font-display font-bold text-2xl">Your Hero Text Here</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight}, ${theme.primary})` }}>
              <p className="text-white font-display font-bold text-2xl">Your Hero Text Here</p>
            </div>
          )}
        </div>
        {heroBg?.type === 'image' && heroBg?.imageUrl && (
          <button
            onClick={() => { updateHeroBg({ type: 'color', imageUrl: '' }); setSaved('Image removed'); setTimeout(() => setSaved(''), 3000); }}
            className="text-sm text-red-400 hover:text-red-600 mt-2 transition-colors"
          >
            Remove image and use color
          </button>
        )}

        {/* Size recommendation */}
        <div className="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-1">
          <p className="font-semibold">Recommended image size:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>1920 x 1080 px</strong> (Full HD) - best for most screens</li>
            <li><strong>2560 x 1440 px</strong> (2K) - sharper on large monitors</li>
            <li>Landscape orientation (wider than tall)</li>
            <li>File size: under 2MB for fast loading (JPG recommended)</li>
            <li>Dark or medium-toned images work best (white text overlays on top)</li>
          </ul>
        </div>

        {/* Floating emojis control (only when using color gradient) */}
        {heroBg?.type !== 'image' && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-alma-green">Floating Background Emojis</p>
              <button
                onClick={() => {
                  const current = content.hero_show_emojis !== 'no';
                  updateContent('hero_show_emojis', current ? 'no' : 'yes');
                  setSaved(current ? 'Emojis hidden' : 'Emojis visible');
                  setTimeout(() => setSaved(''), 3000);
                }}
                className={`relative w-11 h-6 rounded-full transition-colors ${content.hero_show_emojis !== 'no' ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.hero_show_emojis !== 'no' ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>

            {content.hero_show_emojis !== 'no' && (
              <EmojiPickerSection content={content} updateContent={updateContent} />
            )}
          </div>
        )}
      </div>

      {/* Social Media Posts Section */}
      <div id="social"></div>
      <SocialMediaAdmin content={content} updateContent={updateContent} saved={saved} setSaved={setSaved} />

      {/* Color Palette Section */}
      <div id="colors"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Color Palette</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">Choose a preset or customize individual colors. Changes apply instantly for all visitors.</p>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-alma-charcoal/50 mb-3 uppercase tracking-wide">Presets</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-alma-lime hover:shadow-sm transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm grid grid-cols-2 grid-rows-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <div style={{ background: preset.primary }} />
                  <div style={{ background: preset.accent }} />
                  <div style={{ background: preset.cream }} />
                  <div style={{ background: preset.primaryLight }} />
                </div>
                <span className="text-xs font-medium text-alma-charcoal/70">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <p className="text-xs font-semibold text-alma-charcoal/50 mb-3 uppercase tracking-wide">Custom Colors</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colorFields.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3">
                <label className="text-sm text-alma-charcoal/70 font-medium">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme[key] || '#000000'}
                    onChange={e => handleColorChange(key, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme[key] || ''}
                    onChange={e => handleColorChange(key, e.target.value)}
                    className="w-24 text-xs px-2 py-1.5 border border-gray-200 rounded-lg font-mono bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => { updateTheme(defaultTheme); setSaved('Reset to default!'); setTimeout(() => setSaved(''), 3000); }}
          className="mt-4 text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Reset to Default Colors
        </button>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Live Preview</h2>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6" style={{ background: theme.cream }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold" style={{ color: theme.primary }}>Alma Tennis Academy</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg text-white text-sm font-medium" style={{ background: theme.primary }}>Primary</span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium" style={{ background: theme.accent, color: theme.primary }}>Accent</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: theme.charcoal }}>This is how your body text will look on the site.</p>
            <div className="mt-3 p-3 rounded-lg" style={{ background: theme.creamDark }}>
              <p className="text-sm" style={{ color: theme.primaryLight }}>Alternative background section with lighter primary text.</p>
            </div>
          </div>
          <div className="p-4" style={{ background: theme.primary }}>
            <p className="text-sm font-semibold" style={{ color: theme.accent }}>Footer area with accent text</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Secondary footer text</p>
          </div>
        </div>
      </div>
    </div>
  );
}
