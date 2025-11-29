import React, { useState } from 'react';
import { Transaction, NFT } from '../types';
import { MagicWandIcon, VaultIcon, XCircleIcon } from './icons';
import GenerateNftModal from './GenerateNftModal';

interface VaultScreenProps {
  currentBalance: number;
  onClose: () => void;
}

const mockTransactions: Transaction[] = [
  { id: 'tx1', type: 'Mission Reward', amount: 120, date: '2024-07-28', description: 'Community Cleanup' },
  { id: 'tx2', type: 'Geomine', amount: 8, date: '2024-07-28', description: 'Location Check-in' },
  { id: 'tx3', type: 'Geomine', amount: 5, date: '2024-07-27', description: 'Location Check-in' },
];

const initialNfts: NFT[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `V3 Collectible #${i + 1}`,
  collection: 'Genesis Series',
  imageUrl: `https://picsum.photos/seed/nft${i+1}/300/300`,
}));

const VaultScreen = ({ currentBalance, onClose }: VaultScreenProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'nfts'>('history');
  const [nfts, setNfts] = useState<NFT[]>(initialNfts);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const handleMintNft = (newNftData: Omit<NFT, 'id' | 'collection'>) => {
    const newNft: NFT = { id: Date.now(), collection: 'AI Generated', ...newNftData };
    setNfts(prev => [newNft, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-v3-bg animate-fade-in-up">
      {isGenerateModalOpen && <GenerateNftModal onClose={() => setIsGenerateModalOpen(false)} onMint={handleMintNft} />}
      
      <div className="p-6 bg-v3-surface border-b border-v3-border">
        <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">Vault</h1>
            <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary">
                <XCircleIcon className="w-8 h-8" />
            </button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-v3-bg to-v3-surface rounded-2xl border border-v3-border shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-v3-secondary to-v3-primary"></div>
          <span className="text-v3-text-secondary text-sm font-medium uppercase tracking-wider mb-2">Total Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tighter shadow-gold">
              {currentBalance.toLocaleString()}
            </span>
            <span className="text-xl font-bold text-v3-primary">MOBX</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-v3-border bg-v3-bg sticky top-0 z-10">
        <button 
          className={`flex-1 py-3 font-medium transition-colors text-sm uppercase tracking-wide ${activeTab === 'history' ? 'text-v3-primary border-b-2 border-v3-primary' : 'text-v3-text-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`flex-1 py-3 font-medium transition-colors text-sm uppercase tracking-wide ${activeTab === 'nfts' ? 'text-v3-primary border-b-2 border-v3-primary' : 'text-v3-text-secondary'}`}
          onClick={() => setActiveTab('nfts')}
        >
          NFTs
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 pb-24">
        {activeTab === 'history' && (
          <div className="space-y-3">
            {mockTransactions.map(tx => (
              <div key={tx.id} className="bg-v3-surface p-3 rounded-lg flex justify-between items-center border border-v3-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-v3-primary/10 flex items-center justify-center text-v3-primary">
                        <VaultIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{tx.type}</p>
                        <p className="text-xs text-v3-text-secondary">{tx.description}</p>
                    </div>
                </div>
                <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              className="aspect-square bg-v3-surface rounded-lg border-2 border-dashed border-v3-border flex flex-col items-center justify-center text-v3-text-secondary hover:border-v3-secondary hover:text-v3-secondary transition-colors"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <MagicWandIcon className="w-8 h-8 mb-2" />
              <span className="text-xs font-semibold">Mint AI NFT</span>
            </button>
            {nfts.map(nft => (
              <div key={nft.id} className="aspect-square bg-v3-surface rounded-lg overflow-hidden border border-v3-border relative group">
                <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{nft.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultScreen;