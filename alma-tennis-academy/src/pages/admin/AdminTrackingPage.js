import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const PLATFORMS = [
  { id: 'meta', name: 'Meta (Facebook/Instagram)', icon: '📘', color: 'bg-blue-100 text-blue-700', placeholder: 'e.g. 123456789012345', helpText: 'Find in Meta Events Manager → Data Sources → Your Pixel → Pixel ID' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-gray-900 text-white', placeholder: 'e.g. C5A8EXAMPLE1234', helpText: 'Find in TikTok Ads Manager → Assets → Events → Web Events → Pixel Code' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', color: 'bg-yellow-100 text-yellow-700', placeholder: 'e.g. abc123-def456-ghi789', helpText: 'Find in Snapchat Ads Manager → Events Manager → Snap Pixel' },
  { id: 'google', name: 'Google Ads / GA4', icon: '🔍', color: 'bg-red-100 text-red-600', placeholder: 'e.g. AW-123456789 or G-XXXXXXXXXX', helpText: 'Find in Google Ads → Tools → Conversions, or GA4 → Admin → Data Streams' },
  { id: 'twitter', name: 'X (Twitter)', icon: '🐦', color: 'bg-sky-100 text-sky-700', placeholder: 'e.g. o1234', helpText: 'Find in X Ads Manager → Tools → Conversion Tracking → Pixel' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-50 text-blue-800', placeholder: 'e.g. 1234567', helpText: 'Find in LinkedIn Campaign Manager → Analyze → Insight Tag' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'bg-red-50 text-red-500', placeholder: 'e.g. 1234567890123', helpText: 'Find in Pinterest Ads → Conversions → Pinterest Tag' },
  { id: 'custom', name: 'Custom / Other', icon: '🔧', color: 'bg-gray-100 text-gray-600', placeholder: 'Paste the full pixel/tracking code', helpText: 'Paste the full <script> code provided by your ad platform' },
];

export default function AdminTrackingPage() {
  const [pixels, setPixels] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [pixelCode, setPixelCode] = useState('');
  const [pixelName, setPixelName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'tracking'), (snap) => {
      if (snap.exists()) {
        setPixels(snap.data().pixels || []);
      }
    });
    return unsub;
  }, []);

  const savePixels = async (newPixels) => {
    try {
      await setDoc(doc(db, 'settings', 'tracking'), { pixels: newPixels });
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleAdd = async () => {
    if (!selectedPlatform || !pixelCode.trim()) return;
    setSaving(true);
    const newPixel = {
      id: Date.now().toString(),
      platform: selectedPlatform.id,
      platformName: selectedPlatform.name,
      icon: selectedPlatform.icon,
      name: pixelName.trim() || `${selectedPlatform.name} Pixel`,
      code: pixelCode.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...pixels, newPixel];
    setPixels(updated);
    await savePixels(updated);
    setShowAddForm(false);
    setSelectedPlatform(null);
    setPixelCode('');
    setPixelName('');
    setSaving(false);
    setSaved('Pixel added!');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleToggle = async (pixelId) => {
    const updated = pixels.map(p =>
      p.id === pixelId ? { ...p, active: !p.active } : p
    );
    setPixels(updated);
    await savePixels(updated);
  };

  const handleDelete = async (pixelId) => {
    if (!window.confirm('Remove this tracking pixel?')) return;
    const updated = pixels.filter(p => p.id !== pixelId);
    setPixels(updated);
    await savePixels(updated);
    setSaved('Pixel removed');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleEdit = (pixel) => {
    setSelectedPlatform(PLATFORMS.find(p => p.id === pixel.platform) || PLATFORMS[PLATFORMS.length - 1]);
    setPixelCode(pixel.code);
    setPixelName(pixel.name);
    handleDelete(pixel.id);
    setShowAddForm(true);
  };

  // Inject active pixels into the page head
  useEffect(() => {
    // Remove old injected scripts
    document.querySelectorAll('[data-alma-pixel]').forEach(el => el.remove());

    pixels.filter(p => p.active).forEach(pixel => {
      if (pixel.platform === 'meta') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel.code}');fbq('track','PageView');`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'tiktok') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${pixel.code}');ttq.page()}(window,document,'ttq');`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'snapchat') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${pixel.code}',{});snaptr('track','PAGE_VIEW');`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'google') {
        const script1 = document.createElement('script');
        script1.setAttribute('data-alma-pixel', pixel.id);
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${pixel.code}`;
        document.head.appendChild(script1);
        const script2 = document.createElement('script');
        script2.setAttribute('data-alma-pixel', pixel.id + '-init');
        script2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${pixel.code}');`;
        document.head.appendChild(script2);
      } else if (pixel.platform === 'twitter') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${pixel.code}');`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'linkedin') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `_linkedin_partner_id="${pixel.code}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'pinterest') {
        const script = document.createElement('script');
        script.setAttribute('data-alma-pixel', pixel.id);
        script.textContent = `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${pixel.code}');pintrk('page');`;
        document.head.appendChild(script);
      } else if (pixel.platform === 'custom') {
        const div = document.createElement('div');
        div.setAttribute('data-alma-pixel', pixel.id);
        div.innerHTML = pixel.code;
        const scripts = div.querySelectorAll('script');
        scripts.forEach(s => {
          const newScript = document.createElement('script');
          newScript.setAttribute('data-alma-pixel', pixel.id);
          if (s.src) newScript.src = s.src;
          if (s.textContent) newScript.textContent = s.textContent;
          newScript.async = true;
          document.head.appendChild(newScript);
        });
      }
    });
  }, [pixels]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-alma-green">Ad Tracking Pixels</h1>
          <p className="text-sm text-alma-charcoal/50 mt-1">Connect your social media ad platforms to track conversions</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">{saved}</span>}
          <button onClick={() => { setShowAddForm(true); setSelectedPlatform(null); }} className="btn-primary text-sm">
            + Add Pixel
          </button>
        </div>
      </div>

      {/* Add Pixel Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {!selectedPlatform ? (
            <>
              <h2 className="text-lg font-semibold text-alma-green mb-4">Select Platform</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-alma-lime hover:shadow-sm transition-all"
                  >
                    <span className="text-3xl">{platform.icon}</span>
                    <span className="text-xs font-medium text-alma-charcoal/70 text-center">{platform.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddForm(false)} className="mt-4 text-sm text-alma-charcoal/40 hover:text-alma-charcoal/70 transition-colors">
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setSelectedPlatform(null)} className="text-alma-charcoal/40 hover:text-alma-charcoal/70">
                  ← Back
                </button>
                <span className="text-2xl">{selectedPlatform.icon}</span>
                <h2 className="text-lg font-semibold text-alma-green">{selectedPlatform.name} Pixel</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-alma-green mb-1">Pixel Name (optional)</label>
                  <input
                    type="text"
                    value={pixelName}
                    onChange={e => setPixelName(e.target.value)}
                    placeholder={`e.g. ${selectedPlatform.name} - Main Campaign`}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-alma-green mb-1">
                    {selectedPlatform.id === 'custom' ? 'Full Tracking Code' : 'Pixel ID / Measurement ID'}
                  </label>
                  {selectedPlatform.id === 'custom' ? (
                    <textarea
                      value={pixelCode}
                      onChange={e => setPixelCode(e.target.value)}
                      placeholder="Paste the full <script>...</script> tracking code here"
                      rows={6}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm font-mono resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={pixelCode}
                      onChange={e => setPixelCode(e.target.value)}
                      placeholder={selectedPlatform.placeholder}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm font-mono"
                    />
                  )}
                  <p className="text-xs text-alma-charcoal/40 mt-1">{selectedPlatform.helpText}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleAdd} disabled={saving || !pixelCode.trim()} className="btn-primary text-sm disabled:opacity-50">
                    {saving ? 'Adding...' : 'Add Pixel'}
                  </button>
                  <button onClick={() => { setShowAddForm(false); setSelectedPlatform(null); }} className="btn-outline text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Active Pixels List */}
      {pixels.length === 0 && !showAddForm ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-lg font-semibold text-alma-green mb-2">No Tracking Pixels Yet</h2>
          <p className="text-sm text-alma-charcoal/50 mb-6 max-w-md mx-auto">
            Connect your social media ad platforms to track conversions, measure ROI, and retarget visitors.
          </p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary text-sm">
            + Add Your First Pixel
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pixels.map(pixel => {
            const platform = PLATFORMS.find(p => p.id === pixel.platform);
            return (
              <div key={pixel.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{pixel.icon || platform?.icon}</span>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-alma-green truncate">{pixel.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${platform?.color || 'bg-gray-100 text-gray-600'}`}>
                      {pixel.platformName}
                    </span>
                  </div>
                  <p className="text-xs text-alma-charcoal/40 font-mono mt-0.5 truncate">
                    {pixel.platform === 'custom' ? `${pixel.code.substring(0, 60)}...` : pixel.code}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Active/Inactive toggle */}
                  <button
                    onClick={() => handleToggle(pixel.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${pixel.active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pixel.active ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                  <span className={`text-xs font-medium ${pixel.active ? 'text-green-600' : 'text-gray-400'}`}>
                    {pixel.active ? 'Active' : 'Off'}
                  </span>
                  <button onClick={() => handleEdit(pixel)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(pixel.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info section */}
      {pixels.length > 0 && (
        <div className="mt-6 bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
          <strong>How it works:</strong> Active pixels are automatically injected into every page of your website.
          When a visitor lands on your site, the pixel fires and sends data back to your ad platform.
          You can then create retargeting audiences, track conversions, and measure your ad ROI.
          Toggle pixels on/off without deleting them.
        </div>
      )}
    </div>
  );
}
