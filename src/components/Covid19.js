import React, { Component } from 'react';
// import '../../node_modules/leaflet/dist/leaflet.css';
import axios from 'axios';
import cors from 'cors';
// import 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js';
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {
  Map,
  Marker,
  Cluster,
  Layer,
  Feature,
} from 'react-mapbox-gl';
// import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// import ReactMapboxGl, {
//   Layer,
//   Feature,
//   Marker,
//   Cluster,
//   GeoJSONLayer,
// } from 'react-mapbox-gl';

// class Covid19 extends Component {
//   componentDidMount() {
//     const mapbox_token =
//       'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA';

//     mapboxgl.accessToken = mapbox_token;

//     var map = new mapboxgl.Map({
//       container: 'map',
//       style: 'mapbox://styles/mapbox/streets-v9',
//       zoom: 1.5,
//       center: [0, 20],
//     });

//     axios.get('https://api.covid19api.com/summary', cors()).then((res) => {
//       console.log(res.data.Global, res.data.Countries);
//     });
//   }
//   render() {
//     return <div>Coronavirus App</div>;
//   }
// }

const styles = {
  backgroundColor: 'red',
  height: '10px',
  width: '10px',
};

class Covid19 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      long: '',
      place: '',
      Global: {},
      Geolocation: [],
      CountryInfo: [],
      isLoaded: false,
    };
  }
  componentDidMount() {
    const mapbox_token =
      'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA';

    // mapboxgl.accessToken = mapbox_token;

    // var map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/dark-v10',
    //   zoom: 1.5,
    //   center: [0, 20],
    // });

    axios.get('https://api.covid19api.com/summary', cors()).then((res) => {
      // console.log(res.data.Global, res.data.Countries);
      this.setState(
        {
          Global: res.data.Global,
          CountryInfo: this.state.CountryInfo.concat(res.data.Countries),
        },
        () => {
          this.state.CountryInfo.map((result, index) => {
            axios
              .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${result.Country}.json?access_token=pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA&limit=1`,
                cors()
              )
              .then((res) => {
                if (
                  (res.data.features[0].center[1] ||
                    res.data.features[0].center[0]) !== undefined
                ) {
                  // console.log(
                  //   res.data.features[0].center[1],
                  //   res.data.features[0].center[0],
                  //   res.data.features[0].place_name
                  // );

                  this.setState({
                    Geolocation: this.state.Geolocation.concat({
                      lat: res.data.features[0].center[0],
                      long: res.data.features[0].center[1],
                      place: res.data.features[0].place_name,
                    }),
                  });
                }
              })
              .catch((error) => console.log(error));
          });
          this.setState({
            isLoaded: true,
          });
        }
      );
    });
  }
  clusterMarker = (coordinates) => (
    <Marker coordinates={coordinates} style={styles.clusterMarker}>
      <div
        style={{
          height: '10px',
          width: '10px',
          // backgroundColor: 'rgb(255, 65, 108)',
          backgroundColor: 'red',
          borderRadius: '50%',
        }}></div>
    </Marker>
  );
  getCirclePaint = () => ({
    'circle-radius': 30,
    'circle-color': 'rgb(255, 65, 108)',
    'circle-opacity': 0.5,
  });
  getColor = (lat, long) => {
    // return L.circle([lat, long], {
    //   color: 'red',
    //   fillColor: 'f03',
    //   fillOpacity: 0.5,
    //   radius: 500,
    // });
  };
  render() {
    const Map = ReactMapboxGl({
      accessToken:
        'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA',
    });
    return this.state.isLoaded === true ? (
      <Map
        // zoom='2'
        // center=[20]
        style='mapbox://styles/mapbox/dark-v10'
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}>
        <Cluster ClusterMarkerFactory={this.clusterMarker}>
          {this.state.Geolocation.map((geolocation, key) => (
            <Marker
              key={key}
              style={styles.marker}
              coordinates={[geolocation.lat, geolocation.long]}
              // onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}
            ></Marker>
          ))}
        </Cluster>
      </Map>
    ) : (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h4>Loading...</h4>
      </div>
    );
  }
}

{
  /* <Map
  // zoom='2'
  // center=[20]
  style='mapbox://styles/mapbox/dark-v10'
  containerStyle={{
    height: '100vh',
    width: '100vw',
  }}>
  <Cluster ClusterMarkerFactory={this.clusterMarker}>
    {this.state.Geolocation.map((geolocation, key) => (
      <Marker
        key={key}
        style={styles.marker}
        coordinates={[geolocation.lat, geolocation.long]}
        // onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}
      ></Marker>
    ))}
  </Cluster>
</Map> */
}

{
  /* <Cluster ClusterMarkerFactory={this.clusterMarker}>
  {this.state.Geolocation.map((geolocation, key) => (
    <Marker
      key={key}
      style={styles.marker}
      coordinates={[geolocation.lat, geolocation.long]}
      // onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}
    >
    </Marker>
  ))}
</Cluster> */
}

{
  /* <Layer type='circle' paint={this.getCirclePaint}>
          <Feature coordinates={[50, 30]} />
        </Layer> */
}

{
  /* <Marker
            coordinates={[geolocation.lat, geolocation.long]}
            anchor='bottom'>
            <div
              style={{
                height: '10px',
                width: '10px',
                backgroundColor: 'red',
                borderRadius: '50%',
              }}></div>
          </Marker> */
}

{
  /* <Layer
  type='symbol'
  id='marker'
  style={{ backgroundColor: 'red' }}
  layout={{ 'icon-image': 'harbor-15' }}>
  <Feature coordinates={[22.5726, 88.3639]} />
</Layer> */
}

{
  /* <img src={require('../assets/images/logo.png')} alt='' /> */
}

export default Covid19;
