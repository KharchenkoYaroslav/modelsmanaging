import React, { useState, useCallback, useMemo } from 'react';
import './_simulation-create.scss';
import axios from 'axios';
import {
    type ModelType,
    type SimulationInputParams,
    type LorenzParams,
    type HenonParams,
    type ThomasParams,
    type SpecificParams,
    type SimulationDetail
} from '../types/simulation';
import { createSimulation } from '../api';

interface SimulationCreateProps {
    onSimulationCreated: (detail: SimulationDetail) => void;
}

const MODEL_CHOICES: { value: ModelType; label: string }[] = [
    { value: 'lorenz', label: 'Lorenz Attractor' },
    { value: 'henon', label: 'Henon Map' },
    { value: 'thomas', label: 'Thomas Attractor' },
];

const DEFAULT_LORENZ: LorenzParams = { sigma: 10, rho: 28, beta: 8 / 3, initial: [1, 1, 1], dt: 0.01 };
const DEFAULT_HENON: HenonParams = { a: 1.4, b: 0.3, initial: [0.1, 0.3] };
const DEFAULT_THOMAS: ThomasParams = { b: 0.18, initial: [0, 0, 1], dt: 0.01 };

const SimulationCreate: React.FC<SimulationCreateProps> = ({ onSimulationCreated }) => {
    const [model, setModel] = useState<ModelType>('lorenz');
    const [steps, setSteps] = useState(0);
    const [color, setColor] = useState('#0000ff');
    const [params, setParams] = useState<SpecificParams>(DEFAULT_LORENZ as SpecificParams);
    const [initialString, setInitialString] = useState(DEFAULT_LORENZ.initial.join(', '));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleModelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value as ModelType;
        setModel(newModel);
        setError(null);
        switch (newModel) {
            case 'lorenz':
                setParams(DEFAULT_LORENZ as SpecificParams);
                setInitialString(DEFAULT_LORENZ.initial.join(', '));
                setSteps(50000);
                break;
            case 'henon':
                setParams(DEFAULT_HENON as SpecificParams);
                setInitialString(DEFAULT_HENON.initial.join(', '));
                setSteps(1000);
                break;
            case 'thomas':
                setParams(DEFAULT_THOMAS as SpecificParams);
                setInitialString(DEFAULT_THOMAS.initial.join(', '));
                setSteps(50000);
                break;
        }
    }, []);

    const handleParamChange = useCallback((key: string, value: number) => {
        setParams(prev => ({ ...prev, [key]: value } as SpecificParams));
    }, []);

    const handleInitialChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInitialString(e.target.value);
    }, []);

    const renderParamInput = useCallback((key: string, currentValue: number, label: string) => {
        return (
            <div key={key} className="form-group">
                <label htmlFor={key}>{label}:</label>
                <input
                    type="number"
                    step="any"
                    id={key}
                    value={currentValue}
                    onChange={(e) => handleParamChange(key as keyof SpecificParams, parseFloat(e.target.value))}
                    required
                />
            </div>
        );
    }, [handleParamChange]);

    const renderSpecificParams = useMemo(() => {
        const initialPlaceholder = model === 'henon' ? 'N, N' : 'N, N, N';
        const initialLabel = model === 'henon' ? 'Initial (x0, y0)' : 'Initial (x0, y0, z0)';

        const initialInput = (
            <div key="initial" className="form-group">
                <label htmlFor="initial">{initialLabel}:</label>
                <input
                    type="text"
                    id="initial"
                    value={initialString}
                    onChange={handleInitialChange}
                    placeholder={initialPlaceholder}
                    required
                />
            </div>
        );

        switch (model) {
            case 'lorenz': {
                const lorenzParams = params as LorenzParams;
                return (
                    <>
                        {renderParamInput('sigma', lorenzParams.sigma, 'Sigma')}
                        {renderParamInput('rho', lorenzParams.rho, 'Rho')}
                        {renderParamInput('beta', lorenzParams.beta, 'Beta')}
                        {initialInput}
                        {renderParamInput('dt', lorenzParams.dt ?? DEFAULT_LORENZ.dt!, 'Dt')}
                    </>
                );
            }
            case 'henon': {
                const henonParams = params as HenonParams;
                return (
                    <>
                        {renderParamInput('a', henonParams.a, 'A')}
                        {renderParamInput('b', henonParams.b, 'B')}
                        {initialInput}
                    </>
                );
            }
            case 'thomas': {
                const thomasParams = params as ThomasParams;
                return (
                    <>
                        {renderParamInput('b', thomasParams.b, 'B')}
                        {initialInput}
                        {renderParamInput('dt', thomasParams.dt ?? DEFAULT_THOMAS.dt!, 'Dt')}
                    </>
                );
            }
            default:
                return null;
        }
    }, [model, params, renderParamInput, initialString, handleInitialChange]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const initialParts = initialString.split(',').map(p => parseFloat(p.trim()));
        const initialValues = initialParts.filter(p => !isNaN(p));

        let requiredLength: number;
        if (model === 'lorenz' || model === 'thomas') {
            requiredLength = 3;
        } else if (model === 'henon') {
            requiredLength = 2;
        } else {
            setLoading(false);
            return;
        }

        if (initialValues.length !== requiredLength) {
            setError(`Initial conditions must contain exactly ${requiredLength} numbers.`);
            setLoading(false);
            return;
        }

        
        let updatedParams: SpecificParams;

        if (requiredLength === 3) {
            updatedParams = { ...params, initial: initialValues as [number, number, number] } as LorenzParams | ThomasParams;
        } else {
            updatedParams = { ...params, initial: initialValues as [number, number] } as HenonParams;
        }

        const requestData: SimulationInputParams = {
            model,
            steps,
            color,
            params: updatedParams,
        };

        try {
            const response = await createSimulation(requestData);
            onSimulationCreated(response.data);
        } catch (err: unknown) {
            console.error('Simulation creation failed:', err);
            let errorMessage = 'Unknown error occurred.';
            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data;
                errorMessage = data?.error || data?.detail || JSON.stringify(data);
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [model, steps, color, params, onSimulationCreated, initialString]);

    return (
        <div className="simulation-create">
            <h2>Create New Simulation</h2>
            <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label htmlFor="model">Model:</label>
                    <select id="model" value={model} onChange={handleModelChange} required>
                        {MODEL_CHOICES.map(choice => (
                            <option key={choice.value} value={choice.value}>
                                {choice.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="steps">Steps:</label>
                    <input
                        type="number"
                        id="steps"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="color">Color:</label>
                    <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                    />
                </div>

                <h3>Model Parameters</h3>
                {renderSpecificParams}

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Running...' : 'Run Simulation'}
                </button>
            </form>
        </div>
    );
};

export default SimulationCreate;