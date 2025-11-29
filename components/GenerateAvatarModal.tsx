import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { XCircleIcon, MagicWandIcon, SparklesIcon } from './icons';

interface GenerateAvatarModalProps {
  onClose: () => void;
  onSetAvatar: (imageUrl: string) => void;
}

const GenerateAvatarModal = ({ onClose, onSetAvatar }: GenerateAvatarModalProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A vibrant, high-quality avatar. ${prompt}` }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          setGeneratedImage(imageUrl);
          return;
        }
      }
      throw new Error('No image was generated. Please try a different prompt.');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAvatar = () => {
    if (generatedImage) {
      onSetAvatar(generatedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
      <div className="bg-v3-surface rounded-lg w-full max-w-md border border-v3-border shadow-2xl animate-fade-in-up">
        <div className="p-4 border-b border-v3-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <MagicWandIcon className="w-6 h-6 mr-2 text-v3-secondary" />
            Generate AI Avatar
          </h2>
          <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="aspect-square bg-v3-bg rounded-lg border border-v3-border flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="text-center text-v3-text-secondary">
                <SparklesIcon className="w-12 h-12 animate-pulse mx-auto" />
                <p className="mt-2">Generating your avatar...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="AI generated avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-v3-text-secondary p-4">
                <p>Your generated avatar will appear here.</p>
              </div>
            )}
          </div>

          <textarea
            className="w-full p-2 bg-v3-bg border border-v3-border rounded-md focus:outline-none focus:ring-2 focus:ring-v3-primary"
            rows={3}
            placeholder="e.g., A cyberpunk raccoon with neon glasses"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          
          {error && (
            <div className="p-2 text-center bg-red-500/20 text-red-400 text-sm rounded-lg" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 bg-v3-secondary text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : generatedImage ? 'Regenerate' : 'Generate'}
            </button>
            <button
              onClick={handleSetAvatar}
              disabled={!generatedImage || isLoading}
              className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set as Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateAvatarModal;