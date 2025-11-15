export type ModelType = 'lorenz' | 'henon' | 'thomas';

// --- Specific Model Parameters ---

export interface LorenzParams {
    sigma: number;
    rho: number;
    beta: number;
    initial: [number, number, number]; // [x0, y0, z0]
    dt?: number;
}

export interface HenonParams {
    a: number;
    b: number;
    initial: [number, number]; // [x0, y0]
}

export interface ThomasParams {
    b: number;
    initial: [number, number, number]; // [x0, y0, z0]
    dt?: number;
}

export type SpecificParams = LorenzParams | HenonParams | ThomasParams;

// --- API Request/Response Types ---

export interface SimulationInputParams<T extends SpecificParams = SpecificParams> {
    model: ModelType;
    steps?: number;
    color?: string;
    params: T;
}

export interface SimulationResult {
    x: number[];
    y: number[];
    z?: number[]; // Only for 3D models (Lorenz, Thomas)
    color: string;
}

export interface SimulationHistoryItem {
    id: number;
    model_type: ModelType;
    created_at: string;
    is_stable: boolean;
}

export interface SimulationDetail extends SimulationHistoryItem {
    input_params: SimulationInputParams;
    results: SimulationResult;
}