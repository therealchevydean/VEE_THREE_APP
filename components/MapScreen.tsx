import React, { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { TrafficLayer } from '@vis.gl/react-google-maps/maps';
import { Mission, MissionStatus, MapTile } from '../types';
import { ChestIcon, SatelliteIcon, TerrainIcon, PlusIcon, MinusIcon, NavigationIcon, LayersIcon, MapIcon } from './icons';

// --- Developer Note on Privacy ---
// This component is designed for a single-player experience. At no point is the user's
// location shared with other players, nor are other players' locations displayed on the map.
// The map view is unique to each user to ensure privacy and safety.

// --- Map Configuration ---
const TILE_SIZE = 64; // Visual size of a tile on the overlay in pixels at zoom level 1
const METERS_PER_TILE = 10; // How many meters of real-world movement equals one tile
const TILE_DENSITY = 0.15; // 15% of tiles will have chests
const MINING_RADIUS = 1.5; // Can mine tiles within 1.5 tiles of the center (player)
const MAX_SPEED_MPS = 45; // Max plausible speed in meters/second (~100 mph)
const MIN_ZOOM = 0.5; // Min zoom for the game overlay
const MAX_ZOOM = 4; // Max zoom for the game overlay
const GOOGLE_MAPS_API_KEY = process.env.API_KEY; 
const MAP_ID = 'V3_CUSTOM_MAP_ID'; // Placeholder for potential future custom map styling

type MapType = 'roadmap' | 'satellite' | 'terrain';

// Haversine formula to calculate distance between two lat/lon points in meters
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// --- Floating Text Component for Rewards ---
// FIX: Define prop types with a dedicated type alias to prevent issues with React's key prop.
type FloatingTextProps = { text: string; x: number; y: number; onEnd: () => void };
const FloatingText = ({ text, x, y, onEnd }: FloatingTextProps) => {
  useEffect(() => {
    const timer = setTimeout(onEnd, 1500);
    return () => clearTimeout(timer);
  }, [onEnd]);
  
  return (
    <div 
      className="absolute text-lg font-bold text-v3-primary pointer-events-none transition-all duration-1500 z-50"
      style={{
        left: x,
        top: y,
        transform: 'translateY(-50px) scale(1.2)',
        opacity: 0,
        animation: 'float-up 1.5s ease-out forwards'
      }}
    >
      {text}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

interface MapScreenProps {
  onPointsEarned: (points: number, description: string) => void;
  missions: Mission[];
  // FIX: Use Dispatch and SetStateAction types from React import instead of React namespace.
  setMissions: Dispatch<SetStateAction<Mission[]>>;
}


const MapView = ({ onPointsEarned, missions, setMissions }: MapScreenProps) => {
  const [initialLocation, setInitialLocation] = useState<GeolocationCoordinates | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lon: number} | null>(null);
  const [currentGridPos, setCurrentGridPos] = useState({ x: 0, y: 0 });
  const [tiles, setTiles] = useState<Map<string, MapTile>>(new Map());
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);
  
  const [overlayZoom, setOverlayZoom] = useState(1.5);
  const [mapType, setMapType] = useState<MapType>('roadmap');
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{coords: GeolocationCoordinates, timestamp: number} | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const minedTilesRef = useRef(new Set<string>());
  
  const locationError = useLocation(
    setInitialLocation,
    setCurrentCoords,
    setCurrentGridPos,
    setMissions,
    onPointsEarned,
    setFloatingTexts,
    lastPositionRef,
    watchIdRef,
    minedTilesRef,
    tiles,
    setTiles,
  );
  
  useEffect(() => {
    try {
      const savedMinedTiles = localStorage.getItem('v3-mined-tiles');
      if (savedMinedTiles) {
        const parsedTiles = JSON.parse(savedMinedTiles);
        if (Array.isArray(parsedTiles)) {
          minedTilesRef.current = new Set(parsedTiles);
        }
      }
    } catch (error) {
      console.error("Failed to parse mined tiles from localStorage:", error);
      try {
        localStorage.removeItem('v3-mined-tiles'); // Clear corrupted data
      } catch (removeError) {
        console.error("Failed to remove item from localStorage:", removeError);
      }
    }
  }, []);

  const generateTiles = useCallback((centerX: number, centerY: number) => {
    const GRID_RANGE = 15;
    setTiles(prevTiles => {
      const newTiles = new Map(prevTiles);
      for (let x = -GRID_RANGE; x <= GRID_RANGE; x++) {
        for (let y = -GRID_RANGE; y <= GRID_RANGE; y++) {
          const tileX = Math.floor(centerX) + x;
          const tileY = Math.floor(centerY) + y;
          const tileId = `${tileX},${tileY}`;
          
          if (!newTiles.has(tileId)) {
            const seed = (tileX * 73856093) ^ (tileY * 19349663);
            if ((seed % 1000) / 1000 < TILE_DENSITY) {
              const status = minedTilesRef.current.has(tileId) ? 'mined' : 'active';
              newTiles.set(tileId, { id: tileId, x: tileX, y: tileY, status });
            }
          }
        }
      }
      return newTiles;
    });
  }, []);

  useEffect(() => {
    if (initialLocation && (tiles.size === 0)) {
        generateTiles(0,0);
    }
    if (currentGridPos.x !== 0 || currentGridPos.y !== 0) {
        generateTiles(currentGridPos.x, currentGridPos.y);
    }
  }, [initialLocation, currentGridPos, generateTiles, tiles.size]);

  
  const handleZoomIn = useCallback(() => setOverlayZoom(prev => Math.min(prev * 1.4, MAX_ZOOM)), []);
  const handleZoomOut = useCallback(() => setOverlayZoom(prev => Math.max(prev / 1.4, MIN_ZOOM)), []);

  const mapOffsetX = -(currentGridPos.x * TILE_SIZE);
  const mapOffsetY = -(currentGridPos.y * TILE_SIZE);

  return (
    <div className="w-full h-full relative" ref={mapRef}>
        {locationError && (
          <p className="absolute top-4 left-1/2 -translate-x-1/2 text-red-400 p-2 text-center z-50 bg-v3-surface rounded-md">{locationError}</p>
        )}
        {!currentCoords && !locationError ? (
          <div className="w-full h-full flex items-center justify-center bg-v3-surface">
            <p className="text-v3-text-secondary animate-pulse z-10">Waiting for location...</p>
          </div>
        ) : currentCoords && (
          <>
            <GoogleMap
                defaultCenter={{lat: currentCoords.lat, lng: currentCoords.lon}}
                center={{lat: currentCoords.lat, lng: currentCoords.lon}}
                defaultZoom={18}
                zoom={18}
                className="w-full h-full"
                disableDefaultUI={true}
                gestureHandling={'none'}
                mapId={MAP_ID}
                mapTypeId={mapType}
            >
              {trafficEnabled && <TrafficLayer />}
            </GoogleMap>

            {/* Game Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `scale(${overlayZoom}) translate(${mapOffsetX}px, ${mapOffsetY}px)`,
                    willChange: 'transform',
                  }}
                >
                  {Array.from(tiles.values()).map((tile: MapTile) => {
                      const distance = Math.sqrt(Math.pow(tile.x - currentGridPos.x, 2) + Math.pow(tile.y - currentGridPos.y, 2));
                      const canMine = distance <= MINING_RADIUS;
                      return (
                          <div 
                              key={tile.id} 
                              className={`absolute flex items-center justify-center transition-opacity duration-300 ${tile.status === 'mined' ? 'opacity-20' : 'opacity-100'}`}
                              style={{
                                  width: TILE_SIZE, 
                                  height: TILE_SIZE,
                                  transform: `translateX(${tile.x * TILE_SIZE - TILE_SIZE / 2}px) translateY(${tile.y * TILE_SIZE - TILE_SIZE / 2}px)`
                              }}
                          >
                              {/* FIX: Wrap icon in a div to apply style, as IconProps does not accept a style prop. */}
                              <div style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>
                                <ChestIcon className={`w-8 h-8 ${canMine && tile.status === 'active' ? 'text-v3-secondary animate-pulse' : 'text-v3-text-secondary/50'}`} />
                              </div>
                          </div>
                      )
                  })}
                </div>
            </div>

             {/* Player UI Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
                    <NavigationIcon className="w-10 h-10 text-v3-primary -rotate-45" />
                </div>
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-v3-primary/10 rounded-full border border-dashed border-v3-primary/30"
                    style={{
                        width: MINING_RADIUS * 2 * TILE_SIZE * overlayZoom,
                        height: MINING_RADIUS * 2 * TILE_SIZE * overlayZoom,
                        transition: 'width 0.2s, height 0.2s'
                    }}
                ></div>
            </div>
          </>
        )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end space-y-3 pointer-events-auto">
         <button 
            onClick={() => setIsLayersPanelOpen(prev => !prev)}
            className="w-12 h-12 bg-v3-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-v3-border hover:bg-v3-surface transition-colors"
            aria-label="Toggle map layers"
        >
            <LayersIcon className="w-6 h-6" />
        </button>

        {isLayersPanelOpen && (
          <div className="bg-v3-surface/90 backdrop-blur-sm rounded-lg p-3 w-48 shadow-lg border border-v3-border animate-fade-in-up">
            <h3 className="text-xs font-bold text-v3-text-secondary mb-2 px-2">MAP TYPE</h3>
            <div className="space-y-1">
              <button onClick={() => setMapType('roadmap')} className={`w-full text-left flex items-center space-x-2 p-2 rounded-md transition-colors ${mapType === 'roadmap' ? 'bg-v3-primary/20 text-v3-primary' : 'hover:bg-v3-surface'}`}>
                  <MapIcon className="w-5 h-5" />
                  <span>Roadmap</span>
              </button>
              <button onClick={() => setMapType('satellite')} className={`w-full text-left flex items-center space-x-2 p-2 rounded-md transition-colors ${mapType === 'satellite' ? 'bg-v3-primary/20 text-v3-primary' : 'hover:bg-v3-surface'}`}>
                  <SatelliteIcon className="w-5 h-5" />
                  <span>Satellite</span>
              </button>
              <button onClick={() => setMapType('terrain')} className={`w-full text-left flex items-center space-x-2 p-2 rounded-md transition-colors ${mapType === 'terrain' ? 'bg-v3-primary/20 text-v3-primary' : 'hover:bg-v3-surface'}`}>
                  <TerrainIcon className="w-5 h-5" />
                  <span>Terrain</span>
              </button>
            </div>
            <div className="border-t border-v3-border my-3"></div>
            <h3 className="text-xs font-bold text-v3-text-secondary mb-2 px-2">OVERLAYS</h3>
            <div className="flex justify-between items-center p-2">
              <label htmlFor="traffic-toggle" className="text-v3-text-primary text-sm font-medium">Traffic</label>
              <div className="v3-toggle">
                  <input 
                      type="checkbox" 
                      name="traffic-toggle" 
                      id="traffic-toggle" 
                      className="v3-toggle-checkbox"
                      checked={trafficEnabled}
                      onChange={() => setTrafficEnabled(prev => !prev)}
                  />
                  <label htmlFor="traffic-toggle" className="v3-toggle-label"></label>
              </div>
            </div>
          </div>
        )}

        <div className="bg-v3-surface/80 backdrop-blur-sm rounded-lg flex flex-col shadow-lg border border-v3-border">
            <button onClick={handleZoomIn} className="w-12 h-12 flex items-center justify-center border-b border-v3-border hover:bg-v3-surface transition-colors" aria-label="Zoom in">
                <PlusIcon className="w-6 h-6" />
            </button>
            <button onClick={handleZoomOut} className="w-12 h-12 flex items-center justify-center hover:bg-v3-surface transition-colors" aria-label="Zoom out">
                <MinusIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
      {/* FIX: The key prop is handled by React and not passed to the component. No fix needed here other than prop typing. */}
      {/* FIX: Wrapped FloatingText in a div to assign the key, resolving the TypeScript error. */}
      {floatingTexts.map(ft => <div key={ft.id}><FloatingText text={ft.text} x={ft.x} y={ft.y} onEnd={() => setFloatingTexts(prev => prev.filter(p => p.id !== ft.id))} /></div>)}
    </div>
  );
}


// Custom hook to encapsulate geolocation logic
// FIX: Use types imported from React instead of using the React namespace.
const useLocation = (
    setInitialLocation: Dispatch<SetStateAction<GeolocationCoordinates | null>>,
    setCurrentCoords: Dispatch<SetStateAction<{ lat: number; lon: number; } | null>>,
    setCurrentGridPos: Dispatch<SetStateAction<{ x: number; y: number; }>>,
    setMissions: Dispatch<SetStateAction<Mission[]>>,
    onPointsEarned: (points: number, description: string) => void,
    setFloatingTexts: Dispatch<SetStateAction<{ id: number; text: string; x: number; y: number; }[]>>,
    lastPositionRef: MutableRefObject<{ coords: GeolocationCoordinates; timestamp: number; } | null>,
    watchIdRef: MutableRefObject<number | null>,
    minedTilesRef: MutableRefObject<Set<string>>,
    tiles: Map<string, MapTile>,
    setTiles: Dispatch<SetStateAction<Map<string, MapTile>>>,
) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const initialLocationRef = useRef<GeolocationCoordinates | null>(null);

  useEffect(() => {
    const mineTile = (tile: MapTile) => {
        const points = Math.floor(Math.random() * 5) + 1;
        onPointsEarned(points, 'Geomine');
        setFloatingTexts(prev => [...prev, {id: Date.now() + Math.random(), text: `+${points} MOBX`, x: window.innerWidth / 2, y: window.innerHeight / 2}]);
        setTiles(prevTiles => {
            const newTiles = new Map(prevTiles);
            newTiles.set(tile.id, { ...tile, status: 'mined' });
            return newTiles;
        });
        minedTilesRef.current.add(tile.id);
        try {
            localStorage.setItem('v3-mined-tiles', JSON.stringify(Array.from(minedTilesRef.current)));
        } catch (error) {
            console.error("Failed to save mined tiles to localStorage:", error);
        }
    };

    const autoMine = (gridX: number, gridY: number) => {
        for (const tile of tiles.values()) {
            const distance = Math.sqrt(Math.pow(tile.x - gridX, 2) + Math.pow(tile.y - gridY, 2));
            if (tile.status === 'active' && distance <= MINING_RADIUS) {
                mineTile(tile);
            }
        }
    };

    const updateDestinationMissions = (coords: GeolocationCoordinates) => {
        setMissions(prevMissions => {
            let missionsUpdated = false;
            const updatedMissions = prevMissions.map(mission => {
                if (mission.type === 'destination' && mission.status === MissionStatus.AVAILABLE && mission.destinationDetails) {
                    const distanceTraveled = getDistance(mission.destinationDetails.startLat, mission.destinationDetails.startLon, coords.latitude, coords.longitude);
                    if (distanceTraveled >= mission.destinationDetails.targetDistanceMeters) {
                        onPointsEarned(mission.points, mission.title);
                        setFloatingTexts(prev => [...prev, {id: Date.now() + Math.random(), text: `Geodrop! +${mission.points} MOBX`, x: window.innerWidth / 2, y: window.innerHeight / 2}]);
                        missionsUpdated = true;
                        return { ...mission, status: MissionStatus.COMPLETED, destinationDetails: { ...mission.destinationDetails, distanceTraveledMeters: mission.destinationDetails.targetDistanceMeters } };
                    } else {
                        missionsUpdated = true;
                        return { ...mission, destinationDetails: { ...mission.destinationDetails, distanceTraveledMeters: distanceTraveled } };
                    }
                }
                return mission;
            });
            return missionsUpdated ? updatedMissions : prevMissions;
        });
    };
    
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.accuracy > 50) {
            setLocationError(`Poor GPS signal (accuracy: ${position.coords.accuracy.toFixed(0)}m).`);
            return;
          }

          if (lastPositionRef.current) {
            const timeDiff = (position.timestamp - lastPositionRef.current.timestamp) / 1000;
            if (timeDiff > 0) {
                const distanceDiff = getDistance(lastPositionRef.current.coords.latitude, lastPositionRef.current.coords.longitude, position.coords.latitude, position.coords.longitude);
                const speed = distanceDiff / timeDiff;
                if (speed > MAX_SPEED_MPS) {
                    setLocationError("Unusual movement detected.");
                    return;
                }
            }
          }
          lastPositionRef.current = {coords: position.coords, timestamp: position.timestamp};
          
          setCurrentCoords({ lat: position.coords.latitude, lon: position.coords.longitude });

          if (!initialLocationRef.current) {
            initialLocationRef.current = position.coords;
            setInitialLocation(position.coords);
          } else {
            const distanceLat = getDistance(initialLocationRef.current.latitude, initialLocationRef.current.longitude, position.coords.latitude, initialLocationRef.current.longitude);
            const distanceLon = getDistance(initialLocationRef.current.latitude, initialLocationRef.current.longitude, initialLocationRef.current.latitude, position.coords.longitude);
            
            const newGridX = (position.coords.longitude > initialLocationRef.current.longitude ? 1 : -1) * (distanceLon / METERS_PER_TILE);
            const newGridY = (position.coords.latitude < initialLocationRef.current.latitude ? 1 : -1) * (distanceLat / METERS_PER_TILE);

            setCurrentGridPos({ x: newGridX, y: newGridY });
            autoMine(newGridX, newGridY);
            updateDestinationMissions(position.coords);
          }
          setLocationError(null);
        },
        (error) => setLocationError(error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
    return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [setInitialLocation, setCurrentCoords, setCurrentGridPos, setMissions, onPointsEarned, setFloatingTexts, lastPositionRef, watchIdRef, minedTilesRef, tiles, setTiles]);
  return locationError;
};


const MapScreen = (props: MapScreenProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-v3-surface">
        <p className="text-red-400 p-4 text-center font-semibold">
          Error: Google Maps API Key is not configured. The map cannot be displayed.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <MapView {...props} />
    </APIProvider>
  );
};

export default MapScreen;