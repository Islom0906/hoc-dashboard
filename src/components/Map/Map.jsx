import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
const Map = ({zoom = 10 , mapHeight=400 , positions}) => {
  // function SetViewOnClick({ coords }) {
  //   const map = useMap();
  //   map.setView(coords, map.getZoom());
  //
  //   return null;
  // }

const center = [positions[0].latitude , positions[0].latitude]

  return (
                    <MapContainer  style={{height:mapHeight,width:'100%'}} center={center} zoom={zoom} scrollWheelZoom={true}>
                      <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {
                        positions?.map((position , index) => (
                            <Marker
                                key={index}
                                position={[position?.latitude, position?.longitude]}
                                icon={position?.icon}
                            >
                              <Popup>
                                <b>{position?.name}</b><br />
                                <em>{position?.fulladdress}</em><br />
                                Category: {position?.category}<br />
                              </Popup>
                            </Marker>
                        ))

                      }
                    </MapContainer>
  );
};

export default Map;