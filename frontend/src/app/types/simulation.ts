export type ModelType = 'lorenz' | 'henon' | 'thomas';

export interface LorenzParams {
    sigma: number;
    rho: number;
    beta: number;
    initial: [number, number, number];
    dt?: number;
}

export interface HenonParams {
    a: number;
    b: number;
    initial: [number, number];
}

export interface ThomasParams {
    b: number;
    initial: [number, number, number];
    dt?: number;
}

export type SpecificParams = LorenzParams | HenonParams | ThomasParams;

export interface SimulationInputParams<T extends SpecificParams = SpecificParams> {
    model: ModelType;
    steps?: number;
    color?: string;
    params: T;
}

export interface SimulationResult {
    x: number[];
    y: number[];
    z?: number[]; 
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