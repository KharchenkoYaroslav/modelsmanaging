import React, { useState, useCallback, useEffect } from "react";
import "../components/_models.scss";
import { CgProfile } from 'react-icons/cg';
import Profile from '../components/Profile';
import SimulationCreate from '../components/SimulationCreate';
import SimulationHistory from '../components/SimulationHistory';
import LorenzAttractor from '../components/LorenzAttractor';
import HenonMap from '../components/HenonMap';
import ThomasAttractor from '../components/ThomasAttractor';
import type { SimulationDetail, ModelType } from '../types/simulation';
import { fetchSimulationDetail } from '../api';

interface ModelsProps {
  onLogout: () => void;
  username: string | null;
}

type ViewMode = 'create' | 'history';

const Models: React.FC<ModelsProps> = ({ onLogout, username }) => {
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null);
  const [simulationDetail, setSimulationDetail] = useState<SimulationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSelectSimulationId = useCallback((id: number) => {
    setSelectedSimulationId(id);
    setViewMode('history'); 
  }, []);

  const handleSimulationCreated = useCallback((detail: SimulationDetail) => {
    setSimulationDetail(detail);
    setSelectedSimulationId(detail.id);
    setViewMode('history');
    setHistoryRefreshTrigger(prev => prev + 1);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setSelectedSimulationId(null);
    setSimulationDetail(null);
  }, []);

  useEffect(() => {
    if (selectedSimulationId !== null) {
      setLoadingDetail(true);
      setDetailError(null);
      setSimulationDetail(null);
      
      fetchSimulationDetail(selectedSimulationId)
        .then(response => {
          setSimulationDetail(response.data);
        })
        .catch(err => {
          console.error("Failed to fetch simulation detail:", err);
          setDetailError("Failed to load simulation details.");
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    }
  }, [selectedSimulationId]);

  const renderSimulationComponent = (detail: SimulationDetail) => {
    switch (detail.model_type as ModelType) {
      case 'lorenz':
        return <LorenzAttractor detail={detail} onBackToHistory={() => setSelectedSimulationId(null)} />;
      case 'henon':
        return <HenonMap detail={detail} onBackToHistory={() => setSelectedSimulationId(null)} />;
      case 'thomas':
        return <ThomasAttractor detail={detail} onBackToHistory={() => setSelectedSimulationId(null)} />;
      default:
        return <p>Unknown model type.</p>;
    }
  };

  const renderContent = () => {
    if (viewMode === 'create') {
      return (
        <div className="create-content">
          <SimulationCreate onSimulationCreated={handleSimulationCreated} />
        </div>
      );
    }

    if (selectedSimulationId !== null) {
      if (loadingDetail) {
        return <p className="loading-message">Loading simulation details...</p>;
      }
      if (detailError) {
        return <p className={`error-message error-message`}>{detailError}</p>;
      }
      if (simulationDetail) {
        return (
          <div className="simulation-detail-content">
            {renderSimulationComponent(simulationDetail)}
          </div>
        );
      }
    }

    return (
      <div className="history-content">
        <SimulationHistory onSelectSimulationId={handleSelectSimulationId} refreshTrigger={historyRefreshTrigger} />
      </div>
    );
  };

  return (
    <div className="models">
      <nav>
        <button
          onClick={() => handleViewModeChange('create')}
          className={viewMode === 'create' ? 'active' : ''}
        >
          Create Simulation
        </button>
        <button 
          onClick={() => handleViewModeChange('history')}
          className={viewMode === 'history' ? 'active' : ''}
        >
          History
        </button>
        <div className="profile-icon" onClick={handleProfileToggle}>
          <CgProfile size={30} cursor="pointer" />
        </div>
      </nav>
      <Profile username={username} onLogout={onLogout} isProfileOpen={isProfileOpen} handleProfileToggle={handleProfileToggle} />
      <main className="models-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Models;
