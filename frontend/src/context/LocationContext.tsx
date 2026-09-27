import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GeoLocation } from '../types';

export const PRESET_LOCATIONS: GeoLocation[] = [
  { name: 'Kanpur, Uttar Pradesh (SIH Reference)', latitude: 26.4499, longitude: 80.3319 },
  { name: 'New Delhi, Delhi NCR', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Bengaluru, Karnataka', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Mumbai, Maharashtra', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Chennai, Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Hyderabad, Telangana', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Kolkata, West Bengal', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Jaipur, Rajasthan', latitude: 26.9124, longitude: 75.7873 },
  { name: 'Ahmedabad, Gujarat', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Lucknow, Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
  { name: 'Pune, Maharashtra', latitude: 18.5204, longitude: 73.8567 },
];

interface LocationContextType {
  location: GeoLocation;
  setLocation: (loc: GeoLocation) => void;
  detectCurrentLocation: () => Promise<void>;
  isDetecting: boolean;
  error: string | null;
  presetLocations: GeoLocation[];
}

const DEFAULT_LOCATION: GeoLocation = PRESET_LOCATIONS[0];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('ecogrid_location');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return DEFAULT_LOCATION;
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setLocation = (newLoc: GeoLocation) => {
    setLocationState(newLoc);
    try {
      localStorage.setItem('ecogrid_location', JSON.stringify(newLoc));
    } catch {
      // ignore storage error
    }
  };

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(4));
        const lon = Number(position.coords.longitude.toFixed(4));

        let resolvedName = `Current Location (${lat}°N, ${lon}°E)`;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision;
            const region = data.principalSubdivision;
            const country = data.countryName || 'India';
            if (city && region) {
              resolvedName = `${city}, ${region} (${country})`;
            } else if (city) {
              resolvedName = `${city}, ${country}`;
            }
          }
        } catch {
          // fallback to coordinate string
        }

        const newLoc: GeoLocation = {
          name: resolvedName,
          latitude: lat,
          longitude: lon,
          isAutoDetected: true,
        };

        setLocation(newLoc);
        setIsDetecting(false);
      },
      (err) => {
        let msg = 'Failed to retrieve current location.';
        if (err.code === 1) msg = 'Location access was denied. Please allow location permissions in your browser.';
        else if (err.code === 2) msg = 'Position unavailable. Check your network or GPS.';
        else if (err.code === 3) msg = 'Location request timed out.';
        setError(msg);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Try auto-detecting on initial visit if not already saved
  useEffect(() => {
    const saved = localStorage.getItem('ecogrid_location');
    if (!saved && navigator.geolocation) {
      detectCurrentLocation();
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        detectCurrentLocation,
        isDetecting,
        error,
        presetLocations: PRESET_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
