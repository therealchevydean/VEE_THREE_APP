import React, { useState, useCallback, useEffect } from 'react';
import MapScreen from './MapScreen';
import ActionButtons from './ActionButtons';
import MissionsScreen from './MissionsScreen';
import VaultScreen from './VaultScreen';
import LeaderboardScreen from './LeaderboardScreen';
import ProfileScreen from './ProfileScreen';
import { Mission, ActiveModal } from '../types';

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout = ({ onLogout }: MainLayoutProps) => {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    
    // Load state from localStorage or set default
    const [balance, setBalance] = useState<number>(() => {
        try {
            const savedBalance = localStorage.getItem('v3-balance');
            return savedBalance ? parseFloat(savedBalance) : 2150.75;
        } catch (error) {
            console.error("Failed to read balance from localStorage:", error);
            return 2150.75;
        }
    });
    
    const [missions, setMissions] = useState<Mission[]>(() => {
        try {
            const savedMissions = localStorage.getItem('v3-missions');
            if (!savedMissions) return [];
            const parsedMissions = JSON.parse(savedMissions);
            if (Array.isArray(parsedMissions)) {
                return parsedMissions;
            }
        } catch (error) {
            console.error("Failed to read missions from localStorage:", error);
        }
        return [];
    });

    // Persist balance to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('v3-balance', balance.toString());
        } catch (error) {
            console.error("Failed to save balance to localStorage:", error);
        }
    }, [balance]);

    // Persist missions to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('v3-missions', JSON.stringify(missions));
        } catch (error) {
            console.error("Failed to save missions to localStorage:", error);
        }
    }, [missions]);


    const handlePointsEarned = useCallback((points: number, description: string) => {
        setBalance(prev => prev + points);
        // Here you could also add a transaction to the history
    }, []);

    const renderModal = () => {
        switch (activeModal) {
            case 'missions':
                return <MissionsScreen 
                            onClose={() => setActiveModal(null)} 
                            missions={missions}
                            setMissions={setMissions}
                            onPointsEarned={handlePointsEarned}
                        />;
            case 'vault':
                return <VaultScreen onClose={() => setActiveModal(null)} currentBalance={balance} />;
            case 'leaderboard':
                return <LeaderboardScreen onClose={() => setActiveModal(null)} />;
            case 'profile':
                return <ProfileScreen onLogout={onLogout} onClose={() => setActiveModal(null)} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full w-full relative">
            <MapScreen 
                onPointsEarned={handlePointsEarned}
                missions={missions}
                setMissions={setMissions}
            />
            <ActionButtons onButtonClick={(modal) => setActiveModal(modal)} />
            
            <div className="transition-opacity duration-300">
              {renderModal()}
            </div>
        </div>
    );
}

export default MainLayout;
