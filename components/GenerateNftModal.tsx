import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { XCircleIcon, MagicWandIcon, SparklesIcon } from './icons';
import { NFT } from '../types';

interface GenerateNftModalProps {
  onClose: () => void;
  onMint: (newNft: Omit<NFT, 'id' | 'collection'>) => void;
}

const GenerateNftModal = ({ onClose, onMint }: GenerateNftModalProps) => {
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
        contents: { parts: [{ text: prompt }] },
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

  const handleMint = () => {
    if (generatedImage) {
      onMint({
        name: prompt.substring(0, 20) || 'AI Generated NFT',
        imageUrl: generatedImage,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
      <div className="bg-v3-surface rounded-lg w-full max-w-md border border-v3-border shadow-2xl animate-fade-in-up">
        <div className="p-4 border-b border-v3-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <MagicWandIcon className="w-6 h-6 mr-2 text-v3-secondary" />
            Create NFT with AI
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
                <p className="mt-2">Generating your masterpiece...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="AI generated NFT" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-v3-text-secondary p-4">
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </div>

          <textarea
            className="w-full p-2 bg-v3-bg border border-v3-border rounded-md focus:outline-none focus:ring-2 focus:ring-v3-primary"
            rows={3}
            placeholder="e.g., A majestic cat astronaut floating in space"
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
              disabled={isLoading}
              className="w-full py-3 bg-v3-secondary text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : generatedImage ? 'Regenerate' : 'Generate'}
            </button>
            <button
              onClick={handleMint}
              disabled={!generatedImage || isLoading}
              className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateNftModal;