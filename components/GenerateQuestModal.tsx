import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { XCircleIcon, CompassIcon, SparklesIcon, MapIcon } from './icons';
import { Mission } from '../types';

interface GenerateQuestModalProps {
  onClose: () => void;
  onGenerate: (newMissions: Omit<Mission, 'id' | 'status'>[]) => void;
}

const interests = ['Community', 'Art', 'Environment', 'Fitness', 'Knowledge'];

const GenerateQuestModal = ({ onClose, onGenerate }: GenerateQuestModalProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Select your interests and generate a quest!');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setStatusText("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setStatusText("Location acquired!");
      },
      () => {
        setError("Unable to retrieve your location. Please enable location services.");
        setStatusText("Select your interests and generate a quest!");
      }
    );
  };

  const handleGenerate = async () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setStatusText('Crafting your personal quest...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const schema = {
        type: Type.OBJECT,
        properties: {
          missions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "A short, catchy title for the mission." },
                description: { type: Type.STRING, description: "A one-sentence description of the task." },
                points: { type: Type.NUMBER, description: "An integer value for the reward points, between 25 and 150." },
              },
              required: ['title', 'description', 'points'],
            }
          }
        },
        required: ['missions']
      };

      const locationPrompt = location 
        ? `The user is currently near latitude ${location.lat} and longitude ${location.lon}. Make the missions relevant to a person in this general area, but without mentioning specific coordinates.`
        : "The user's location is not available, so create generic missions.";

      const prompt = `Generate a themed quest of 3-5 creative, positive missions for a mobile app. The quest should be based on these interests: ${selectedInterests.join(', ')}. ${locationPrompt} The missions should be something a user can realistically complete and provide proof for (like a photo). Return a JSON object containing a list of missions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const result = JSON.parse(response.text);
      if (result.missions && result.missions.length > 0) {
        onGenerate(result.missions);
      } else {
        throw new Error("The AI didn't return any missions. Please try again.");
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate quest. Please try again.');
    } finally {
      setIsLoading(false);
      setStatusText('Select your interests and generate a quest!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
      <div className="bg-v3-surface rounded-lg w-full max-w-md border border-v3-border shadow-2xl animate-fade-in-up">
        <div className="p-4 border-b border-v3-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <CompassIcon className="w-6 h-6 mr-2 text-v3-secondary" />
            Generate AI Quest
          </h2>
          <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-v3-text-secondary mb-2">1. Choose your interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition-colors ${
                    selectedInterests.includes(interest)
                      ? 'bg-v3-primary/80 border-v3-primary text-white'
                      : 'bg-v3-surface border-v3-border hover:border-v3-text-secondary'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-v3-text-secondary mb-2">2. Add location (optional)</label>
             <button
                onClick={handleGetLocation}
                disabled={!!location}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-v3-bg text-v3-text-primary border border-v3-border font-semibold rounded-lg hover:border-v3-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <MapIcon className={`w-5 h-5 ${location ? 'text-green-400' : ''}`} />
                <span>{location ? `Location Added!` : 'Use My Current Location'}</span>
              </button>
          </div>

          <div className="h-12 flex items-center justify-center text-center">
             {isLoading ? (
                <div className="text-v3-text-secondary flex items-center">
                    <SparklesIcon className="w-6 h-6 animate-pulse mr-2" />
                    <p>{statusText}</p>
                </div>
              ) : (
                <p className="text-sm text-v3-text-secondary">{statusText}</p>
              )
            }
          </div>

          {error && (
            <div className="p-2 text-center bg-red-500/20 text-red-400 text-sm rounded-lg" role="alert">
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || selectedInterests.length === 0}
            className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Quest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuestModal;