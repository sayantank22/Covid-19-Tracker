import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, LeafletConsumer } from 'react-leaflet';
import L, { Icon, circle, circleMarker, Circle } from 'leaflet';
import '../App.css';

export const icon = new Icon({
  iconUrl: '/skateboarding.svg',
  iconSize: [25, 25],
});

class LeafletMap extends Component {
  getColor = (lat, long) => {
    return L.circle([lat, long], {
      color: 'red',
      fillColor: 'f03',
      fillOpacity: 0.5,
      radius: 500,
    });
  };
  // const [activePark, setActivePark] = React.useState(null);
  render() {
    return (
      <Map center={[45.4, -75.7]} zoom={8}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[35.787449, -78.6438197]}
          //circle={this.getColor(35.787449, -78.6438197)}
        >
          <Circle></Circle>
          {/* <Popup>I am a green leaf</Popup> */}
        </Marker>
        {/*{parkData.features.map((park) => (
            <Marker
              key={park.properties.PARK_ID}
              position={[
                park.geometry.coordinates[1],
                park.geometry.coordinates[0],
              ]}
              onClick={() => {
                setActivePark(park);
              }}
              icon={icon}
            />
          ))}
    
          {activePark && (
            <Popup
              position={[
                activePark.geometry.coordinates[1],
                activePark.geometry.coordinates[0],
              ]}
              onClose={() => {
                setActivePark(null);
              }}>
              <div>
                <h2>{activePark.properties.NAME}</h2>
                <p>{activePark.properties.DESCRIPTIO}</p>
              </div>
            </Popup>
          )} */}
      </Map>
    );
  }
}

export default LeafletMap;
