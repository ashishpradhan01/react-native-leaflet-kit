import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { PolygonProps } from '../types';

export const Polygon: React.FC<PolygonProps> = (props) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();
    const { id, positions, color, fillColor, fillOpacity, weight } = props;

    useEffect(() => {
        registerLayer('polygon', id, { positions, color, fillColor, fillOpacity, weight });
        return () => unregisterLayer('polygon', id);
    }, []);

    useEffect(() => {
        updateLayer('polygon', id, { positions, color, fillColor, fillOpacity, weight });
    }, [id, positions, color, fillColor, fillOpacity, weight]);

    return null;
};
