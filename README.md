# React Native Leaflet Kit 🗺️

A professional, pluggable, and declarative Map library for React Native built on top of Leaflet, WebView, and OpenStreetMap tiles. Designed with a Compound Component pattern for maximum flexibility and performance.

## ✨ Features

-   **Declarative API**: Build maps using clean, modular JSX components.
-   **Compound Component Pattern**: Easily compose layers, markers, and polylines.
-   **Surgical Updates**: Only modified elements are updated, preventing full map re-renders.
-   **Premium User Location**: Integrated high-performance user marker with direction cone and pulse animation.
-   **TypeScript Support**: Fully typed for a superior developer experience.
-   **Theming**: Seamless support for Light and Dark modes.

---

## 🚀 Installation

Install the library and its peer dependency:

```bash
npm install react-native-leaflet-kit react-native-webview
# or
yarn add react-native-leaflet-kit react-native-webview
```

---

## 🛠️ Quick Start

Wrap your map elements inside the `MapContainer` and add layers as needed.

```tsx
import { MapContainer, TileLayer, Marker, Polyline } from '@/components/map-library';

const MyMap = () => {
    return (
        <MapContainer 
            center={{ lat: 28.7041, lng: 77.1025 }} 
            zoom={13}
            isDark={true}
            fitBounds={true}
        >
            <TileLayer />
            
            <Marker 
                id="station-1"
                position={{ lat: 28.7041, lng: 77.1025 }}
                title="Delhi Station"
            />
        </MapContainer>
    );
};
```

### 🏎️ Using the Metride Wrapper
For the most streamlined experience, use the `MetrideMap` component which handles all boilerplate:

```tsx
import { MetrideMap } from '@/components/metro/MetrideMap';

<MetrideMap 
  markers={myStations}
  paths={myRouteLines}
  userMarker={currentUserLocation}
  fitBounds={true}
  isDark={true}
/>
```

---

---

## 🧩 Component Documentation

### 1. `<MapContainer />`
The primary wrapper that initializes the WebView and provides the Map Context.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `center` | `LatLng` | - | Initial center coordinates `{ lat, lng }`. |
| `zoom` | `number` | `13` | Initial zoom level. |
| `isDark` | `boolean` | `false` | Toggles dark mode tiles filter. |
| `backgroundColor` | `string` | `#ffffff` | WebView background color. |
| `fitBounds` | `boolean` | `false` | Enables automatic framing of the map content. |
| `onMapReady` | `() => void` | - | Called when the map is fully loaded. |
| `onUserGesture`| `() => void` | - | Called when the user manually pans or zooms (disables fitBounds). |
| `onMapClick` | `(pos: LatLng) => void` | - | Called when the map is tapped. |

**Example:**
```tsx
<MapContainer 
  ref={mapRef}
  center={{ lat: 28.6139, lng: 77.2090 }}
  onMapClick={(pos) => console.log('Tapped at:', pos)}
>
  {/* Children go here */}
</MapContainer>
```

---

### 2. `<TileLayer />`
Defines the source of the map tiles.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | `OSM Standard` | Standard Tile URL pattern. Defaults to OpenStreetMap. |
| `attribution` | `string` | - | Small text displayed at footer for credits. |

**Example (Default):**
```tsx
<TileLayer />
```

**Example (Custom Source):**
```tsx
<TileLayer 
  url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"
  attribution='&copy; Thunderforest'
/>
```

---

### 3. `<Marker />`
Adds a standard or custom icon marker to the map.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | - | Unique identifier for the marker. |
| `position` | `LatLng` | - | Coordinates for placement. |
| `title` | `string` | - | Text shown in a popup when tapped. |
| `icon` | `string` | - | Can be an Emoji, remote URL, or HTML string. |
| `size` | `[number, number]` | `[32, 32]` | Icon dimensions. |

**Example:**
```tsx
<Marker 
  id="main-pin"
  position={{ lat: 28.6139, lng: 77.2090 }}
  icon="⭐"
  title="New Delhi Capital"
  size={[40, 40]}
/>
```

---

### 4. `<Polyline />`
Draws paths or routes on the map.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | - | Unique identifier. |
| `positions` | `LatLng[]` | - | Array of coordinates defining the path. |
| `color` | `string` | `#3388ff` | Hex or RGBA color. |
| `weight` | `number` | `3` | Thickness of the line. |
| `opacity` | `number` | `1.0` | Transparency (0 to 1). |
| `dashArray` | `string` | - | CSS dash pattern (e.g. "5, 10"). |
| `isAnimated` | `boolean` | `false` | Enable a flowing route animation. |

**Regular Example:**
```tsx
<Polyline 
  id="route-1"
  positions={pathCoordinates}
  color="#e74c3c"
  weight={5}
/>
```

**Animated (Flowing) Example:**
```tsx
<Polyline 
  id="moving-route"
  positions={pathCoordinates}
  color="#2ecc71"
  isAnimated={true}
/>
```

---

### 5. `<UserMarker />`
A specialized premium component for real-time user positioning.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `position` | `LatLng` | Real-time coordinates. |
| `heading` | `number` | Heading in degrees (0 = North). |
| `accuracy` | `number` | Circular accuracy radius in meters. |
| `markerColor`| `string` | The primary theme color for the pulse and cone. |
| `style` | `UserLocationStyle` | Deep customization (see below). |

**Example:**
```tsx
<UserMarker 
  position={userPos}
  heading={90}
  accuracy={25}
  markerColor="#2ecc71"
  style={{
    markerSize: 15,
    showPulse: true,
    pulseMaxScale: 3,
    showDirectionCone: true,
    coneOpacity: 0.4
  }}
/>
```

---

### 6. `<Popup />`
Enables rich HTML content and professional styling inside a `Marker`. Must be a child of `<Marker />`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | - | (Optional) HTML string content. |
| `style` | `PopupStyle`| - | Nested object for visual styling (see below). |
| `autoPan` | `boolean` | `true` | Whether the map should pan to fit the popup. |
| `offset` | `[number, number]` | `[0, 7]` | Tip-to-anchor offset. |

#### `PopupStyle` Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `backgroundColor` | `string` | Popup background color. |
| `textColor` | `string` | Text color. |
| `borderRadius` | `number` | Corner roundness in pixels. |
| `padding` | `number` | Inner spacing in pixels. |
| `fontSize` | `number` | Text size in pixels. |
| `fontWeight` | `string/number`| Text weight. |
| `maxWidth` | `number` | Maximum width of the popup. |
| `closeButtonColor`| `string` | Color of the close 'X' button. |

**Example:**
```tsx
<Marker id="premium-shop" position={pos}>
  <Popup 
    style={{
      backgroundColor: "#2c3e50",
      textColor: "#ecf0f1",
      borderRadius: 8,
      padding: 12,
      fontSize: 14
    }}
    offset={[0, 10]}
  >
    <b>Metride Premium Hub</b><br/>
    Authorized Reseller
  </Popup>
</Marker>
```

---

### 7. `<Circle />`
Highlights a circular radius on the map.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID. |
| `center` | `LatLng` | Center of the circle. |
| `radius` | `number` | Radius in meters. |
| `color` | `string` | Border color. |
| `fillColor` | `string` | Fill color. |

**Example:**
```tsx
<Circle 
  id="danger-zone"
  center={{ lat: 28.7041, lng: 77.1025 }}
  radius={500}
  color="red"
  fillColor="rgba(255, 0, 0, 0.2)"
/>
```

---

### 8. `<Polygon />`
Defines a specific area or boundary.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID. |
| `positions` | `LatLng[]` | Array of coordinates defining the area. |
| `color` | `string` | Border color. |
| `fillColor` | `string` | Fill color. |

**Example:**
```

---

### 9. `<GeoJSON />`
The standard for complex spatial data. Renders entire datasets (lines, points, polygons) from a single JSON.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID. |
| `data` | `object` | The GeoJSON object/file content. |
| `style` | `object` | Styling function or object for the features. |

**Example:**
```tsx
<GeoJSON 
  id="metro-network"
  data={delhiMetroGeoJSON}
  style={{ color: '#ff7800', weight: 5, opacity: 0.65 }}
/>
```

---

### 10. `<MarkerCluster />`
Optimizes performance and readability by grouping nearby markers.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `options` | `object` | Leaflet.markercluster configuration. |
| `children` | `ReactNode` | The markers to be clustered. |

**Example:**
```tsx
<MarkerCluster options={{ maxClusterRadius: 80 }}>
  {stations.map(s => <Marker key={s.id} {...s} />)}
</MarkerCluster>
```

---

### 11. `<Heatmap />`
Visualizes data density (e.g., peak hour congestion).

| Prop | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID. |
| `points` | `LatlngIntensity[]` | Array of `{ lat, lng, intensity }`. |
| `radius` | `number` | Size of the heat points. |
| `blur` | `number` | Softness of the heat edges. |

**Example:**
```tsx
<Heatmap 
  id="congestion-map"
  points={trafficData}
  radius={30}
  blur={15}
/>
```

---

## 🎨 Professional Customization (UserLocationStyle)

| Property | Default | Description |
| :--- | :--- | :--- |
| `markerSize` | `12` | Inner dot size in pixels. |
| `showPulse` | `true` | Toggles the radiating pulse animation. |
| `pulseDuration` | `2.5s` | Speed of the pulse animation. |
| `pulseMaxScale` | `2.5` | How large the pulse expands. |
| `showDirectionCone`| `true` | Toggles the field-of-view cone. |
| `coneWidth` | `60` | Width of the direction cone. |
| `coneHeight` | `50` | Length of the direction cone. |

---

## 🎥 Camera & Interaction Model

Our map utilizes a professional state-driven camera system designed to balance automation with user control.

### 1. The Priority Priority Engine
When `fitBounds` is active, the map follows a context-aware hierarchy during initial load:
-   **Priority 1: The Route (Hero)** - If markers or paths exist, the map frames them perfectly while excluding the user (if distant) to keep the journey as the main focus.
-   **Priority 2: The User (Fallback)** - If the map is empty, it centers on the user at a comfortable street-level zoom (Level 15).

### 2. Gesture-Aware Automation
-   **Auto-Pause**: If a user performs a manual gesture (pan, zoom, pinch), the map **immediately disables** automatic camera movements to prevent "fighting" the user.
-   **Recenter Pattern**: Developers can use the `onUserGesture` callback to show a "Recenter" button. When clicked, setting `fitBounds={true}` will snap the camera back to the optimal view.

### 3. Debounced Handshake
To prevent "jitter" during data loading, the camera wait **200ms** after the first piece of data arrives before performing the initial fit. This ensures that all markers and polylines have registered through the bridge for a perfect single-frame fit.

---

## 📜 License
Internal Metride Architecture - Pluggable Library Concept.
