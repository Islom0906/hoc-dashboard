import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

const calculateCenter = (positions) => {
    if (!positions || positions.length === 0) return [0, 0]; // Default center if no positions

    const totalPositions = positions.length;
    const avgLatitude =
        positions.reduce((sum, pos) => sum + (pos.latitude || 0), 0) / totalPositions;
    const avgLongitude =
        positions.reduce((sum, pos) => sum + (pos.longitude || 0), 0) / totalPositions;

    return [avgLatitude, avgLongitude];
};

const FitBounds = ({ positions }) => {
    const map = useMap();

    if (positions && positions.length > 0) {
        const bounds = L.latLngBounds(positions.map(pos => [pos.latitude, pos.longitude]));
        map.fitBounds(bounds);
    }

    return null;
};

const Map = ({ zoom = 10, mapHeight = 400, positions }) => {
    const center = calculateCenter(positions)||[0,0];
  const createCustomIcon = (iconUrl) => new L.Icon({
    iconUrl,
    iconSize: [30, 30],
  });

  return (
      <MapContainer style={{ height: mapHeight, width: '100%' }} center={center} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions?.map((position, index) => (
            <Marker
                key={index}
                position={[position.latitude, position.longitude]}
                icon={createCustomIcon(position.image)}
            >
              <Popup>
                <b>{position.title}</b><br />
                <em>{position.fulladdress}</em>
                  <br />
                  {position.category}<br />
              </Popup>
                <FitBounds positions={positions} />
            </Marker>
        ))}
      </MapContainer>
  );
};

export default Map;
