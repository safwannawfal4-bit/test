import { useState, useRef } from 'react';
import { usePageContent } from '../../context/PageContentContext';
import { useOrders } from '../../context/OrderContext';
import * as XLSX from 'xlsx';

function detectPlatform(url) {
  if (!url) return 'Other';
  if (url.includes('instagram')) return 'Instagram';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok')) return 'TikTok';
  return 'Other';
}

const fmt = (n) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : (n||0).toString();
const fmtMoney = (n) => '$' + (n||0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ===================== PAID ADS SECTION =====================
function PaidAdsSection({ ads, setAds }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws);
        const parsed = raw.map((row, i) => ({
          id: Date.now() + i,
          campaign: row['Campaign'] || row['campaign'] || row['Campaign Name'] || row['name'] || `Campaign ${i+1}`,
          platform: row['Platform'] || row['platform'] || row['Source'] || row['source'] || 'Unknown',
          spend: parseFloat(row['Spend'] || row['spend'] || row['Cost'] || row['cost'] || row['Amount Spent'] || 0),
          impressions: parseInt(row['Impressions'] || row['impressions'] || row['Reach'] || row['reach'] || 0),
          clicks: parseInt(row['Clicks'] || row['clicks'] || row['Link Clicks'] || 0),
          conversions: parseInt(row['Conversions'] || row['conversions'] || row['Purchases'] || row['Results'] || 0),
          revenue: parseFloat(row['Revenue'] || row['revenue'] || row['Purchase Value'] || row['Conversion Value'] || 0),
        }));
        setAds(prev => [...prev, ...parsed]);
      } catch (err) {
        alert('Error reading file: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const removeAd = (id) => setAds(prev => prev.filter(a => a.id !== id));
  const clearAll = () => { if (window.confirm('Clear all paid ads data?')) setAds([]); };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-alma-green">💰 Paid Ads Data</h3>
          <p className="text-xs text-alma-charcoal/40 mt-0.5">{ads.length} campaigns loaded</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fileRef.current?.click()}
            className="text-xs font-medium bg-alma-green text-white px-3 py-1.5 rounded-lg hover:bg-alma-green-light transition-all">
            📁 Upload Excel/CSV
          </button>
          {ads.length > 0 && <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-600">Clear</button>}
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm text-alma-charcoal/50 mb-2">Upload your ads report (Excel or CSV)</p>
          <p className="text-[10px] text-alma-charcoal/30">Expected columns: Campaign, Platform, Spend, Impressions, Clicks, Conversions, Revenue</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50"><tr>
              <th className="text-left p-2 font-medium">Campaign</th>
              <th className="text-left p-2 font-medium">Platform</th>
              <th className="text-right p-2 font-medium">Spend</th>
              <th className="text-right p-2 font-medium">Impressions</th>
              <th className="text-right p-2 font-medium">Clicks</th>
              <th className="text-right p-2 font-medium">CTR</th>
              <th className="text-right p-2 font-medium">Conv</th>
              <th className="text-right p-2 font-medium">Revenue</th>
              <th className="text-right p-2 font-medium">ROAS</th>
              <th className="p-2"></th>
            </tr></thead>
            <tbody>
              {ads.map(a => {
                const ctr = a.impressions > 0 ? (a.clicks / a.impressions * 100).toFixed(2) : '0';
                const roas = a.spend > 0 ? (a.revenue / a.spend).toFixed(2) : '0';
                return (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="p-2 font-medium">{a.campaign}</td>
                    <td className="p-2 text-alma-charcoal/60">{a.platform}</td>
                    <td className="p-2 text-right">{fmtMoney(a.spend)}</td>
                    <td className="p-2 text-right">{fmt(a.impressions)}</td>
                    <td className="p-2 text-right">{fmt(a.clicks)}</td>
                    <td className="p-2 text-right">{ctr}%</td>
                    <td className="p-2 text-right">{a.conversions}</td>
                    <td className="p-2 text-right font-semibold text-green-600">{fmtMoney(a.revenue)}</td>
                    <td className={`p-2 text-right font-bold ${parseFloat(roas) >= 3 ? 'text-green-600' : parseFloat(roas) >= 1 ? 'text-amber-600' : 'text-red-500'}`}>{roas}x</td>
                    <td className="p-2"><button onClick={() => removeAd(a.id)} className="text-red-400 hover:text-red-600">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===================== INFLUENCER SECTION =====================
function InfluencerSection({ influencers, setInfluencers }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', platform: 'Instagram', handle: '', followers: '', fee: '', views: '', likes: '', comments: '', shares: '', conversions: '', revenue: '', postUrl: '' });

  const addInfluencer = () => {
    setInfluencers(prev => [...prev, { ...form, id: Date.now(), followers: parseInt(form.followers)||0, fee: parseFloat(form.fee)||0, views: parseInt(form.views)||0, likes: parseInt(form.likes)||0, comments: parseInt(form.comments)||0, shares: parseInt(form.shares)||0, conversions: parseInt(form.conversions)||0, revenue: parseFloat(form.revenue)||0 }]);
    setForm({ name: '', platform: 'Instagram', handle: '', followers: '', fee: '', views: '', likes: '', comments: '', shares: '', conversions: '', revenue: '', postUrl: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-alma-green">🤝 Influencer Campaigns</h3>
          <p className="text-xs text-alma-charcoal/40 mt-0.5">{influencers.length} influencers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-xs font-medium bg-alma-green text-white px-3 py-1.5 rounded-lg hover:bg-alma-green-light">
          + Add Influencer
        </button>
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Influencer Name" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none">
              <option>Instagram</option><option>YouTube</option><option>TikTok</option><option>Other</option>
            </select>
            <input value={form.handle} onChange={e => setForm({...form, handle: e.target.value})} placeholder="@handle" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <input value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} placeholder="Followers" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input value={form.fee} onChange={e => setForm({...form, fee: e.target.value})} placeholder="Fee Paid ($)" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <input value={form.views} onChange={e => setForm({...form, views: e.target.value})} placeholder="Views" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <input value={form.likes} onChange={e => setForm({...form, likes: e.target.value})} placeholder="Likes" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <input value={form.conversions} onChange={e => setForm({...form, conversions: e.target.value})} placeholder="Conversions" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} placeholder="Revenue Generated ($)" type="number" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
            <input value={form.postUrl} onChange={e => setForm({...form, postUrl: e.target.value})} placeholder="Post URL (optional)" className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-alma-lime" />
          </div>
          <div className="flex gap-2">
            <button onClick={addInfluencer} className="btn-primary text-xs">Add Influencer</button>
            <button onClick={() => setShowForm(false)} className="btn-outline text-xs">Cancel</button>
          </div>
        </div>
      )}

      {influencers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50"><tr>
              <th className="text-left p-2 font-medium">Influencer</th>
              <th className="text-left p-2 font-medium">Platform</th>
              <th className="text-right p-2 font-medium">Followers</th>
              <th className="text-right p-2 font-medium">Fee</th>
              <th className="text-right p-2 font-medium">Views</th>
              <th className="text-right p-2 font-medium">Eng</th>
              <th className="text-right p-2 font-medium">Conv</th>
              <th className="text-right p-2 font-medium">Revenue</th>
              <th className="text-right p-2 font-medium">ROI</th>
              <th className="p-2"></th>
            </tr></thead>
            <tbody>
              {influencers.map(inf => {
                const eng = inf.views > 0 ? ((inf.likes + inf.comments + inf.shares) / inf.views * 100).toFixed(1) : '0';
                const roi = inf.fee > 0 ? ((inf.revenue - inf.fee) / inf.fee * 100).toFixed(0) : '0';
                return (
                  <tr key={inf.id} className="border-t border-gray-100">
                    <td className="p-2"><span className="font-medium">{inf.name}</span><br/><span className="text-alma-charcoal/40">{inf.handle}</span></td>
                    <td className="p-2">{inf.platform}</td>
                    <td className="p-2 text-right">{fmt(inf.followers)}</td>
                    <td className="p-2 text-right">{fmtMoney(inf.fee)}</td>
                    <td className="p-2 text-right">{fmt(inf.views)}</td>
                    <td className="p-2 text-right">{eng}%</td>
                    <td className="p-2 text-right">{inf.conversions}</td>
                    <td className="p-2 text-right font-semibold text-green-600">{fmtMoney(inf.revenue)}</td>
                    <td className={`p-2 text-right font-bold ${parseInt(roi) > 100 ? 'text-green-600' : parseInt(roi) > 0 ? 'text-amber-600' : 'text-red-500'}`}>{roi}%</td>
                    <td className="p-2"><button onClick={() => setInfluencers(prev => prev.filter(x => x.id !== inf.id))} className="text-red-400 hover:text-red-600">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===================== COMBINED ROI DASHBOARD =====================
function CombinedDashboard({ organic, ads, influencers, orders }) {
  const dashRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  // Organic metrics
  const orgViews = organic.reduce((s, p) => s + p.views, 0);
  const orgLikes = organic.reduce((s, p) => s + p.likes, 0);
  const orgInteractions = organic.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);

  // Paid ads metrics
  const adSpend = ads.reduce((s, a) => s + a.spend, 0);
  const adImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const adClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const adConversions = ads.reduce((s, a) => s + a.conversions, 0);
  const adRevenue = ads.reduce((s, a) => s + a.revenue, 0);

  // Influencer metrics
  const infSpend = influencers.reduce((s, i) => s + i.fee, 0);
  const infViews = influencers.reduce((s, i) => s + i.views, 0);
  const infConversions = influencers.reduce((s, i) => s + i.conversions, 0);
  const infRevenue = influencers.reduce((s, i) => s + i.revenue, 0);

  // Orders
  const totalOrderRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;

  // Combined
  const totalSpend = adSpend + infSpend;
  const totalRevenue = adRevenue + infRevenue + totalOrderRevenue;
  const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100).toFixed(0) : '∞';
  const totalReach = orgViews + adImpressions + infViews;
  const totalConversions = adConversions + infConversions + totalOrders;
  const cpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0';
  const adROAS = adSpend > 0 ? (adRevenue / adSpend).toFixed(2) : '0';
  const infROI = infSpend > 0 ? ((infRevenue - infSpend) / infSpend * 100).toFixed(0) : '0';

  // Channel mix for donut
  const channels = [
    { name: 'Organic', reach: orgViews, spend: 0, revenue: 0, color: '#10B981' },
    { name: 'Paid Ads', reach: adImpressions, spend: adSpend, revenue: adRevenue, color: '#3B82F6' },
    { name: 'Influencers', reach: infViews, spend: infSpend, revenue: infRevenue, color: '#8B5CF6' },
    { name: 'Direct Sales', reach: 0, spend: 0, revenue: totalOrderRevenue, color: '#F59E0B' },
  ].filter(c => c.reach > 0 || c.revenue > 0);

  const exportPDF = async () => {
    if (!dashRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(dashRef.current, { scale: 2, backgroundColor: '#0F172A', useCORS: true });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Digital-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) { alert('Export failed: ' + err.message); }
    setExporting(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={exportPDF} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-alma-green text-white text-xs font-semibold rounded-xl hover:bg-alma-green-light disabled:opacity-50">
          {exporting ? 'Exporting...' : '📄 Export Report PDF'}
        </button>
      </div>

      <div ref={dashRef} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-white/5">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.3em]">Digital Performance Report</p>
          <h2 className="text-3xl font-bold text-white mt-2">Alma Tennis Academy</h2>
          <p className="text-white/40 text-sm mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Combined Channel Analysis</p>
        </div>

        {/* Hero KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 border-b border-white/5">
          {[
            { label: 'Total Reach', value: fmt(totalReach), color: 'text-cyan-400' },
            { label: 'Total Revenue', value: fmtMoney(totalRevenue), color: 'text-emerald-400' },
            { label: 'Total Spend', value: fmtMoney(totalSpend), color: 'text-rose-400' },
            { label: 'Overall ROI', value: overallROI + '%', color: parseInt(overallROI) > 100 ? 'text-emerald-400' : parseInt(overallROI) > 0 ? 'text-amber-400' : 'text-red-400' },
          ].map(k => (
            <div key={k.label} className="p-6 md:p-8 text-center">
              <p className={`text-3xl md:text-4xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-white/50 mt-2">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Channel Comparison */}
        <div className="px-10 py-8 border-b border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Channel Performance</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'Organic', icon: '🌱', reach: fmt(orgViews), spend: '$0', rev: '$0', metric: fmt(orgInteractions) + ' interactions', color: 'border-emerald-500/30 from-emerald-500/10' },
              { name: 'Paid Ads', icon: '📢', reach: fmt(adImpressions), spend: fmtMoney(adSpend), rev: fmtMoney(adRevenue), metric: adROAS + 'x ROAS', color: 'border-blue-500/30 from-blue-500/10' },
              { name: 'Influencers', icon: '🤝', reach: fmt(infViews), spend: fmtMoney(infSpend), rev: fmtMoney(infRevenue), metric: infROI + '% ROI', color: 'border-violet-500/30 from-violet-500/10' },
              { name: 'Direct Sales', icon: '🛒', reach: totalOrders + ' orders', spend: '$0', rev: fmtMoney(totalOrderRevenue), metric: totalOrders > 0 ? fmtMoney(totalOrderRevenue/totalOrders) + '/order' : '$0', color: 'border-amber-500/30 from-amber-500/10' },
            ].map(ch => (
              <div key={ch.name} className={`bg-gradient-to-br ${ch.color} to-transparent rounded-xl p-5 border`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{ch.icon}</span>
                  <span className="text-white font-semibold text-sm">{ch.name}</span>
                </div>
                <div className="space-y-2">
                  <div><p className="text-lg font-bold text-white">{ch.reach}</p><p className="text-[10px] text-white/40">Reach</p></div>
                  <div className="flex justify-between">
                    <div><p className="text-sm font-semibold text-rose-400">{ch.spend}</p><p className="text-[10px] text-white/30">Spend</p></div>
                    <div className="text-right"><p className="text-sm font-semibold text-emerald-400">{ch.rev}</p><p className="text-[10px] text-white/30">Revenue</p></div>
                  </div>
                  <p className="text-xs text-white/60 font-medium pt-1 border-t border-white/5">{ch.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Donut + Funnel */}
        <div className="px-10 py-8 border-b border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Revenue by Channel */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Revenue by Channel</p>
            <div className="flex items-center gap-6">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    const totalRev = channels.reduce((s, c) => s + c.revenue, 0) || 1;
                    let offset = 0;
                    return channels.filter(c => c.revenue > 0).map(c => {
                      const pct = (c.revenue / totalRev) * 100;
                      const el = <circle key={c.name} cx="18" cy="18" r="14" fill="none" stroke={c.color} strokeWidth="5" strokeDasharray={`${pct} ${100-pct}`} strokeDashoffset={-offset} />;
                      offset += pct;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-white">{fmtMoney(totalRevenue)}</span>
                  <span className="text-[8px] text-white/30">Total</span>
                </div>
              </div>
              <div className="space-y-2">
                {channels.filter(c => c.revenue > 0).map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                    <span className="text-xs text-white/70">{c.name}</span>
                    <span className="text-xs text-white font-bold ml-auto">{fmtMoney(c.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Conversion Funnel</p>
            <div className="space-y-2">
              {[
                { label: 'Total Reach', value: totalReach, pct: 100 },
                { label: 'Clicks / Interactions', value: adClicks + orgInteractions, pct: totalReach > 0 ? (adClicks + orgInteractions) / totalReach * 100 : 0 },
                { label: 'Conversions', value: totalConversions, pct: totalReach > 0 ? totalConversions / totalReach * 100 : 0 },
                { label: 'Revenue', value: totalRevenue, pct: totalReach > 0 ? (totalRevenue > 0 ? 5 : 0) : 0, isMoney: true },
              ].map((step, idx) => (
                <div key={step.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{step.label}</span>
                    <span className="text-white font-semibold">{step.isMoney ? fmtMoney(step.value) : fmt(step.value)}</span>
                  </div>
                  <div className="h-6 rounded-full overflow-hidden bg-white/5" style={{ width: `${Math.max(step.pct, 5)}%`, minWidth: '60px', transition: 'width 1s ease' }}>
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-end px-2">
                      <span className="text-[9px] text-white font-bold">{step.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-10 py-8 border-b border-white/5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Key Efficiency Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Cost Per Acquisition', value: '$'+cpa, good: parseFloat(cpa) < 20 },
              { label: 'Paid ROAS', value: adROAS + 'x', good: parseFloat(adROAS) >= 3 },
              { label: 'Influencer ROI', value: infROI + '%', good: parseInt(infROI) > 100 },
              { label: 'Total Conversions', value: totalConversions.toString(), good: totalConversions > 0 },
              { label: 'Avg Order Value', value: totalOrders > 0 ? fmtMoney(totalOrderRevenue / totalOrders) : '$0', good: true },
            ].map(m => (
              <div key={m.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                <p className={`text-2xl font-black ${m.good ? 'text-emerald-400' : 'text-amber-400'}`}>{m.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Formula Insight */}
        <div className="px-10 py-8">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">ROI Formula Breakdown</p>
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <div className="flex items-center justify-center gap-4 text-center flex-wrap">
              <div><p className="text-2xl font-black text-emerald-400">{fmtMoney(totalRevenue)}</p><p className="text-[10px] text-white/40">Revenue</p></div>
              <span className="text-2xl text-white/30">−</span>
              <div><p className="text-2xl font-black text-rose-400">{fmtMoney(totalSpend)}</p><p className="text-[10px] text-white/40">Total Spend</p></div>
              <span className="text-2xl text-white/30">=</span>
              <div><p className={`text-2xl font-black ${totalRevenue - totalSpend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtMoney(totalRevenue - totalSpend)}</p><p className="text-[10px] text-white/40">Net Profit</p></div>
              <span className="text-2xl text-white/30">→</span>
              <div><p className={`text-3xl font-black ${parseInt(overallROI) > 100 ? 'text-emerald-400' : parseInt(overallROI) > 0 ? 'text-amber-400' : 'text-red-400'}`}>{overallROI}%</p><p className="text-[10px] text-white/40">ROI</p></div>
            </div>
          </div>
        </div>

        <div className="px-10 py-4 border-t border-white/5 flex justify-between">
          <p className="text-[10px] text-white/20">Alma Tennis Academy · Digital Performance Report</p>
          <p className="text-[10px] text-white/20">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function AdminDigitalReportPage() {
  const { content } = usePageContent();
  const { orders } = useOrders();
  const [view, setView] = useState('data'); // 'data' or 'report'
  const [ads, setAds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alma_paid_ads') || '[]'); } catch { return []; }
  });
  const [influencers, setInfluencers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alma_influencers') || '[]'); } catch { return []; }
  });

  // Save to localStorage
  const updateAds = (fn) => { setAds(prev => { const next = typeof fn === 'function' ? fn(prev) : fn; localStorage.setItem('alma_paid_ads', JSON.stringify(next)); return next; }); };
  const updateInfluencers = (fn) => { setInfluencers(prev => { const next = typeof fn === 'function' ? fn(prev) : fn; localStorage.setItem('alma_influencers', JSON.stringify(next)); return next; }); };

  // Gather organic posts
  const postCount = parseInt(content.social_post_count) || 0;
  const organic = [];
  for (let i = 1; i <= postCount; i++) {
    const url = content[`social_post_${i}`] || '';
    if (!url) continue;
    organic.push({
      views: parseInt(content[`social_views_${i}`]) || 0,
      likes: parseInt(content[`social_likes_${i}`]) || 0,
      comments: parseInt(content[`social_comments_${i}`]) || 0,
      shares: parseInt(content[`social_shares_${i}`]) || 0,
      platform: detectPlatform(url),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-alma-green">Digital Report</h1>
          <p className="text-sm text-alma-charcoal/50 mt-1">Combined organic, paid ads, influencer & sales analytics</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => setView('data')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'data' ? 'bg-white shadow-sm text-alma-green' : 'text-alma-charcoal/50'}`}>
          📁 Data Input
        </button>
        <button onClick={() => setView('report')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${view === 'report' ? 'bg-white shadow-sm text-alma-green' : 'text-alma-charcoal/50'}`}>
          📊 Combined Report
        </button>
      </div>

      {view === 'report' ? (
        <CombinedDashboard organic={organic} ads={ads} influencers={influencers} orders={orders} />
      ) : (
        <>
          <PaidAdsSection ads={ads} setAds={updateAds} />
          <InfluencerSection influencers={influencers} setInfluencers={updateInfluencers} />
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-alma-charcoal/50 space-y-1">
            <p className="font-semibold text-alma-charcoal/60">Data Sources:</p>
            <p>🌱 <strong>Organic</strong> — Pulled from your Social Posts section ({organic.length} posts)</p>
            <p>💰 <strong>Paid Ads</strong> — Upload Excel/CSV from Meta Ads Manager, Google Ads, TikTok Ads, etc.</p>
            <p>🤝 <strong>Influencers</strong> — Add manually with fees, views, and conversion data</p>
            <p>🛒 <strong>Orders</strong> — Auto-pulled from your store ({orders.length} orders)</p>
          </div>
        </>
      )}
    </div>
  );
}
