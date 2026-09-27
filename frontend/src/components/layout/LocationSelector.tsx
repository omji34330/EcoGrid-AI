import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Check, ChevronDown, X, AlertCircle } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

export const LocationSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    location,
    setLocation,
    detectCurrentLocation,
    isDetecting,
    error,
    presetLocations,
  } = useLocationContext();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLon, setCustomLon] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setLocation({
        name: customName.trim() || `Custom Node (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        latitude: Number(lat.toFixed(4)),
        longitude: Number(lon.toFixed(4)),
        isAutoDetected: false,
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change location"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${
          compact
            ? 'bg-slate-900/80 hover:bg-slate-800 text-xs border border-emerald-500/30 text-slate-200'
            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-xs border border-emerald-500/30 text-emerald-400 font-semibold shadow-sm'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {location.isAutoDetected ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </>
          )}
        </span>

        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span className="truncate max-w-[130px] sm:max-w-[180px] font-medium text-slate-200">
          {location.name.split('(')[0].trim()}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Modal / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 sm:right-auto sm:left-0 mt-2 z-50 w-[320px] sm:w-[380px] rounded-2xl bg-[#0A1626]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Target Microgrid Location</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* One-click GPS Detection Button */}
              <button
                onClick={() => {
                  detectCurrentLocation();
                  setIsOpen(false);
                }}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>
                  {isDetecting ? 'Acquiring GPS Position...' : 'Use My Current Location'}
                </span>
              </button>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Preset Indian Cities */}
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Preset Locations
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {presetLocations.map((p) => {
                    const isSelected =
                      Math.abs(p.latitude - location.latitude) < 0.01 &&
                      Math.abs(p.longitude - location.longitude) < 0.01;
                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          setLocation(p);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Coordinates Collapsible Form */}
              <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-white/10 space-y-2">
                <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Custom Coordinates
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Latitude (e.g. 26.45)"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Longitude (e.g. 80.33)"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location Name (Optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!customLat || !customLon}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold disabled:opacity-40 transition-colors"
                >
                  Set Custom Location
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
