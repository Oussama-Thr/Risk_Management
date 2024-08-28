import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../../styles/leafletCluster.css'

// Dynamically import leaflet with no SSR (Server-Side Rendering)
const NoSSRLeaflet = dynamic(() => import('leaflet'), {
  ssr: false,
});

const DangerZones = () => {
  const mapRef = useRef<L.Map | null>(null);

  const getColor = (danger: number): string => {
    if (danger <= 2) {
      return 'green';
    } else if (danger <= 4) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  useEffect(() => {
    // Ensure Leaflet and marker cluster are available and only run on the client-side
    const L = require('leaflet');
    const MarkerClusterGroup = require('leaflet.markercluster');

    // Initialize the map
    const map = L.map('map', {
      center: [32.2833322, -9.2333324],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    const markers = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const markers = cluster.getAllChildMarkers();
        const totalDanger = markers.reduce((acc, marker) => acc + marker.options.danger, 0);
        const avgDanger = totalDanger / markers.length;

        const color = getColor(avgDanger);

        return L.divIcon({
          html: `<div class="cluster-icon" style="background-color:${color};">${Math.round(avgDanger)}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40, true),
        });
      },
    });

    const geojsonData = [
      // Example data
      { lat: 32.285, lng: -9.235, radius: 200, danger: 1 },
      { lat: 32.280, lng: -9.230, radius: 300, danger: 3 },
      { lat: 32.275, lng: -9.225, radius: 500, danger: 5 },
    ];

    geojsonData.forEach((zone) => {
      const marker = L.circleMarker([zone.lat, zone.lng], {
        color: 'white',
        fillColor: getColor(zone.danger),
        fillOpacity: 0.7,
        radius: zone.radius,
        danger: zone.danger,  // Custom property to hold danger value
      });
      markers.addLayer(marker);
    });

    map.addLayer(markers);
    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div className="card">
      <div id="map" style={{ height: '600px' }}></div>
    </div>
  );
};

export default DangerZones;
