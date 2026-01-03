import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { UserMarkerProps } from '../types';

export const UserMarker: React.FC<UserMarkerProps> = (props) => {
    const { registerLayer, unregisterLayer, updateLayer } = useMap();
    const id = 'USER_POSITION_MARKER';

    useEffect(() => {
        registerLayer('userMarker', id, props);
        return () => unregisterLayer('userMarker', id);
    }, []);

    useEffect(() => {
        updateLayer('userMarker', id, props);
    }, [props.position.lat, props.position.lng, props.heading, props.accuracy, props.markerColor, props.style]);

    return null;
};
