import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { TileLayerProps } from '../types';

export const TileLayer: React.FC<TileLayerProps> = ({
    url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution,
    id = 'default-tile'
}) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();

    useEffect(() => {
        registerLayer('tile', id, { url, attribution });
        return () => unregisterLayer('tile', id);
    }, []);

    useEffect(() => {
        updateLayer('tile', id, { url, attribution });
    }, [url, attribution]);

    return null;
};
