import React from 'react';
import { V3Logo } from './icons';

interface TopBarProps {
    balance: number;
    onProfileClick: () => void;
}

const TopBar = ({ balance, onProfileClick }: TopBarProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 p-4 z-30 flex justify-between items-center bg-v3-bg/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                    <V3Logo />
                </div>
                <div className="bg-v3-surface px-4 py-2 rounded-lg border border-v3-border shadow-md">
                    <span className="font-bold text-lg text-v3-secondary">{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-v3-text-secondary ml-2 text-sm">MOBX</span>
                </div>
            </div>
            <button
                onClick={onProfileClick}
                className="w-12 h-12 bg-v3-surface rounded-full flex items-center justify-center border border-v3-border shadow-md hover:bg-v3-primary/20 transition-colors"
                aria-label="Open Profile"
            >
                <img src="https://picsum.photos/seed/avatar/100" alt="User Avatar" className="w-full h-full rounded-full object-cover" />
            </button>
        </header>
    );
}

export default TopBar;