import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

const Map = ({ zoom = 10, mapHeight = 400, positions }) => {

  const createCustomIcon = (iconUrl) => new L.Icon({
    iconUrl,
    iconSize: [30, 30],
  });

  const center = [positions[0].latitude, positions[0].longitude];

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
                icon={createCustomIcon(position.icon)}
            >
              <Popup>
                <b>{position.name}</b><br />
                <em>{position.fulladdress}</em><br />
                {position.category}<br />
              </Popup>
            </Marker>
        ))}
      </MapContainer>
  );
};

export default Map;
