import React, { useState } from 'react';
import { XCircleIcon, NavigationIcon } from './icons';
import { Mission, MissionStatus } from '../types';

interface SetDestinationModalProps {
  onClose: () => void;
  onSetMission: (newMission: Omit<Mission, 'id'>) => void;
}

const distances = [
  { label: 'Short Walk', meters: 200, points: 15 },
  { label: 'Medium Jaunt', meters: 500, points: 40 },
  { label: 'Long Trek', meters: 1000, points: 100 },
];

const SetDestinationModal = ({ onClose, onSetMission }: SetDestinationModalProps) => {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetDestination = () => {
    if (selectedDistance === null) {
      setError("Please select a distance.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distanceInfo = distances.find(d => d.meters === selectedDistance);
        if (!distanceInfo) return;

        const newMission: Omit<Mission, 'id'> = {
          title: `Travel ${distanceInfo.meters}m`,
          description: `Complete a ${distanceInfo.label.toLowerCase()} to earn a geodrop.`,
          points: distanceInfo.points,
          status: MissionStatus.AVAILABLE,
          type: 'destination',
          destinationDetails: {
            startLat: position.coords.latitude,
            startLon: position.coords.longitude,
            targetDistanceMeters: distanceInfo.meters,
            distanceTraveledMeters: 0,
          },
        };
        onSetMission(newMission);
        onClose();
      },
      () => {
        setError("Unable to retrieve your location to start the mission. Please enable location services.");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
      <div className="bg-v3-surface rounded-lg w-full max-w-md border border-v3-border shadow-2xl animate-fade-in-up">
        <div className="p-4 border-b border-v3-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <NavigationIcon className="w-6 h-6 mr-2 text-v3-secondary" />
            Set Destination
          </h2>
          <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-v3-text-secondary">Choose a distance to travel and you'll receive a geodrop reward upon arrival.</p>

          <div className="space-y-3">
            {distances.map(({ label, meters, points }) => (
              <div
                key={meters}
                onClick={() => setSelectedDistance(meters)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors flex justify-between items-center ${selectedDistance === meters ? 'border-v3-primary bg-v3-primary/10' : 'border-v3-border bg-v3-bg hover:border-v3-text-secondary'}`}
              >
                <div>
                  <p className="font-bold text-lg">{label}</p>
                  <p className="text-sm text-v3-text-secondary">{meters} meters</p>
                </div>
                <p className="font-bold text-xl text-v3-secondary">{points} MOBX</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-2 text-center bg-red-500/20 text-red-400 text-sm rounded-lg" role="alert">
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleSetDestination}
            disabled={isLoading || selectedDistance === null}
            className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Getting Location...' : 'Start Journey'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetDestinationModal;