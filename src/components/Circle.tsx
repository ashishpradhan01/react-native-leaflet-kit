import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { CircleProps } from '../types';

export const Circle: React.FC<CircleProps> = (props) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();
    const { id, center, radius, color, fillColor, fillOpacity, weight } = props;

    useEffect(() => {
        registerLayer('circle', id, { center, radius, color, fillColor, fillOpacity, weight });
        return () => unregisterLayer('circle', id);
    }, []);

    useEffect(() => {
        updateLayer('circle', id, { center, radius, color, fillColor, fillOpacity, weight });
    }, [id, center.lat, center.lng, radius, color, fillColor, fillOpacity, weight]);

    return null;
};
