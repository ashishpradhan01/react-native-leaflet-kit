import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { MarkerClusterProps } from '../types';

export const MarkerCluster: React.FC<MarkerClusterProps> = ({ children, options }) => {
    const { registerLayer, unregisterLayer } = useMap();
    const clusterId = 'global-cluster'; // Currently support one group for simplicity

    useEffect(() => {
        registerLayer('cluster', clusterId, { enabled: true, options });
        return () => {
            unregisterLayer('cluster', clusterId);
        };
    }, []);

    return <>{children}</>;
};
