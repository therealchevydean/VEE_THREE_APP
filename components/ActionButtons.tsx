import React from 'react';
import { MissionsIcon, VaultIcon, LeaderboardIcon, ProfileIcon } from './icons';
import { ActiveModal } from '../types';


interface ActionButtonsProps {
    onButtonClick: (modal: Exclude<ActiveModal, null>) => void;
}

const actionButtons = [
    { modal: 'missions', icon: MissionsIcon, label: 'Missions' },
    { modal: 'vault', icon: VaultIcon, label: 'Vault' },
    { modal: 'leaderboard', icon: LeaderboardIcon, label: 'Leaders' },
    { modal: 'profile', icon: ProfileIcon, label: 'Profile' },
] as const;


const ActionButtons = ({ onButtonClick }: ActionButtonsProps) => {
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
            {actionButtons.map(button => (
                 <button
                    key={button.modal}
                    onClick={() => onButtonClick(button.modal)}
                    className="w-14 h-14 bg-v3-surface/80 backdrop-blur-sm border border-v3-border rounded-full flex items-center justify-center shadow-lg hover:bg-v3-primary/20 transition-colors group relative"
                    aria-label={`Open ${button.label}`}
                >
                    <button.icon className="w-7 h-7" />
                     <span className="absolute right-full mr-3 px-3 py-1 bg-v3-surface text-v3-text-primary text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {button.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ActionButtons;