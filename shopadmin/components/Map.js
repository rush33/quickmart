import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const MapPicker = ({ setCoords }) => {
  const [position, setPosition] = useState([26.75974, 94.20964]); 

  const mapEvents = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return <Marker position={position} icon={markerIcon}></Marker>;
};

const MapPickerContainer = ({ setCoords }) => {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[26.75974, 94.20964]}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPicker setCoords={setCoords} />
      </MapContainer>
    </div>
  );
};

export default MapPickerContainer;
