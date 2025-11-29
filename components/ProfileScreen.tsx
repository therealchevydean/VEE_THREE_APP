import React, { useState } from 'react';
import GenerateAvatarModal from './GenerateAvatarModal';
import { CameraIcon, XCircleIcon } from './icons';

interface ProfileScreenProps {
  onLogout: () => void;
  onClose: () => void;
}

const ProfileScreen = ({ onLogout, onClose }: ProfileScreenProps) => {
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/avatar/200');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-v3-bg animate-fade-in-up">
      {isModalOpen && <GenerateAvatarModal onClose={() => setIsModalOpen(false)} onSetAvatar={setAvatarUrl} />}
      
      <div className="p-4 border-b border-v3-border bg-v3-surface/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
            <p className="text-v3-text-secondary text-sm">Manage your identity</p>
        </div>
        <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary">
            <XCircleIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 pb-24">
        <div className="flex flex-col items-center py-8">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full p-1 border-2 border-v3-primary">
                 <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-v3-surface border border-v3-border p-2 rounded-full text-v3-primary hover:bg-v3-primary hover:text-white transition-colors"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold">Operative One</h2>
            <p className="text-v3-text-secondary">Level 5 Pioneer</p>
        </div>

        <div className="space-y-4">
            <div className="bg-v3-surface rounded-xl border border-v3-border overflow-hidden">
                <div className="p-4 border-b border-v3-border flex justify-between items-center">
                    <span className="font-medium">Push Notifications</span>
                    <div className="v3-toggle">
                        <input type="checkbox" className="v3-toggle-checkbox" defaultChecked />
                        <label className="v3-toggle-label"></label>
                    </div>
                </div>
                 <div className="p-4 flex justify-between items-center">
                    <span className="font-medium">Data Saver</span>
                     <div className="v3-toggle">
                        <input type="checkbox" className="v3-toggle-checkbox" />
                        <label className="v3-toggle-label"></label>
                    </div>
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full py-4 mt-8 bg-red-900/20 text-red-400 font-bold rounded-xl border border-red-900/50 hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
            >
                <XCircleIcon className="w-5 h-5" />
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;