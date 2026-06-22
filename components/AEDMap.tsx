"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  latitude: number;
  longitude: number;
  oeds: any[];
  nearestOed: any;
};

export default function AEDMap({
  latitude,
  longitude,
  oeds,
  nearestOed,
}: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={17}
      style={{ height: "650px", width: "100%" }}
    >
      <TileLayer
        attribution={"© OpenStreetMap contributors"}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Kullanıcı */}
      <Marker position={[latitude, longitude]} icon={blueIcon}>
        <Popup>📍 Sen Buradasın</Popup>
      </Marker>

      {oeds.map((oed) => {
        const isNearest = nearestOed?.id === oed.id;

        return (
          <Marker
            key={oed.id}
            position={[oed.lat, oed.lng]}
            icon={isNearest ? greenIcon : redIcon}
          >
            <Popup>
              <div>
                <h3>{oed.name}</h3>
                <p>{oed.district}</p>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/${latitude},${longitude}/${oed.lat},${oed.lng}`}
                >
                  🧭 Yol Tarifi Al
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}