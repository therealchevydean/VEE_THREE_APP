import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import MapScreen from './components/MapScreen';
import MissionsScreen from './components/MissionsScreen';
import VaultScreen from './components/VaultScreen';
import ProfileScreen from './components/ProfileScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BottomNav from './components/BottomNav';
import AssistantFAB from './components/AssistantFAB';
import AssistantModal from './components/AssistantModal';
import { Mission } from './types';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('v3-isAuthenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [balance, setBalance] = useState<number>(() => {
    try {
        const saved = localStorage.getItem('v3-balance');
        return saved ? parseFloat(saved) : 2150.75;
    } catch {
        return 2150.75;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
        const saved = localStorage.getItem('v3-missions');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('v3-isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('v3-balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('v3-missions', JSON.stringify(missions));
  }, [missions]);

  const handleLogin = () => setIsAuthenticated(true);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('v3-isAuthenticated');
  };

  const handlePointsEarned = useCallback((points: number, description: string) => {
    setBalance(prev => prev + points);
    console.log(`Earned ${points} for ${description}`);
  }, []);

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex flex-col h-full w-full bg-v3-bg text-v3-text-primary overflow-hidden">
        <div className="flex-grow relative overflow-hidden">
          <Routes>
            <Route 
              path="/map" 
              element={
                <MapScreen 
                  onPointsEarned={handlePointsEarned}
                  missions={missions}
                  setMissions={setMissions}
                />
              } 
            />
            <Route 
              path="/missions" 
              element={
                <MissionsScreen 
                  missions={missions} 
                  setMissions={setMissions}
                  onPointsEarned={handlePointsEarned}
                />
              } 
            />
            <Route 
              path="/vault" 
              element={
                <VaultScreen currentBalance={balance} />
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <LeaderboardScreen />
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProfileScreen onLogout={handleLogout} />
              } 
            />
            <Route path="*" element={<Navigate to="/map" replace />} />
          </Routes>
        </div>
        
        <BottomNav />
        
        <AssistantFAB onClick={() => setIsAssistantOpen(true)} />
        {isAssistantOpen && <AssistantModal onClose={() => setIsAssistantOpen(false)} />}
      </div>
    </HashRouter>
  );
};

export default App;