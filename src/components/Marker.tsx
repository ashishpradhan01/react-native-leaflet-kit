import React, { useEffect, useState, createContext, useContext } from 'react';
import { useMap } from '../context/MapContext';
import { MarkerProps, PopupProps } from '../types';

const MarkerContext = createContext<{
    setPopupOptions: (options: Partial<PopupProps>) => void
} | null>(null);

export const useMarker = () => useContext(MarkerContext);

export const Marker: React.FC<MarkerProps> = ({ id, position, icon, size, anchor, title, children }) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();
    const [popupOptions, setPopupOptions] = useState<Partial<PopupProps>>({});

    useEffect(() => {
        registerLayer('marker', id, { position, icon, size, anchor, title, ...popupOptions });
        return () => unregisterLayer('marker', id);
    }, []);

    useEffect(() => {
        updateLayer('marker', id, { position, icon, size, anchor, title, ...popupOptions });
    }, [position.lat, position.lng, icon, size, anchor, title, JSON.stringify(popupOptions)]);

    const contextValue = React.useMemo(() => ({ setPopupOptions }), [setPopupOptions]);

    return (
        <MarkerContext.Provider value={contextValue}>
            {children}
        </MarkerContext.Provider>
    );
};
