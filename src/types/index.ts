import { ReactNode } from 'react';

export type LatLng = {
    lat: number;
    lng: number;
    altitude?: number;
};

export type LatLngBounds = {
    southWest: LatLng;
    northEast: LatLng;
};

export interface UserLocationStyle {
    markerSize?: number;
    showPulse?: boolean;
    pulseMaxScale?: number;
    pulseDuration?: string;
    showDirectionCone?: boolean;
    coneWidth?: number;
    coneHeight?: number;
    coneOpacity?: number;
}

export interface MapContainerProps {
    center?: LatLng;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    isDark?: boolean;
    backgroundColor?: string;
    dragEnabled?: boolean;
    zoomEnabled?: boolean;
    fitBounds?: boolean;
    style?: any;
    children?: ReactNode;
    onMapReady?: () => void;
    onMapClick?: (latlng: LatLng) => void;
    onMarkerClick?: (id: string) => void;
    onUserGesture?: () => void;
    onMoveEnd?: (center: LatLng, zoom: number, bounds: LatLngBounds) => void;
    isUserInteracting?: (isInteracting: boolean) => void;
}

export interface TileLayerProps {
    url?: string;
    attribution?: string;
    id?: string;
}

export interface MarkerProps {
    id: string;
    position: LatLng;
    icon?: string;
    size?: [number, number];
    anchor?: [number, number];
    title?: string;
    children?: ReactNode; // For Popups
    onPress?: (id: string) => void;
}

export interface PolylineProps {
    id: string;
    positions: LatLng[];
    color?: string;
    weight?: number;
    opacity?: number;
    dashArray?: string;
    isAnimated?: boolean;
    pulseColor?: string;
    dashSpeed?: number;
}

export interface CircleProps {
    id: string;
    center: LatLng;
    radius: number;
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
}

export interface PolygonProps {
    id: string;
    positions: LatLng[];
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
}

export interface GeoJSONProps {
    id: string;
    data: any;
    style?: any;
    onPress?: (feature: any) => void;
}

export interface MarkerClusterProps {
    children: ReactNode;
    options?: {
        showCoverageOnHover?: boolean;
        zoomToBoundsOnClick?: boolean;
        spiderfyOnMaxZoom?: boolean;
        maxClusterRadius?: number;
    };
}

export interface HeatmapProps {
    id: string;
    points: Array<{ lat: number; lng: number; intensity: number }>;
    radius?: number;
    blur?: number;
    max?: number;
}

export interface UserMarkerProps {
    position: LatLng;
    heading?: number;
    accuracy?: number;
    markerColor?: string;
    accuracyCircleColor?: string;
    style?: UserLocationStyle;
    title?: string;
}

export interface PopupStyle {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
    fontWeight?: string | number;
    maxWidth?: number;
    minWidth?: number;
    closeButtonColor?: string;
}

export interface PopupProps {
    children?: ReactNode;
    content?: string; // HTML content
    style?: PopupStyle;
    autoPan?: boolean;
    offset?: [number, number];
}

export enum MapViewEvents {
    MAP_READY = 'MAP_READY',
    ON_MOVE_END = 'ON_MOVE_END',
    ON_DRAG_START = 'ON_DRAG_START',
    ON_DRAG_END = 'ON_DRAG_END',
    ON_MARKER_CLICK = 'ON_MARKER_CLICK',
    ON_MAP_CLICK = 'ON_MAP_CLICK',
    ON_MAP_ERROR = 'ON_MAP_ERROR',
    ON_USER_GESTURE = 'ON_USER_GESTURE',
    ON_TILE_ERROR = 'ON_TILE_ERROR',
    NETWORK_OFFLINE = 'NETWORK_OFFLINE',
    NETWORK_ONLINE = 'NETWORK_ONLINE'
}

export interface MapMessage {
    event: MapViewEvents | string;
    payload?: any;
    error?: string;
    msg?: string;
}
