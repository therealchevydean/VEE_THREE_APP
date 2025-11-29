import React, { useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Mission, MissionStatus } from '../types';
import { UploadCloudIcon, XCircleIcon, CompassIcon, SparklesIcon, NavigationIcon } from './icons';
import GenerateQuestModal from './GenerateQuestModal';
import SetDestinationModal from './SetDestinationModal';

interface MissionsScreenProps {
  missions: Mission[];
  setMissions: Dispatch<SetStateAction<Mission[]>>;
  onPointsEarned: (points: number, description: string) => void;
  onClose: () => void;
}

const MissionCard: React.FC<{ mission: Mission; onSelect: (m: Mission) => void }> = ({ mission, onSelect }) => {
  const statusStyles = {
    [MissionStatus.AVAILABLE]: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Available' },
    [MissionStatus.PENDING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
    [MissionStatus.COMPLETED]: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Completed' },
    [MissionStatus.FAILED]: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Failed' },
  };
  const { bg, text, label } = statusStyles[mission.status];
  const isDestination = mission.type === 'destination';

  return (
    <div
      className="bg-v3-surface p-4 rounded-lg border border-v3-border space-y-2 cursor-pointer hover:border-v3-primary transition-colors"
      onClick={() => onSelect(mission)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
            {isDestination && <NavigationIcon className="w-5 h-5 text-v3-secondary" />}
            <h3 className="font-bold text-lg text-v3-text-primary">{mission.title}</h3>
            {mission.isAiGenerated && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-v3-secondary/30 text-v3-secondary">AI</span>
            )}
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>{label}</span>
      </div>
      <p className="text-sm text-v3-text-secondary">{mission.description}</p>
      
      {isDestination && mission.destinationDetails && mission.status === MissionStatus.AVAILABLE && (
        <div className="space-y-1 pt-2">
            <div className="w-full bg-v3-bg rounded-full h-2.5">
                <div 
                    className="bg-v3-secondary h-2.5 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min(100, (mission.destinationDetails.distanceTraveledMeters / mission.destinationDetails.targetDistanceMeters) * 100)}%`}}>
                </div>
            </div>
            <p className="text-xs text-right text-v3-text-secondary">
                {Math.round(mission.destinationDetails.distanceTraveledMeters)} / {mission.destinationDetails.targetDistanceMeters} meters
            </p>
        </div>
      )}
      <p className="font-bold text-v3-secondary text-right">{mission.points} MOBX</p>
    </div>
  );
};

const MissionDetailModal = ({ mission, onClose, onSubmit }: { mission: Mission; onClose: () => void; onSubmit: (id: number) => void }) => {
  const [proofText, setProofText] = useState('');
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-v3-surface rounded-lg w-full max-w-md border border-v3-border shadow-2xl animate-fade-in-up">
        <div className="p-4 border-b border-v3-border flex justify-between items-center">
            <h2 className="text-xl font-bold">{mission.title}</h2>
            <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary">
                <XCircleIcon className="w-6 h-6"/>
            </button>
        </div>
        <div className="p-4 space-y-4">
            <p className="text-v3-text-secondary">{mission.description}</p>
            <p className="font-bold text-v3-secondary text-xl">{mission.points} MOBX Reward</p>
            
            {mission.status === MissionStatus.AVAILABLE && mission.type !== 'destination' && (
              <>
                <textarea 
                  className="w-full p-2 bg-v3-bg border border-v3-border rounded-md focus:outline-none focus:ring-2 focus:ring-v3-primary"
                  rows={3}
                  placeholder="Add a comment..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                />
                <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-v3-border rounded-lg cursor-pointer hover:border-v3-primary transition-colors">
                    <UploadCloudIcon className="w-8 h-8 text-v3-text-secondary mb-2" />
                    <span className="text-v3-text-secondary text-sm">{fileName || 'Upload proof (photo)'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <button onClick={() => onSubmit(mission.id)} className="w-full py-3 bg-v3-primary text-white font-bold rounded-lg hover:bg-v3-primary-hover transition-colors">
                    Submit for Approval
                </button>
              </>
            )}
            {mission.status === MissionStatus.COMPLETED && (
                <div className="p-3 text-center bg-green-500/20 text-green-400 rounded-lg font-medium">Mission Completed!</div>
            )}
             {mission.status === MissionStatus.PENDING && (
                <div className="p-3 text-center bg-yellow-500/20 text-yellow-400 rounded-lg font-medium">Under Review</div>
            )}
        </div>
      </div>
    </div>
  );
};

const MissionsScreen = ({ missions, setMissions, onClose }: MissionsScreenProps) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  
  const hasActiveDest = missions.some(m => m.type === 'destination' && m.status === MissionStatus.AVAILABLE);

  const handleGenerate = (newMissions: Omit<Mission, 'id' | 'status'>[]) => {
    const formatted = newMissions.map(m => ({
        ...m, id: Date.now() + Math.random(), status: MissionStatus.AVAILABLE, isAiGenerated: true, type: 'standard' as const
    }));
    setMissions(prev => [...formatted, ...prev]);
    setIsQuestModalOpen(false);
  };

  const handleSetDest = (newMission: Omit<Mission, 'id'>) => {
    setMissions(prev => [{...newMission, id: Date.now() + Math.random()}, ...prev]);
    setIsDestModalOpen(false);
  };

  const handleSubmitMission = (id: number) => {
    setMissions(prev => prev.map(m => m.id === id ? {...m, status: MissionStatus.PENDING} : m));
    setSelectedMission(null);
  };

  return (
    <div className="flex flex-col h-full bg-v3-bg animate-fade-in-up">
      {isQuestModalOpen && <GenerateQuestModal onClose={() => setIsQuestModalOpen(false)} onGenerate={handleGenerate} />}
      {isDestModalOpen && <SetDestinationModal onClose={() => setIsDestModalOpen(false)} onSetMission={handleSetDest} />}
      {selectedMission && <MissionDetailModal mission={selectedMission} onClose={() => setSelectedMission(null)} onSubmit={handleSubmitMission} />}

      <div className="p-4 border-b border-v3-border bg-v3-surface/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white mb-1">Missions</h1>
            <p className="text-v3-text-secondary text-sm">Complete tasks to earn MOBX</p>
        </div>
        <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary">
            <XCircleIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="p-4 flex gap-3 sticky top-[80px] bg-v3-bg z-10 pb-2">
        <button 
          onClick={() => setIsDestModalOpen(true)}
          disabled={hasActiveDest}
          className="flex-1 bg-v3-surface border border-v3-border p-3 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-v3-primary transition-colors disabled:opacity-50"
        >
          <NavigationIcon className="w-5 h-5 text-v3-primary" />
          <span className="text-xs font-semibold">New Journey</span>
        </button>
        <button 
          onClick={() => setIsQuestModalOpen(true)}
          className="flex-1 bg-v3-surface border border-v3-border p-3 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-v3-secondary transition-colors"
        >
          <CompassIcon className="w-5 h-5 text-v3-secondary" />
          <span className="text-xs font-semibold">AI Quest</span>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-24 space-y-4">
        {missions.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-12 text-v3-text-secondary opacity-60">
             <CompassIcon className="w-16 h-16 mb-4" />
             <p>No active missions.</p>
           </div>
        ) : (
           missions.map(m => <MissionCard key={m.id} mission={m} onSelect={setSelectedMission} />)
        )}
      </div>
    </div>
  );
};

export default MissionsScreen;