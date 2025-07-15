import React, { useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import turkiyeProvinces from "../assets/turkiye-provinces.json";
import "leaflet/dist/leaflet.css";

export default function MapPage() {
    const [selectedProvince, setSelectedProvince] = useState(null);

    function onEachProvince(feature, layer) {
        layer.on({
            click: () => setSelectedProvince(feature.properties.name),
        });
        layer.bindTooltip(feature.properties.name, { sticky: true });
    }

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Members Map</h1>
            <div
                style={{
                    height: "400px",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                <MapContainer
                    center={[39.0, 35.0]}
                    zoom={6}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    maxZoom={6}
                    minZoom={6}
                >
                    <GeoJSON data={turkiyeProvinces.features} onEachFeature={onEachProvince} />
                </MapContainer>
            </div>

            {selectedProvince && (
                <p style={{ marginTop: "1rem" }}>
                    Selected Province: <strong>{selectedProvince}</strong>
                </p>
            )}
        </div>
    );
}
