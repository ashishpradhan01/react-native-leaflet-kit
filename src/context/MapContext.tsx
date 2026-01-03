import React, { createContext, useContext } from 'react';

interface MapContextValue {
    registerLayer: (type: 'marker' | 'polyline' | 'tile' | 'userMarker' | 'circle' | 'polygon' | 'geojson' | 'heatmap' | 'cluster', id: string, props: any) => void;
    unregisterLayer: (type: 'marker' | 'polyline' | 'tile' | 'userMarker' | 'circle' | 'polygon' | 'geojson' | 'heatmap' | 'cluster', id: string) => void;
    updateLayer: (type: 'marker' | 'polyline' | 'tile' | 'userMarker' | 'circle' | 'polygon' | 'geojson' | 'heatmap' | 'cluster', id: string, props: any) => void;
    sendMessage: (payload: any) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('Map components must be wrapped in <MapContainer />');
    }
    return context;
};

export default MapContext;
