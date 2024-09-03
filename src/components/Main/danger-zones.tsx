import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../../styles/leafletCluster.css";
import axios from "axios";

interface DangerZone {
  city: string;
  lat: number;
  lng: number;
  riskValue: number;
}

const DangerZones = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [dangerData, setDangerData] = useState<DangerZone[]>([]);

  const getColor = (danger: number): string => {
    if (danger <= 2) {
      return "green";
    } else if (danger <= 4) {
      return "yellow";
    } else {
      return "red";
    }
  };

  useEffect(() => {
    const fetchDangerData = async () => {
      try {
        const response = await axios.get("/api/danger-zones");
        console.log("Danger Data:", response.data);
        setDangerData(response.data);
      } catch (error) {
        console.error("Error fetching danger data:", error);
      }
    };

    fetchDangerData();
  }, []);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const L = await import("leaflet");
        require("leaflet.markercluster");

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = L.map("map", {
          center: [32.2833322, -9.2333324],
          zoom: 6,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
        }).addTo(map);

        if (dangerData.length) {
          const markers = L.markerClusterGroup({
            iconCreateFunction: (cluster) => {
              const markers = cluster.getAllChildMarkers();
              let totalRiskValue = 0;
              let validMarkersCount = 0;

              markers.forEach((marker) => {
                const riskValue = (marker.options as any).danger;
                if (!isNaN(riskValue)) {
                  totalRiskValue += riskValue;
                  validMarkersCount++;
                }
              });

              const riskValueAverage =
                validMarkersCount > 0
                  ? (totalRiskValue / validMarkersCount).toFixed(2)
                  : "0.00";
              console.log(riskValueAverage)
              return L.divIcon({
                
                html: `<div class="custom-cluster-icon">${riskValueAverage}</div>`,
                className: "",
                iconSize: L.point(40, 40),
              });
            },
          });

          dangerData.forEach((zone) => {
            if (zone.lat !== undefined && zone.lng !== undefined) {
              const marker = L.circleMarker([zone.lat, zone.lng], {
                color: "white",
                fillColor: getColor(zone.riskValue),
                fillOpacity: 0.7,
                radius: 20,
                danger: zone.riskValue,
              }).bindPopup(
                `<strong>${zone.city}</strong><br>Danger Level: ${zone.riskValue}`
              );

              markers.addLayer(marker);
            }
          });
          map.addLayer(markers);
        }

        mapRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();
  }, [dangerData]);

  return (
    <div className="card">
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(DangerZones), { ssr: false });
