import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import MapContext from '../context/MapContext';
import { LEAFLET_HTML_CONTENT } from '../templates/LeafletHTML';
import { isEqual } from '../utils/deepEqual';
import { MapContainerProps, MapViewEvents, MapMessage, LatLng } from '../types';


export interface MapContainerHandles {
    fitBounds: (options?: any) => void;
    centerToUserPosition: (position: LatLng) => void;
    isUserPositionCentered: (position: LatLng) => boolean;
}

export const MapContainer = React.forwardRef<MapContainerHandles, MapContainerProps>(({
    center,
    zoom = 13,
    isDark = false,
    backgroundColor = '#ffffff',
    dragEnabled = true,
    zoomEnabled = true,
    fitBounds = false,
    style,
    children,
    onMapReady,
    onMapClick,
    onMarkerClick,
    onUserGesture,
    onMoveEnd,
}, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [isReady, setIsReady] = useState(false);
    const [mapCenter, setMapCenter] = useState<LatLng | null>(center || null);

    const sendMessage = useCallback((payload: any) => {
        webViewRef.current?.injectJavaScript(
            `window.postMessage(${JSON.stringify(payload)}, '*');`
        );
    }, []);

    React.useImperativeHandle(ref, () => ({
        fitBounds: (options) => {
            sendMessage({ type: 'fitBounds', options });
        },
        centerToUserPosition: (pos) => {
            sendMessage({ type: 'center', position: pos });
        },
        isUserPositionCentered: (pos) => {
            if (!mapCenter) return false;
            return isEqual(mapCenter, pos);
        }
    }));

    const handleMessage = (event: any) => {
        try {
            const data: MapMessage = JSON.parse(event.nativeEvent.data);
            switch (data.event) {
                case MapViewEvents.MAP_READY:
                    setIsReady(true);
                    sendMessage({ type: 'init', center, zoom, isDark, background: backgroundColor, fitBounds });
                    onMapReady?.();
                    break;
                case MapViewEvents.ON_MOVE_END:
                    setMapCenter(data.payload.mapCenterPosition);
                    onMoveEnd?.(data.payload.mapCenterPosition, data.payload.zoom, data.payload.bounds);
                    break;
                case MapViewEvents.ON_MAP_CLICK:
                    onMapClick?.(data.payload.latlng);
                    break;
                case MapViewEvents.ON_MARKER_CLICK:
                    onMarkerClick?.(data.payload.id);
                    break;
                case MapViewEvents.ON_USER_GESTURE:
                    onUserGesture?.();
                    break;
            }
        } catch (e) {
            console.error('Error parsing map message:', e);
        }
    };

    const registerLayer = (type: string, id: string, props: any) => {
        sendMessage({ type, id, ...props });
    };

    const unregisterLayer = (type: string, id: string) => {
        sendMessage({ type: `remove_${type}`, id });
    };

    const updateLayer = (type: string, id: string, props: any) => {
        sendMessage({ type, id, ...props });
    };

    // Sync props that can change
    React.useEffect(() => {
        if (isReady) {
            sendMessage({ type: 'theme', isDark, background: backgroundColor });
            sendMessage({ type: 'fit_bounds_toggle', enabled: fitBounds });
        }
    }, [isDark, backgroundColor, fitBounds, isReady]);

    return (
        <MapContext.Provider value={{ registerLayer, unregisterLayer, updateLayer, sendMessage }}>
            <View style={[styles.container, style]}>
                <WebView
                    ref={webViewRef}
                    source={{ html: LEAFLET_HTML_CONTENT }}
                    style={[styles.webview, { backgroundColor: backgroundColor || 'transparent' }]}
                    containerStyle={{ backgroundColor: backgroundColor || 'transparent' }}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    mixedContentMode="always"
                    originWhitelist={['*']}
                    bounces={false}
                    scrollEnabled={false}
                    overScrollMode="never"
                />
                {isReady && children}
            </View>
        </MapContext.Provider>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});
