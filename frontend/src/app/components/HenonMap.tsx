import React, { useState } from 'react';
import './_simulation-result.scss';
import type { SimulationDetail, HenonParams } from '../types/simulation';
import Plot2D from './Plot2D';

interface HenonMapProps {
    detail: SimulationDetail;
    onBackToHistory: () => void;
}

type VisualizationMode = 'X-Y' | 'X-T' | 'Y-T';

const HenonMap: React.FC<HenonMapProps> = ({ detail, onBackToHistory }) => {
    const params = detail.input_params.params as HenonParams;
    const results = detail.results;
    const [mode, setMode] = useState<VisualizationMode>('X-Y');

    const renderVisualization = () => {
        const plotResults = [results];
        const titlePrefix = `Henon Map #${detail.id}`;

        switch (mode) {
            case 'X-Y':
                return (
                    <div className="plot-wrapper">
                        <Plot2D results={plotResults} xAxis="x" yAxis="y" title={`${titlePrefix} (X vs Y)`} />
                    </div>
                );
            case 'X-T':
                return (
                    <div className="plot-wrapper">
                        <Plot2D results={plotResults} xAxis="t" yAxis="x" title={`${titlePrefix} (X vs Time)`} />
                    </div>
                );
            case 'Y-T':
                return (
                    <div className="plot-wrapper">
                        <Plot2D results={plotResults} xAxis="t" yAxis="y" title={`${titlePrefix} (Y vs Time)`} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="simulation-result">
            <div className="simulation-layout">
                <div className="info-column">
                    <h3>Henon Map Simulation #{detail.id}</h3>
                    <p>Status: <span className={detail.is_stable ? 'stable' : 'unstable'}>
                        {detail.is_stable ? 'Stable' : 'Unstable'}
                    </span></p>
                    
                    <div className="params-display">
                        <h4>Input Parameters:</h4>
                        <p>Parameter A: {params.a}</p>
                        <p>Parameter B: {params.b}</p>
                        <p>Initial Conditions (x0, y0): {params.initial.join(', ')}</p>
                        <p>Steps: {detail.input_params.steps}</p>
                        <p>Color: {detail.input_params.color}</p>
                    </div>

                    <div className="visualization-controls">
                        {(['X-Y', 'X-T', 'Y-T'] as VisualizationMode[]).map(visMode => (
                            <button
                                key={visMode}
                                onClick={() => setMode(visMode)}
                                className={mode === visMode ? 'active' : ''}
                            >
                                {visMode}
                            </button>
                        ))}
                    </div>
                    <button onClick={onBackToHistory} className="back-button">
                        Back to History
                    </button>
                </div>

                <div className="plot-column">
                    <div className="visualization-container" style={{ gridTemplateColumns: '1fr' }}>
                        {renderVisualization()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HenonMap;