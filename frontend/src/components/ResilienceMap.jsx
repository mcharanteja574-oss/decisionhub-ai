import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const colors = {
  low: "#34a853",
  medium: "#fbbc04",
  high: "#ff7a45",
  critical: "#ea4335",
};

function markerIcon(severity) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:${colors[severity]};border:3px solid white;box-shadow:0 0 22px ${colors[severity]};"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function ResilienceMap({ points = [] }) {
  const center = [12.985, 77.62];

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Interactive Map</h2>
        <span className="text-sm font-semibold text-cloud/65">{points.length} assets</span>
      </div>
      <div className="h-[390px] overflow-hidden rounded-lg">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point) => (
            <Marker key={point.id} position={[point.lat, point.lng]} icon={markerIcon(point.severity)}>
              <Popup>
                <strong>{point.name}</strong>
                <br />
                {point.type}
                <br />
                {point.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

