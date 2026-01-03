import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { PolylineProps } from '../types';

export const Polyline: React.FC<PolylineProps> = ({ id, positions, color, weight, opacity, dashArray, isAnimated }) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();

    useEffect(() => {
        registerLayer('polyline', id, { positions, color, weight, opacity, dashArray, isAnimated });
        return () => unregisterLayer('polyline', id);
    }, []);

    useEffect(() => {
        updateLayer('polyline', id, { positions, color, weight, opacity, dashArray, isAnimated });
    }, [positions, color, weight, opacity, dashArray, isAnimated]);

    return null;
};
