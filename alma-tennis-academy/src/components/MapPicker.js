import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
const pinIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#E53E3E"/>
      <circle cx="12" cy="11" r="5" fill="white"/>
      <circle cx="12" cy="11" r="2.5" fill="#E53E3E"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

// Component that handles click events on the map
function MapClickHandler({ onLocationSelect, setPin }) {
  useMapEvents({
    click(e) {
      const loc = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPin(loc);
      onLocationSelect(loc);
    },
  });
  return null;
}

// Component that flies to a new center
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPicker({ onLocationSelect }) {
  const [pin, setPin] = useState(null);
  const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });
  const [flyTarget, setFlyTarget] = useState(null);
  const [flyZoom, setFlyZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [geolocating, setGeolocating] = useState(false);
  const mapReady = useRef(false);

  // Auto-detect user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(loc);
          setFlyTarget(loc);
          setFlyZoom(15);
        },
        () => {}
      );
    }
  }, []);

  // Reverse geocode pin location to get address name
  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await resp.json();
      if (data.display_name) {
        setLocationName(data.display_name);
      }
    } catch {
      setLocationName(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  };

  const handlePinDrop = (loc) => {
    setPin(loc);
    onLocationSelect(loc);
    reverseGeocode(loc.lat, loc.lng);
  };

  // Search for a location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await resp.json();
      if (data.length > 0) {
        const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setFlyTarget(loc);
        setFlyZoom(17);
        handlePinDrop(loc);
        setLocationName(data[0].display_name || searchQuery);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
    setSearching(false);
  };

  // Use my current location
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setFlyTarget(loc);
        setFlyZoom(17);
        handlePinDrop(loc);
        setGeolocating(false);
      },
      () => {
        setGeolocating(false);
        alert('Could not get your location. Please allow location access.');
      }
    );
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Search for a place or address..."
            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm transition-all"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-alma-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button type="button" onClick={handleSearch} disabled={searching}
          className="px-4 py-2.5 bg-alma-green text-white rounded-xl text-sm font-medium hover:bg-alma-green-light transition-all disabled:opacity-50 whitespace-nowrap">
          {searching ? 'Finding...' : 'Search'}
        </button>
      </div>

      {/* My Location button */}
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={geolocating}
        className="flex items-center gap-2 text-sm text-alma-green hover:text-alma-green-light transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
        {geolocating ? 'Detecting location...' : 'Use my current location'}
      </button>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border-2 border-alma-cream-dark shadow-sm" style={{ height: '320px' }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          whenReady={() => { mapReady.current = true; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Zoom control top-right */}
          <div className="leaflet-top leaflet-right" style={{ marginTop: 10, marginRight: 10 }}>
            <div className="leaflet-control leaflet-bar" style={{ border: 'none' }} />
          </div>

          {/* Click handler */}
          <MapClickHandler onLocationSelect={handlePinDrop} setPin={setPin} />

          {/* Fly to searched/geolocated position */}
          {flyTarget && <FlyTo center={flyTarget} zoom={flyZoom} />}

          {/* Pin marker */}
          {pin && (
            <Marker
              position={[pin.lat, pin.lng]}
              icon={pinIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const latlng = e.target.getLatLng();
                  const loc = { lat: latlng.lat, lng: latlng.lng };
                  setPin(loc);
                  onLocationSelect(loc);
                  reverseGeocode(loc.lat, loc.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Location info */}
      {pin ? (
        <div className="bg-alma-lime/10 rounded-xl p-3 flex items-start gap-3">
          <div className="text-alma-green mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-alma-green">Delivery location set</p>
            <p className="text-xs text-alma-charcoal/60 mt-0.5 truncate">{locationName || `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`}</p>
            <p className="text-[10px] text-alma-charcoal/30 mt-0.5">Drag the pin to adjust the exact location</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <span className="text-xl">📍</span>
          <p className="text-sm text-alma-charcoal/50">Click on the map or search to set your delivery location</p>
        </div>
      )}
    </div>
  );
}
