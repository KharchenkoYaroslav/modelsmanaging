import React, { useState, useEffect, useCallback } from 'react';
import './_simulation-history.scss';
import type { SimulationHistoryItem } from '../types/simulation';
import { fetchHistory } from '../api';

interface SimulationHistoryProps {
    onSelectSimulationId: (id: number) => void;
    refreshTrigger: number;
}

const SimulationHistory: React.FC<SimulationHistoryProps> = ({ onSelectSimulationId, refreshTrigger }) => {
    const [history, setHistory] = useState<SimulationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchHistory();
            setHistory(response.data);
        } catch (err: unknown) {
            console.error('Failed to fetch history:', err);
            setError('Failed to load simulation history.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory, refreshTrigger]);

    if (loading) {
        return <div className="simulation-history">Loading history...</div>;
    }

    if (error) {
        return <div className={`simulation-history error-message`}>{error}</div>;
    }

    if (history.length === 0) {
        return <div className="simulation-history">No simulations found.</div>;
    }

    return (
        <div className="simulation-history">
            <h2>Simulation History</h2>
            <ul className="history-list">
                {history.map(item => (
                    <li
                        key={item.id}
                        className="history-item"
                        onClick={() => onSelectSimulationId(item.id)}
                    >
                        <span className="model-type">{item.model_type.toUpperCase()}</span>
                        <span className="created-at">{new Date(item.created_at).toLocaleString()}</span>
                        <span className={`status ${item.is_stable ? 'stable' : 'unstable'}`}>
                            {item.is_stable ? 'Stable' : 'Unstable'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SimulationHistory;