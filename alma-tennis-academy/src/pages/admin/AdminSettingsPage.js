import { useState, useRef } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { uploadImage } from '../../utils/uploadImage';

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

      {/* Quick Jump Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'lang', label: '🌐 Language' },
          { id: 'logo', label: '🖼️ Logo' },
          { id: 'favicon', label: '🔖 Browser Icon' },
          { id: 'hero', label: '🏔️ Hero Background' },
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

      {/* Favicon / Browser Icon Section */}
      <div id="favicon"></div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Browser Tab Icon (Favicon)</h2>
        <p className="text-sm text-alma-charcoal/50 mb-4">This is the small icon that appears in the browser tab next to your page title. Currently showing a tennis ball.</p>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {faviconUrl ? (
              <img src={faviconUrl} alt="Current favicon" className="w-12 h-12 object-contain" />
            ) : (
              <span className="text-3xl">🎾</span>
            )}
          </div>

          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => faviconRef.current?.click()}
                disabled={uploadingFavicon}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {uploadingFavicon ? 'Uploading...' : faviconUrl ? 'Change Icon' : 'Upload Icon'}
              </button>
              {faviconUrl && (
                <button
                  onClick={async () => {
                    await updateFavicon('');
                    setSaved('Favicon reset to default');
                    setTimeout(() => setSaved(''), 3000);
                  }}
                  className="text-sm text-red-400 hover:text-red-600 transition-colors"
                >
                  Reset to Default
                </button>
              )}
              <input ref={faviconRef} type="file" accept="image/*" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadingFavicon(true);
                  try {
                    const url = await uploadImage(file, 'branding');
                    await updateFavicon(url);
                    setSaved('Favicon updated! Refresh the page to see it.');
                    setTimeout(() => setSaved(''), 5000);
                  } catch (err) { alert('Failed: ' + err.message); }
                  setUploadingFavicon(false);
                }} />
            </div>
            <p className="text-xs text-alma-charcoal/40">Recommended: Square image, 32x32 or 64x64 px. PNG, SVG, or ICO format. The image will show as a tiny icon in the browser tab.</p>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded px-3 py-1.5 shadow-sm border border-gray-200">
                <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px]">🎾</span>
                  )}
                </div>
                <span className="text-xs text-alma-charcoal/70">Alma Tennis Academy</span>
                <span className="text-xs text-alma-charcoal/30 ml-2">✕</span>
              </div>
              <span className="text-[10px] text-alma-charcoal/30">← Preview of browser tab</span>
            </div>
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
