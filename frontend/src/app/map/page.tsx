"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


// Ulaanbaatar bounding box
const UB_BOUNDS: [[number, number], [number, number]] = [
  [47.75, 106.7], // SW
  [48.05, 107.2], // NE
];


export default function UBMap() {
  return (<div className="flex justify-center items-center">
    <MapContainer
      center={[47.918, 106.917]} // center of UB
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
      maxBounds={UB_BOUNDS}
      minZoom={13}
      maxZoom={18}
      style={{ height: "800px", width: "80%" }}
    >
      <TileLayer
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>


      {/* Example marker */}
      <Marker position={[47.918, 106.917]} >
  <Popup>Макс нохой</Popup>
</Marker>
    </MapContainer></div>
  );
}
