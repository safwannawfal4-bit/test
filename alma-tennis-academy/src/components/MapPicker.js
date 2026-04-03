import { useState, useRef, useEffect } from 'react';

export default function MapPicker({ onLocationSelect }) {
  const mapRef = useRef(null);
  const [pin, setPin] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 25.2048, lng: 55.2708 }); // Default: Dubai
  const [zoom, setZoom] = useState(12);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const TILE_SIZE = 256;

  // Convert lat/lng to pixel position
  const latLngToPixel = (lat, lng, centerLat, centerLng, zoomLevel, width, height) => {
    const scale = Math.pow(2, zoomLevel);
    const worldX = ((lng + 180) / 360) * TILE_SIZE * scale;
    const worldY = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * TILE_SIZE * scale;
    const centerWorldX = ((centerLng + 180) / 360) * TILE_SIZE * scale;
    const centerWorldY = ((1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2) * TILE_SIZE * scale;
    return {
      x: worldX - centerWorldX + width / 2,
      y: worldY - centerWorldY + height / 2,
    };
  };

  // Convert pixel to lat/lng
  const pixelToLatLng = (px, py, centerLat, centerLng, zoomLevel, width, height) => {
    const scale = Math.pow(2, zoomLevel);
    const centerWorldX = ((centerLng + 180) / 360) * TILE_SIZE * scale;
    const centerWorldY = ((1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2) * TILE_SIZE * scale;
    const worldX = px - width / 2 + centerWorldX;
    const worldY = py - height / 2 + centerWorldY;
    const lng = (worldX / (TILE_SIZE * scale)) * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * worldY) / (TILE_SIZE * scale))));
    const lat = (latRad * 180) / Math.PI;
    return { lat, lng };
  };

  const handleMapClick = (e) => {
    if (dragging) return;
    const rect = mapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const loc = pixelToLatLng(px, py, mapCenter.lat, mapCenter.lng, zoom, rect.width, rect.height);
    setPin(loc);
    onLocationSelect(loc);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.pin-marker')) return;
    setDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY, lat: mapCenter.lat, lng: mapCenter.lng });
  };

  const handleMouseMove = (e) => {
    if (!dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true);
    const rect = mapRef.current.getBoundingClientRect();
    const newCenter = pixelToLatLng(
      rect.width / 2 - dx, rect.height / 2 - dy,
      dragStart.lat, dragStart.lng, zoom, rect.width, rect.height
    );
    setMapCenter(newCenter);
  };

  const handleMouseUp = () => {
    setTimeout(() => setDragging(false), 50);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.max(2, Math.min(18, z + (e.deltaY < 0 ? 1 : -1))));
  };

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setZoom(14);
        },
        () => {} // Silently fail, keep default
      );
    }
  }, []);

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
        setMapCenter(loc);
        setPin(loc);
        setZoom(16);
        onLocationSelect(loc);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
    setSearching(false);
  };

  // Generate tile URLs for OpenStreetMap
  const getTiles = () => {
    if (!mapRef.current) return [];
    const rect = mapRef.current.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 300;
    const scale = Math.pow(2, zoom);
    const centerTileX = ((mapCenter.lng + 180) / 360) * scale;
    const centerTileY = ((1 - Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) / 2) * scale;
    const tilesX = Math.ceil(width / TILE_SIZE) + 2;
    const tilesY = Math.ceil(height / TILE_SIZE) + 2;
    const tiles = [];
    const startTileX = Math.floor(centerTileX - tilesX / 2);
    const startTileY = Math.floor(centerTileY - tilesY / 2);
    const offsetX = (centerTileX - Math.floor(centerTileX)) * TILE_SIZE;
    const offsetY = (centerTileY - Math.floor(centerTileY)) * TILE_SIZE;

    for (let dx = 0; dx < tilesX; dx++) {
      for (let dy = 0; dy < tilesY; dy++) {
        const tileX = ((startTileX + dx) % scale + scale) % scale;
        const tileY = startTileY + dy;
        if (tileY < 0 || tileY >= scale) continue;
        tiles.push({
          key: `${zoom}-${tileX}-${tileY}`,
          url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
          x: (dx - Math.floor(tilesX / 2)) * TILE_SIZE + width / 2 - offsetX,
          y: (dy - Math.floor(tilesY / 2)) * TILE_SIZE + height / 2 - offsetY,
        });
      }
    }
    return tiles;
  };

  const tiles = getTiles();
  const pinPixel = pin && mapRef.current
    ? latLngToPixel(pin.lat, pin.lng, mapCenter.lat, mapCenter.lng, zoom,
        mapRef.current.getBoundingClientRect().width,
        mapRef.current.getBoundingClientRect().height)
    : null;

  return (
    <div>
      {/* Search bar */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search location (e.g. Dubai Marina)"
          className="flex-grow px-4 py-2.5 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm"
        />
        <button type="button" onClick={handleSearch} disabled={searching}
          className="px-4 py-2.5 bg-alma-green text-white rounded-lg text-sm font-medium hover:bg-alma-green-light transition-colors disabled:opacity-50">
          {searching ? '...' : '📍 Find'}
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="relative w-full h-72 rounded-xl overflow-hidden border border-alma-cream-dark cursor-crosshair select-none"
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={(e) => {
          const t = e.touches[0];
          setDragStart({ x: t.clientX, y: t.clientY, lat: mapCenter.lat, lng: mapCenter.lng });
        }}
        onTouchMove={(e) => {
          if (!dragStart) return;
          const t = e.touches[0];
          const dx = t.clientX - dragStart.x;
          const dy = t.clientY - dragStart.y;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true);
          const rect = mapRef.current.getBoundingClientRect();
          const newCenter = pixelToLatLng(
            rect.width / 2 - dx, rect.height / 2 - dy,
            dragStart.lat, dragStart.lng, zoom, rect.width, rect.height
          );
          setMapCenter(newCenter);
        }}
        onTouchEnd={() => {
          setTimeout(() => setDragging(false), 100);
          setDragStart(null);
        }}
      >
        {/* Tiles */}
        {tiles.map(tile => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable={false}
            className="absolute pointer-events-none"
            style={{ left: tile.x, top: tile.y, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}

        {/* Pin */}
        {pinPixel && (
          <div
            className="pin-marker absolute z-10 pointer-events-none"
            style={{ left: pinPixel.x, top: pinPixel.y, transform: 'translate(-50%, -100%)' }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-sm font-bold">
                📍
              </div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500 -mt-0.5" />
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button type="button" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(18, z + 1)); }}
            className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-alma-green font-bold hover:bg-gray-50">+</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(2, z - 1)); }}
            className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-alma-green font-bold hover:bg-gray-50">-</button>
        </div>

        {/* Instruction overlay */}
        {!pin && (
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/60 text-white text-xs text-center py-2 px-3 rounded-lg backdrop-blur-sm">
            Click on the map to drop a pin at your delivery location
          </div>
        )}

        {/* Attribution */}
        <div className="absolute bottom-1 right-1 z-10 text-[9px] text-gray-500 bg-white/80 px-1 rounded">
          OpenStreetMap
        </div>
      </div>

      {/* Pin coordinates */}
      {pin && (
        <p className="text-xs text-alma-charcoal/50 mt-2 flex items-center gap-1">
          <span className="text-alma-lime">✓</span>
          Pin dropped at {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
