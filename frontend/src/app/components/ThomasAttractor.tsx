import React, { useState } from 'react';
import './_simulation-result.scss';
import type { SimulationDetail, ThomasParams } from '../types/simulation';
import Plot2D from './Plot2D';
import Plot3D from './Plot3D';

interface ThomasAttractorProps {
    detail: SimulationDetail;
    onBackToHistory: () => void;
}

type VisualizationMode = '3D' | 'X-T' | 'Y-T' | 'Z-T' | 'X-Y';

const ThomasAttractor: React.FC<ThomasAttractorProps> = ({ detail, onBackToHistory }) => {
    const params = detail.input_params.params as ThomasParams;
    const results = detail.results;
    const [mode, setMode] = useState<VisualizationMode>('3D');

    const renderVisualization = () => {
        const plotResults = [results];
        const titlePrefix = `Thomas Attractor #${detail.id}`;

        switch (mode) {
            case '3D':
                return (
                    <div className="plot-wrapper">
                        <Plot3D results={plotResults} />
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
            case 'Z-T':
                return (
                    <div className="plot-wrapper">
                        <Plot2D results={plotResults} xAxis="t" yAxis="z" title={`${titlePrefix} (Z vs Time)`} />
                    </div>
                );
            case 'X-Y':
                return (
                    <div className="plot-wrapper">
                        <Plot2D results={plotResults} xAxis="x" yAxis="y" title={`${titlePrefix} (X vs Y)`} />
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
                    <h3>Thomas Attractor Simulation #{detail.id}</h3>
                    <p>Status: <span className={detail.is_stable ? 'stable' : 'unstable'}>
                        {detail.is_stable ? 'Stable' : 'Unstable'}
                    </span></p>
                    
                    <div className="params-display">
                        <h4>Input Parameters:</h4>
                        <p>Parameter B: {params.b}</p>
                        <p>Initial Conditions (x0, y0, z0): {params.initial.join(', ')}</p>
                        <p>Time Step (dt): {params.dt}</p>
                        <p>Steps: {detail.input_params.steps}</p>
                        <p>Color: {detail.input_params.color}</p>
                    </div>

                    <div className="visualization-controls">
                        {(['3D', 'X-T', 'Y-T', 'Z-T', 'X-Y'] as VisualizationMode[]).map(visMode => (
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
                    <div className="visualization-container">
                        {renderVisualization()}
                    </div >
                </div >
            </div >
        </div >
    );
};

export default ThomasAttractor;