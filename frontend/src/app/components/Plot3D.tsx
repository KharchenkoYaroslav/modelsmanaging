import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { SimulationResult } from '../types/simulation';

interface LineProps {
    points: THREE.Vector3[];
    color: string;
}

const AttractorLine: React.FC<LineProps> = ({ points, color }) => {
    return (
        <Line 
            points={points} 
            color={color} 
            lineWidth={1} 
        />
    );
};

interface Plot3DProps {
    results: SimulationResult[];
}

const Plot3D: React.FC<Plot3DProps> = ({ results }) => {
    const validResults = results.filter(r => r.z && r.z.length === r.x.length);

    const lines = validResults.map((result, index) => {
        const points = result.x.map((x, i) => {
            return new THREE.Vector3(x, result.y[i], result.z![i]);
        });

        return (
            <AttractorLine 
                key={index} 
                points={points} 
                color={result.color} 
            />
        );
    });

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enableDamping dampingFactor={0.25} />
                {lines}
            </Canvas>
        </div>
    );
};

export default Plot3D;
