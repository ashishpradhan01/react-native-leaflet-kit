import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { GeoJSONProps } from '../types';

export const GeoJSON: React.FC<GeoJSONProps> = ({ id, data, style, onPress }) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();

    useEffect(() => {
        registerLayer('geojson', id, { data, style });
        return () => unregisterLayer('geojson', id);
    }, []);

    useEffect(() => {
        updateLayer('geojson', id, { data, style });
    }, [id, data, style]);

    return null;
};
