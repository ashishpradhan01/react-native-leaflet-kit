export const LEAFLET_HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Leaflet Map</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css" />
    <style>
        :root {
            --theme-bg: #ffffff;
            --theme-color: #333333;
        }
        
        #map.dark-mode-tiles {
            --theme-bg: #1a1a1a;
            --theme-color: #ffffff;
        }
        
        body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif; 
            background-color: var(--theme-bg);
        }
        
        #map { 
            height: 100vh; 
            width: 100vw; 
            background-color: var(--theme-bg);
        }
        
        .leaflet-container {
            background: none !important;
            outline: 0;
        }
        
        .dark-mode-tiles .leaflet-tile-pane {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        
        .custom-div-icon { background: none; border: none; }
        .pulse-marker {
            width: var(--user-marker-size, 12px); 
            height: var(--user-marker-size, 12px);
            border-radius: 50%;
            background: var(--user-marker-color, #1169C2); 
            border: 3px solid white;
            box-shadow: 0 0 8px var(--user-marker-shadow, rgba(66, 133, 244, 0.7));
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: calc(var(--user-marker-size, 12px) / -2 - 3px);
            margin-left: calc(var(--user-marker-size, 12px) / -2 - 3px);
            z-index: 2;
            display: var(--pulse-display, block);
        }
        .pulse-marker::before {
            content: ''; 
            position: absolute;
            top: 0;
            left: 0;
            width: 100%; 
            height: 100%;
            border-radius: 50%; 
            background: var(--user-marker-color, #1169C2);
            animation: pulse var(--user-marker-pulse-duration, 2.5s) ease-out infinite;
            pointer-events: none;
            display: var(--pulse-animation-display, block);
        }                            
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.7; }
            50% { opacity: 0.4; }
            100% { transform: scale(var(--user-marker-pulse-max-scale, 2.5)); opacity: 0; }
        }
        .accuracy-circle { 
            stroke: var(--user-marker-color, #1169C2); 
            stroke-width: 2; 
            fill: var(--accuracy-circle-color, rgba(66, 133, 244, 0.1)); 
        }
        .direction-cone {
            position: absolute;
            width: var(--direction-cone-width, 60px);
            height: var(--direction-cone-height, 50px);
            left: 50%;
            top: 50%;
            margin-left: calc(var(--direction-cone-width, 60px) / -2);
            margin-top: calc(var(--direction-cone-height, 50px) * -1);
            transform-origin: center bottom;
            background: linear-gradient(to top, var(--direction-cone-color, rgba(66, 133, 244, 0.6)), transparent);
            clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 1;
            display: var(--direction-cone-display, block);
        }
        .leaflet-control-zoom { visibility: hidden; }

        @keyframes flow {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
        }
        .animated-polyline {
            stroke-dasharray: 10, 10;
            animation: flow 1s linear infinite;
        }

        .custom-popup .leaflet-popup-content-wrapper {
            background: var(--theme-bg);
            color: var(--theme-color);
            border-radius: 12px;
            padding: 0;
            box-shadow: 0 3px 14px rgba(0,0,0,0.4);
        }
        .custom-popup .leaflet-popup-content {
            margin: 12px;
            line-height: 1.4;
        }
        .custom-popup .leaflet-popup-tip {
            background: var(--theme-bg);
        }
        .custom-popup .leaflet-popup-close-button {
            top: 10px !important;
            right: 12px !important;
            font-size: 20px !important;
            font-weight: normal;
            color: var(--theme-color);
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
    <script>
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="#f4f4f4"/><g transform="translate(100, 100) scale(0.30)"><path d="M0 16 L40 0 L88 16 L128 0 L128 112 L88 128 L40 112 L0 128 Z" fill="none" stroke="#888" stroke-width="3"/><line x1="40" y1="0" x2="40" y2="112" stroke="#888" stroke-width="3"/><line x1="88" y1="16" x2="88" y2="128" stroke="#888" stroke-width="3"/></g><text x="47%" y="60%" text-anchor="middle" font-size="9" fill="#888" font-family="system-ui, -apple-system, BlinkMacSystemFont">Offline</text></svg>';
        const OFFLINE_TILE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);

        let map, bounds = null, isReady = false, dragEnabled = true, zoomEnabled = true, isAutoFitEnabled = false, hasInitialFitPerformed = false, fitTimeout = null;
        const markers = new Map(), polylines = new Map(), layers = new Map(), circles = new Map(), polygons = new Map();
        const geojsonLayers = new Map(), heatmaps = new Map();
        let markerClusterGroup = null;
        let ownPositionMarker = null, accuracyCircle = null, directionCone = null, currentHeadingValue = 0;

        const sendMessage = (message) => {
            const msgStr = JSON.stringify(message);
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msgStr);
        };

        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        };

        const createIcon = (iconData, size = [32, 32]) => {
            if (!iconData) return null;
            if (typeof iconData === 'string' && (iconData.startsWith('http') || iconData.includes('.'))) {
                return L.icon({ iconUrl: iconData, iconSize: size, iconAnchor: [size[0]/2, size[1]], popupAnchor: [0, -size[1]] });
            }
            return L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="font-size:' + Math.round(size[0]/2) + 'px;text-align:center;line-height:' + size[1] + 'px">' + iconData + '</div>',
                iconSize: size, iconAnchor: [Math.round(size[0]/2), Math.round(size[1]/2)]
            });
        };

        const addPopupStyle = (data) => {
            const styleId = 'style-popup-' + data.id;
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            
            const s = data.style || {};
            styleEl.textContent = 
                '.custom-popup-' + data.id + ' .leaflet-popup-content-wrapper {' +
                (s.backgroundColor ? 'background: ' + s.backgroundColor + ' !important;' : '') +
                (s.textColor ? 'color: ' + s.textColor + ' !important;' : '') +
                (s.borderRadius !== undefined ? 'border-radius: ' + s.borderRadius + 'px !important;' : '') +
                '}' +
                '.custom-popup-' + data.id + ' .leaflet-popup-content {' +
                (s.padding !== undefined ? 'padding: ' + s.padding + 'px !important;' : '') +
                (s.fontSize !== undefined ? 'font-size: ' + s.fontSize + 'px !important;' : '') +
                (s.fontWeight !== undefined ? 'font-weight: ' + s.fontWeight + ' !important;' : '') +
                '}' +
                '.custom-popup-' + data.id + ' .leaflet-popup-tip {' +
                (s.backgroundColor ? 'background: ' + s.backgroundColor + ' !important;' : '') +
                '}' +
                '.custom-popup-' + data.id + ' .leaflet-popup-close-button {' +
                (s.closeButtonColor ? 'color: ' + s.closeButtonColor + ' !important;' : '') +
                '}';
        };

        const updateMarkers = (markerData) => {
            if (!markers.has(markerData.id)) {
                const icon = markerData.icon ? createIcon(markerData.icon, markerData.size) : null;
                const marker = icon ? L.marker(markerData.position, { icon }) : L.marker(markerData.position);
                if (markerData.title || markerData.content) {
                    const popupOptions = {
                        className: 'custom-popup custom-popup-' + markerData.id,
                        maxWidth: (markerData.style && markerData.style.maxWidth) || 300,
                        minWidth: (markerData.style && markerData.style.minWidth) || 50,
                        offset: markerData.offset || [0, 7],
                        autoPan: markerData.autoPan !== undefined ? markerData.autoPan : true
                    };
                    marker.bindPopup(markerData.content || markerData.title, popupOptions);
                    addPopupStyle(markerData);
                }
                marker.on('click', () => sendMessage({ event: 'ON_MARKER_CLICK', payload: { id: markerData.id } }));
                
                if (markerClusterGroup) {
                    markerClusterGroup.addLayer(marker);
                } else {
                    marker.addTo(map);
                }
                markers.set(markerData.id, marker);
            } else {
                const marker = markers.get(markerData.id);
                marker.setLatLng(markerData.position);
                if (markerData.content || markerData.title) {
                    marker.setPopupContent(markerData.content || markerData.title);
                    addPopupStyle(markerData);
                }
            }
            updateBounds();
        };

        const updatePolylines = (data) => {
            const options = { 
                color: data.color || '#3388ff', 
                weight: data.weight || 3, 
                opacity: data.opacity || 1, 
                dashArray: data.dashArray,
                className: data.isAnimated ? 'animated-polyline' : ''
            };
            
            if (!polylines.has(data.id)) {
                const poly = L.polyline(data.positions, options).addTo(map);
                polylines.set(data.id, poly);
            } else {
                const poly = polylines.get(data.id);
                poly.setLatLngs(data.positions);
                poly.setStyle(options);
            }
            updateBounds();
        };

        const updateCircles = (data) => {
            const options = {
                color: data.color || '#3388ff',
                fillColor: data.fillColor || data.color || '#3388ff',
                fillOpacity: data.fillOpacity || 0.2,
                weight: data.weight || 2
            };
            if (!circles.has(data.id)) {
                const circle = L.circle(data.center, { radius: data.radius, ...options }).addTo(map);
                circles.set(data.id, circle);
            } else {
                const circle = circles.get(data.id);
                circle.setLatLng(data.center);
                circle.setRadius(data.radius);
                circle.setStyle(options);
            }
            updateBounds();
        };

        const updatePolygons = (data) => {
            const options = {
                color: data.color || '#3388ff',
                fillColor: data.fillColor || data.color || '#3388ff',
                fillOpacity: data.fillOpacity || 0.2,
                weight: data.weight || 2
            };
            if (!polygons.has(data.id)) {
                const polygon = L.polygon(data.positions, options).addTo(map);
                polygons.set(data.id, polygon);
            } else {
                const polygon = polygons.get(data.id);
                polygon.setLatLngs(data.positions);
                polygon.setStyle(options);
            }
            updateBounds();
        };

        const updateGeoJSON = (data) => {
            if (geojsonLayers.has(data.id)) {
                map.removeLayer(geojsonLayers.get(data.id));
            }
            const layer = L.geoJSON(data.data, {
                style: data.style,
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        sendMessage({ event: 'ON_GEOJSON_CLICK', payload: { id: data.id, feature } });
                    });
                }
            }).addTo(map);
            geojsonLayers.set(data.id, layer);
            updateBounds();
        };

        const updateHeatmap = (data) => {
            if (heatmaps.has(data.id)) {
                map.removeLayer(heatmaps.get(data.id));
            }
            const heatPoints = data.points.map(p => [p.lat, p.lng, p.intensity]);
            const layer = L.heatLayer(heatPoints, {
                radius: data.radius || 25,
                blur: data.blur || 15,
                max: data.max || 1.0
            }).addTo(map);
            heatmaps.set(data.id, layer);
        };

        const toggleCluster = (enabled, options = {}) => {
            if (enabled && !markerClusterGroup) {
                markerClusterGroup = L.markerClusterGroup(options);
                markers.forEach(m => {
                    map.removeLayer(m);
                    markerClusterGroup.addLayer(m);
                });
                map.addLayer(markerClusterGroup);
            } else if (!enabled && markerClusterGroup) {
                map.removeLayer(markerClusterGroup);
                markers.forEach(m => m.addTo(map));
                markerClusterGroup = null;
            }
        };

        const updateOwnPositionMarker = (markerData) => {
            if (!markerData || !markerData.position) {
                if (ownPositionMarker) { map.removeLayer(ownPositionMarker); ownPositionMarker = null; }
                if (accuracyCircle) { map.removeLayer(accuracyCircle); accuracyCircle = null; }
                if (directionCone) { map.removeLayer(directionCone); directionCone = null; }
                return;
            }
            const { lat, lng } = markerData.position;
            const markerColor = markerData.markerColor || '#1169C2';
            const style = markerData.style || {};
            const root = document.documentElement;
            
            root.style.setProperty('--user-marker-size', (style.markerSize || 12) + 'px');
            root.style.setProperty('--user-marker-color', markerColor);
            root.style.setProperty('--user-marker-shadow', hexToRgba(markerColor, 0.5));
            root.style.setProperty('--accuracy-circle-color', hexToRgba(markerData.accuracyCircleColor || markerColor, 0.1));
            
            root.style.setProperty('--pulse-display', (style.showPulse !== false) ? 'block' : 'none');
            root.style.setProperty('--user-marker-pulse-max-scale', style.pulseMaxScale || 2.5);
            root.style.setProperty('--user-marker-pulse-duration', style.pulseDuration || '2.5s');
            
            root.style.setProperty('--direction-cone-display', (style.showDirectionCone !== false) ? 'block' : 'none');
            root.style.setProperty('--direction-cone-width', (style.coneWidth || 60) + 'px');
            root.style.setProperty('--direction-cone-height', (style.coneHeight || 50) + 'px');

            const newLatLng = L.latLng(lat, lng);
            if (!ownPositionMarker) {
                ownPositionMarker = L.marker(newLatLng, { icon: L.divIcon({ className: 'custom-div-icon', html: '<div class="pulse-marker"></div>', iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(map);
            } else if (!ownPositionMarker.getLatLng().equals(newLatLng, 0.00001)) {
                animateMarker(ownPositionMarker, ownPositionMarker.getLatLng(), newLatLng, 1000);
            }

            if (markerData.accuracy > 0) {
                if (!accuracyCircle) accuracyCircle = L.circle(newLatLng, { radius: markerData.accuracy, className: 'accuracy-circle', fillOpacity: 0.1, weight: 2 }).addTo(map);
                else { accuracyCircle.setLatLng(newLatLng); accuracyCircle.setRadius(markerData.accuracy); }
            }

            if (markerData.heading !== undefined && markerData.heading !== null) {
                if (!directionCone) directionCone = L.marker(newLatLng, { icon: L.divIcon({ className: 'custom-div-icon', html: '<div class="direction-cone"></div>', iconSize: [30, 30], iconAnchor: [15, 15] }), zIndexOffset: -100 }).addTo(map);
                else directionCone.setLatLng(newLatLng);
                
                const coneDiv = directionCone.getElement()?.querySelector('.direction-cone');
                if (coneDiv) {
                    let diff = (markerData.heading - (currentHeadingValue % 360));
                    if (diff > 180) diff -= 360; else if (diff < -180) diff += 360;
                    currentHeadingValue += diff;
                    coneDiv.style.transform = 'rotate(' + currentHeadingValue + 'deg)';
                    document.documentElement.style.setProperty('--direction-cone-color', hexToRgba(markerColor, style.coneOpacity || 0.6));
                }
            } else if (directionCone) { map.removeLayer(directionCone); directionCone = null; }
            updateBounds();
        };

        const animateMarker = (marker, from, to, duration) => {
            const start = Date.now();
            const animate = () => {
                const progress = Math.min((Date.now() - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const cur = [from.lat + (to.lat - from.lat) * ease, from.lng + (to.lng - from.lng) * ease];
                marker.setLatLng(cur);
                if (accuracyCircle) accuracyCircle.setLatLng(cur);
                if (directionCone) directionCone.setLatLng(cur);
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        };

        window.addEventListener('message', (event) => {
            let data = event.data;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { return; }
            }
            if (!data) return;
            
            if (data.type === 'init') {
                if (data.center) map.setView(data.center, data.zoom || 13);
                if (data.isDark) document.getElementById('map').classList.add('dark-mode-tiles');
                if (data.fitBounds) isAutoFitEnabled = true;
            }
            if (data.type === 'fit_bounds_toggle') {
                isAutoFitEnabled = !!data.enabled;
                if (isAutoFitEnabled) hasInitialFitPerformed = false; // Reset to allow re-fit
            }
            if (data.type === 'marker') updateMarkers(data);
            if (data.type === 'remove_marker') { 
                if (markers.has(data.id)) { 
                    map.removeLayer(markers.get(data.id)); 
                    markers.delete(data.id);
                    const styleEl = document.getElementById('style-popup-' + data.id);
                    if (styleEl) styleEl.remove();
                } 
            }
            if (data.type === 'polyline') updatePolylines(data);
            if (data.type === 'remove_polyline') { if (polylines.has(data.id)) { map.removeLayer(polylines.get(data.id)); polylines.delete(data.id); } }
            if (data.type === 'circle') updateCircles(data);
            if (data.type === 'remove_circle') { if (circles.has(data.id)) { map.removeLayer(circles.get(data.id)); circles.delete(data.id); } }
            if (data.type === 'polygon') updatePolygons(data);
            if (data.type === 'remove_polygon') { if (polygons.has(data.id)) { map.removeLayer(polygons.get(data.id)); polygons.delete(data.id); } }
            if (data.type === 'geojson') updateGeoJSON(data);
            if (data.type === 'remove_geojson') { if (geojsonLayers.has(data.id)) { map.removeLayer(geojsonLayers.get(data.id)); geojsonLayers.delete(data.id); } }
            if (data.type === 'heatmap') updateHeatmap(data);
            if (data.type === 'remove_heatmap') { if (heatmaps.has(data.id)) { map.removeLayer(heatmaps.get(data.id)); heatmaps.delete(data.id); } }
            if (data.type === 'cluster') toggleCluster(data.enabled, data.options);
            if (data.type === 'userMarker') updateOwnPositionMarker(data);
            if (data.type === 'center') {
                isAutoFitEnabled = false; // Disable auto-fit if specifically centering
                map.setView(data.position, data.zoom || map.getZoom());
            }
            if (data.type === 'tile') {
                if (layers.has(data.id)) map.removeLayer(layers.get(data.id));
                const layer = L.tileLayer(data.url, { attribution: data.attribution }).addTo(map);
                layers.set(data.id, layer);
            }
            if (data.type === 'theme') {
                document.documentElement.style.setProperty('--theme-bg', data.background);
                if (data.isDark) document.getElementById('map').classList.add('dark-mode-tiles');
                else document.getElementById('map').classList.remove('dark-mode-tiles');
            }
            if (data.type === 'fitBounds') {
                const options = data.options || { padding: [50, 50], maxZoom: 15 };
                if (bounds && bounds.isValid()) map.fitBounds(bounds, options);
            }
        });

        const updateBounds = () => {
            const routeBounds = L.latLngBounds();
            let hasRouteData = false;
            
            // Collect Route Elements (Markers, Polylines, etc.)
            markers.forEach(m => { routeBounds.extend(m.getLatLng()); hasRouteData = true; });
            polylines.forEach(p => { routeBounds.extend(p.getBounds()); hasRouteData = true; });
            geojsonLayers.forEach(g => { routeBounds.extend(g.getBounds()); hasRouteData = true; });
            circles.forEach(c => { routeBounds.extend(c.getBounds()); hasRouteData = true; });
            polygons.forEach(p => { routeBounds.extend(p.getBounds()); hasRouteData = true; });

            // Global bounds (used for manual fitBounds/Recenter, includes User)
            bounds = L.latLngBounds();
            if (hasRouteData) bounds.extend(routeBounds);
            if (ownPositionMarker) bounds.extend(ownPositionMarker.getLatLng());

            if (isAutoFitEnabled && !hasInitialFitPerformed) {
                if (fitTimeout) clearTimeout(fitTimeout);
                fitTimeout = setTimeout(() => {
                    if (hasRouteData && routeBounds.isValid()) {
                        // Priority 1: Focus on the Route context (Hero view)
                        map.fitBounds(routeBounds, { padding: [50, 50], maxZoom: 15 });
                        hasInitialFitPerformed = true;
                    } else if (ownPositionMarker) {
                        // Priority 2: Focus on User if no route markers are present
                        map.setView(ownPositionMarker.getLatLng(), 15);
                        hasInitialFitPerformed = true;
                    }
                }, 200); // Wait for all components to register through the bridge
            }
        };

        const initMap = () => {
            try {
                if (map) return;
                map = L.map('map', { center: [28.7041, 77.1025], zoom: 13, zoomControl: false });
                bounds = L.latLngBounds();
                map.on('moveend', () => {
                    const center = map.getCenter();
                    sendMessage({ event: 'ON_MOVE_END', payload: { mapCenterPosition: center, zoom: map.getZoom(), bounds: map.getBounds() } });
                });
                map.on('click', (e) => sendMessage({ event: 'ON_MAP_CLICK', payload: { latlng: e.latlng } }));
                
                // Gesture Detection
                const onUserInteraction = () => {
                    if (isAutoFitEnabled) {
                        isAutoFitEnabled = false;
                        sendMessage({ event: 'ON_USER_GESTURE' });
                    }
                };

                map.on('dragstart', onUserInteraction);
                map.on('zoomstart', onUserInteraction);
                map.on('touchstart', onUserInteraction);
                map.on('mousedown', onUserInteraction);

                isReady = true;
                // Tiny delay to ensure bridge is fully established
                setTimeout(() => {
                    sendMessage({ event: 'MAP_READY' });
                }, 100);
            } catch (err) {
                sendMessage({ event: 'ON_MAP_ERROR', msg: err.message });
            }
        };

        window.onerror = (msg, url, line) => {
            sendMessage({ event: 'ON_MAP_ERROR', msg: msg + ' at ' + line });
            return false;
        };

        document.addEventListener('DOMContentLoaded', initMap);
        setTimeout(initMap, 500); // Fallback if DOMContentLoaded already fired
    </script>
</body>
</html>`;
