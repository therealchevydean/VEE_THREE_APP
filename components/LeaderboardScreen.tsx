import React from 'react';
import { LeaderboardUser } from '../types';
import { XCircleIcon } from './icons';

interface LeaderboardScreenProps {
  onClose: () => void;
}

const mockLeaderboardData: LeaderboardUser[] = [
  { id: 1, rank: 1, name: 'QuantumLeaper', avatarUrl: 'https://picsum.photos/seed/user1/100', score: 15230, },
  { id: 2, rank: 2, name: 'CyberNomad', avatarUrl: 'https://picsum.photos/seed/user2/100', score: 14890, },
  { id: 3, rank: 3, name: 'PixelPioneer', avatarUrl: 'https://picsum.photos/seed/user3/100', score: 14500, },
  { id: 4, rank: 4, name: 'GlitchGuru', avatarUrl: 'https://picsum.photos/seed/user4/100', score: 13980, },
  { id: 5, rank: 5, name: 'DataDaemon', avatarUrl: 'https://picsum.photos/seed/user5/100', score: 13500, },
  { id: 6, rank: 6, name: 'User One', avatarUrl: 'https://picsum.photos/seed/avatar/100', score: 12750, isCurrentUser: true },
  { id: 7, rank: 7, name: 'SynthwaveSurfer', avatarUrl: 'https://picsum.photos/seed/user7/100', score: 12100, },
  { id: 8, rank: 8, name: 'NanoNinja', avatarUrl: 'https://picsum.photos/seed/user8/100', score: 11800, },
];

const RankIndicator = ({ rank }: { rank: number }) => {
  const colors = ['text-yellow-400', 'text-gray-400', 'text-orange-400'];
  return (
    <span className={`font-bold text-lg w-8 text-center ${rank <= 3 ? colors[rank - 1] : 'text-v3-text-secondary'}`}>
      {rank}
    </span>
  );
};

const LeaderboardScreen = ({ onClose }: LeaderboardScreenProps) => {
    const currentUser = mockLeaderboardData.find(u => u.isCurrentUser);

    return (
        <div className="flex flex-col h-full bg-v3-bg animate-fade-in-up">
            <div className="p-4 border-b border-v3-border bg-v3-surface/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
                    <p className="text-v3-text-secondary text-sm">Top operatives this week</p>
                </div>
                <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary">
                    <XCircleIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto px-4 py-4 pb-24 space-y-2">
                {mockLeaderboardData.map(user => (
                    <div key={user.id} className={`flex items-center p-3 rounded-lg border transition-colors ${user.isCurrentUser ? 'bg-v3-primary/10 border-v3-primary' : 'bg-v3-surface border-v3-border'}`}>
                        <RankIndicator rank={user.rank} />
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mx-3 border border-v3-border" />
                        <div className="flex-grow">
                            <p className="font-semibold text-v3-text-primary">{user.name}</p>
                            {user.isCurrentUser && <span className="text-[10px] text-v3-primary uppercase font-bold tracking-wider">You</span>}
                        </div>
                        <p className="font-bold text-v3-secondary">
                            {user.score.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {currentUser && (
                <div className="p-4 bg-v3-surface border-t border-v3-border sticky bottom-20 z-10">
                     <div className="flex items-center p-3 rounded-lg bg-v3-primary/20 border border-v3-primary shadow-lg">
                        <RankIndicator rank={currentUser.rank} />
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full mx-3 border border-v3-primary" />
                         <div className="flex-grow">
                            <p className="font-semibold text-v3-text-primary">{currentUser.name}</p>
                            <span className="text-[10px] text-v3-primary uppercase font-bold tracking-wider">Your Rank</span>
                        </div>
                        <p className="font-bold text-v3-secondary">
                            {currentUser.score.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaderboardScreen;