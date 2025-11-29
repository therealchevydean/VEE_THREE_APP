export enum MissionStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface DestinationDetails {
  startLat: number;
  startLon: number;
  targetDistanceMeters: number;
  distanceTraveledMeters: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  status: MissionStatus;
  isAiGenerated?: boolean;
  type?: 'standard' | 'destination';
  destinationDetails?: DestinationDetails;
}

export interface Transaction {
  id: string;
  type: 'Geomine' | 'Mission Reward' | 'Purchase';
  amount: number;
  date: string;
  description: string;
}

export interface NFT {
  id: number;
  name: string;
  imageUrl: string;
  collection: string;
}

export interface LeaderboardUser {
  id: number;
  rank: number;
  name: string;
  avatarUrl: string;
  score: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface MapTile {
  id: string;
  x: number;
  y: number;
  status: 'active' | 'mined';
}

// FIX: Moved from MainLayout.tsx to break circular dependency
export type ActiveModal = 'missions' | 'vault' | 'leaderboard' | 'profile' | null;