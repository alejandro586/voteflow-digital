// Utility functions for localStorage management

export interface UserData {
  dni: string;
  nombre: string;
  apellidos: string;
  distrito: string;
}

export interface VoteData {
  candidatoId: string;
  distrito: string;
  timestamp: string;
}

// User data management
export const saveUserData = (data: UserData) => {
  localStorage.setItem('userData', JSON.stringify(data));
};

export const getUserData = (): UserData | null => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
  localStorage.removeItem('userData');
};

// Vote tracking
export const hasVoted = (dni: string, categoria: 'presidente' | 'mesa' | 'alcalde'): boolean => {
  return localStorage.getItem(`${categoria}_voted_${dni}`) !== null;
};

export const markAsVoted = (dni: string, categoria: 'presidente' | 'mesa' | 'alcalde', voteData: VoteData) => {
  localStorage.setItem(`${categoria}_voted_${dni}`, JSON.stringify(voteData));
};

export const getVote = (dni: string, categoria: 'presidente' | 'mesa' | 'alcalde'): VoteData | null => {
  const data = localStorage.getItem(`${categoria}_voted_${dni}`);
  return data ? JSON.parse(data) : null;
};

export const hasCompletedAllVotes = (dni: string): boolean => {
  return hasVoted(dni, 'presidente') && hasVoted(dni, 'mesa') && hasVoted(dni, 'alcalde');
};

// Admin session
export const saveAdminSession = (email: string, rol: string, distrito: string | null, nombre: string, dni: string) => {
  localStorage.setItem('adminSession', JSON.stringify({ email, rol, distrito, nombre, dni }));
};

export const getAdminSession = () => {
  const data = localStorage.getItem('adminSession');
  return data ? JSON.parse(data) : null;
};

export const clearAdminSession = () => {
  localStorage.removeItem('adminSession');
};

// Get all votes for statistics
export const getAllVotesByCategory = (categoria: 'presidente' | 'mesa' | 'alcalde'): VoteData[] => {
  const votes: VoteData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${categoria}_voted_`)) {
      const voteData = localStorage.getItem(key);
      if (voteData) {
        votes.push(JSON.parse(voteData));
      }
    }
  }
  return votes;
};

// Reset all votes (super admin only)
export const resetAllVotes = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('_voted_') || key === 'userData')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Active voting category control
export const setActiveVotingCategory = (categoria: 'presidente' | 'mesa' | 'alcalde' | null) => {
  if (categoria) {
    localStorage.setItem('activeVotingCategory', categoria);
  } else {
    localStorage.removeItem('activeVotingCategory');
  }
};

export const getActiveVotingCategory = (): 'presidente' | 'mesa' | 'alcalde' | null => {
  const category = localStorage.getItem('activeVotingCategory');
  return category as 'presidente' | 'mesa' | 'alcalde' | null;
};

// ML Training Data Management
export interface TrainingData {
  id: string;
  distrito: string;
  categoria: string;
  votos: number;
  timestamp: string;
  processed: boolean;
}

export const saveTrainingData = (data: TrainingData) => {
  const existing = getTrainingData();
  const updated = [...existing, data];
  localStorage.setItem('mlTrainingData', JSON.stringify(updated));
};

export const getTrainingData = (): TrainingData[] => {
  const data = localStorage.getItem('mlTrainingData');
  return data ? JSON.parse(data) : [];
};

export const deleteTrainingData = (id: string) => {
  const existing = getTrainingData();
  const filtered = existing.filter(item => item.id !== id);
  localStorage.setItem('mlTrainingData', JSON.stringify(filtered));
};

export const clearAllTrainingData = () => {
  localStorage.removeItem('mlTrainingData');
};

export const markTrainingDataProcessed = (id: string) => {
  const existing = getTrainingData();
  const updated = existing.map(item => 
    item.id === id ? { ...item, processed: true } : item
  );
  localStorage.setItem('mlTrainingData', JSON.stringify(updated));
};
