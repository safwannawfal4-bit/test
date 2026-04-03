import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../context/PageContentContext';

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

export default function ThemeCustomizer() {
  const { isAdmin } = useAuth();
  const { theme, updateTheme, defaultTheme } = usePageContent();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(theme);

  if (!isAdmin) return null;

  const applyPreset = (preset) => {
    const { name, ...colors } = preset;
    setCustom(colors);
    updateTheme(colors);
  };

  const handleColorChange = (key, value) => {
    const updated = { ...custom, [key]: value };
    setCustom(updated);
    updateTheme(updated);
  };

  const colorFields = [
    { key: 'primary', label: 'Primary (Dark)' },
    { key: 'primaryLight', label: 'Primary (Light)' },
    { key: 'accent', label: 'Accent' },
    { key: 'accentLight', label: 'Accent Light' },
    { key: 'cream', label: 'Background' },
    { key: 'creamDark', label: 'Background Alt' },
    { key: 'charcoal', label: 'Text Dark' },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-alma-green text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-xl hover:scale-110"
        title="Customize Theme"
      >
        🎨
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-alma-green text-white flex justify-between items-center">
            <h3 className="font-semibold text-sm">Theme Customizer</h3>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {/* Presets */}
            <p className="text-xs font-semibold text-alma-charcoal/50 mb-2 uppercase tracking-wide">Color Presets</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="group flex flex-col items-center gap-1"
                  title={preset.name}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 grid grid-cols-2 grid-rows-2 group-hover:scale-110 transition-transform">
                    <div style={{ background: preset.primary }} />
                    <div style={{ background: preset.accent }} />
                    <div style={{ background: preset.cream }} />
                    <div style={{ background: preset.primaryLight }} />
                  </div>
                  <span className="text-[9px] text-alma-charcoal/50 leading-tight text-center">{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Custom colors */}
            <p className="text-xs font-semibold text-alma-charcoal/50 mb-2 uppercase tracking-wide">Custom Colors</p>
            <div className="space-y-2">
              {colorFields.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <label className="text-xs text-alma-charcoal/70 flex-grow">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={custom[key]}
                      onChange={e => handleColorChange(key, e.target.value)}
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={custom[key]}
                      onChange={e => handleColorChange(key, e.target.value)}
                      className="w-20 text-xs px-2 py-1 border border-gray-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Reset */}
            <button
              onClick={() => { setCustom(defaultTheme); updateTheme(defaultTheme); }}
              className="mt-4 w-full text-xs text-red-400 hover:text-red-600 py-2 transition-colors"
            >
              Reset to Default Colors
            </button>
          </div>
        </div>
      )}
    </>
  );
}
