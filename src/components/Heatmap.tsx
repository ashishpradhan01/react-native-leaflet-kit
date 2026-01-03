import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { HeatmapProps } from '../types';

export const Heatmap: React.FC<HeatmapProps> = ({ id, points, radius, blur, max }) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();

    useEffect(() => {
        registerLayer('heatmap', id, { points, radius, blur, max });
        return () => unregisterLayer('heatmap', id);
    }, []);

    useEffect(() => {
        updateLayer('heatmap', id, { points, radius, blur, max });
    }, [id, points, radius, blur, max]);

    return null;
};
