import React, { Component } from 'react';
// import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import mapboxgl from 'mapbox-gl';
import './App.css';
//import { map } from 'leaflet';
import axios from 'axios';
import cors from 'cors';
import unirest from 'unirest';
// import { v4 as uuidv4 } from 'uuid';

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      long: '',
      place: '',
      Global: {},
      features: [],
      Geolocation: [],
      CountryInfo: [],
      TotalInfo: [],
      index: [],
      isLoaded: false,
      center_lat: '5',
      center_long: '34',
      map: null,
      zoom: 5,
    };
  }
  componentDidMount() {
    // const mapbox_token =
    //   'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA';

    // mapboxgl.accessToken = mapbox_token;

    // const map = new mapboxgl.Map({
    //   container: this.mapContainer,
    //   style: 'mapbox://styles/mapbox/dark-v10',
    //   center: [this.state.center_lat, this.state.center_long],
    //   zoom: this.state.zoom,
    // });

    var req = unirest(
      'GET',
      'https://coronavirus-tracker-india-covid-19.p.rapidapi.com/api/getStatewiseSorted'
    );

    req.headers({
      'x-rapidapi-host': 'coronavirus-tracker-india-covid-19.p.rapidapi.com',
      'x-rapidapi-key': '4c03320f02msh1b8f889e4c533d3p1ace7ajsnd5485bc0a069',
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);

      console.log(res.body);
    });

    // map.on('style.load', function (e) {
    //   map.addSource('markers', {
    //     type: 'geojson',
    //     data: {
    //       type: 'FeatureCollection',
    //       features: [
    //         {
    //           type: 'Feature',
    //           geometry: {
    //             type: 'Point',
    //             coordinates: [-77.03238901390978, 38.913188059745586],
    //           },
    //         },
    //         {
    //           type: 'Feature',
    //           geometry: {
    //             type: 'Point',
    //             coordinates: [-122.414, 37.776],
    //           },
    //         },
    //       ],
    //     },
    //   });
    //   map.addLayer({
    //     id: 'circles2',
    //     source: 'markers',
    //     type: 'circle',
    //     paint: {
    //       'circle-radius': 20,
    //       'circle-opacity': 0.5,
    //       'circle-stroke-width': 1,
    //       'circle-color': '#f03',
    //       'circle-stroke-color': '#f03',
    //       'circle-stroke-opacity': 1,
    //     },
    //   });
    // });

    // var req = unirest(
    //   'GET',
    //   'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats'
    // );

    // req.query({
    //   country: 'Canada',
    // });

    // req.headers({
    //   'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
    //   'x-rapidapi-key': '4c03320f02msh1b8f889e4c533d3p1ace7ajsnd5485bc0a069',
    // });

    // req.end(function (res) {
    //   if (res.error) throw new Error(res.error);

    //   // console.log(res.body);

    //   res.body.data.covid19Stats.map((result, index) => {
    //     // console.log(result.keyId);
    //     if (result.country !== 'US') {
    //       axios
    //         .get(
    //           `https://api.mapbox.com/geocoding/v5/mapbox.places/${
    //             result.province !== null ? result.province : result.country
    //           }.json?access_token=pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA&limit=1`,
    //           cors()
    //         )
    //         .then((res) => {
    //           // console.log(res.data);

    //           if (
    //             (res.data.features[0].center[1] ||
    //               res.data.features[0].center[0]) !== undefined
    //           ) {
    //             // this.setState({
    //             //   rapidApi: this.state.rapidApi.concat(res.data),
    //             // });
    //             new mapboxgl.Marker({
    //               // color: this.getColorFromCount(result.confirmed),
    //               color: 'red',
    //             })
    //               .setLngLat([
    //                 res.data.features[0].center[0],
    //                 res.data.features[0].center[1],
    //               ])
    //               .addTo(map);
    //             // .setPopup(popup)
    //           }
    //         });
    //     }
    //   });
    // });

    axios.get('https://api.covid19api.com/summary', cors()).then((res) => {
      // console.log(res.data.Global, res.data.Countries);
      this.setState(
        {
          Global: res.data.Global,
          CountryInfo: this.state.CountryInfo.concat(res.data.Countries),
        }
        // () => {
        //   this.state.CountryInfo.map((result, index) => {
        //     axios
        //       .get(
        //         `https://api.mapbox.com/geocoding/v5/mapbox.places/${result.Country}.json?access_token=pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA&limit=1`,
        //         cors()
        //       )
        //       .then((res) => {
        //         if (
        //           (res.data.features[0].center[1] ||
        //             res.data.features[0].center[0]) !== undefined
        //         ) {
        //           // console.log(
        //           //   res.data.features[0].center[1],
        //           //   res.data.features[0].center[0],
        //           //   res.data.features[0].place_name
        //           // );

        //           // create the popup
        //           let popup = new mapboxgl.Popup({ offset: 25 }).setText(
        //             `Country: ${result.Country}
        //             TotalConfirmed: ${result.TotalConfirmed}
        //             TotalDeaths: ${result.TotalDeaths}
        //             TotalRecovered: ${result.TotalRecovered}
        //             `
        //           );

        //           new mapboxgl.Marker({
        //             color: this.getColorFromCount(result.TotalConfirmed),
        //           })
        //             .setLngLat([
        //               res.data.features[0].center[0],
        //               res.data.features[0].center[1],
        //             ])
        //             .setPopup(popup)
        //             .addTo(map);

        //           this.setState({
        //             Geolocation: this.state.Geolocation.concat({
        //               lat: res.data.features[0].center[0],
        //               long: res.data.features[0].center[1],
        //               place: res.data.features[0].place_name,
        //             }),
        //           });
        //         } else {
        //           console.log(res.data);
        //         }
        //       })
        //       .catch((error) => console.log(error));
        //   });
        //   this.setState({
        //     isLoaded: true,
        //   });
        // }
      );
    });

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let date = yesterday.toISOString();

    axios.get('https://api.covid19api.com/countries', cors()).then((res) => {
      res.data.map((result, index1) => {
        axios
          .get(
            `https://api.covid19api.com/live/country/${result.Country}/status/confirmed/date/${date}`
          )
          .then((res) => {
            res.data.map((result, index2) => {
              // this.setState((state) => (this.state.index = state.index + 1));
              // map.on('style.load', function (e) {
              //   map.addSource('markers', {
              //     type: 'geojson',
              //     data: {
              //       type: 'FeatureCollection',
              //       features: [
              //         {
              //           type: 'Feature',
              //           geometry: {
              //             type: 'Point',
              //             coordinates: [result.Lon, result.Lat],
              //           },
              //           // properties: {
              //           //   modelId: { index },
              //           // },
              //         },
              //       ],
              //     },
              //   });
              //   map.addLayer({
              //     id: 'circles2',
              //     source: 'markers',
              //     type: 'circle',
              //     paint: {
              //       'circle-radius': 20,
              //       'circle-opacity': 0.5,
              //       'circle-stroke-width': 1,
              //       'circle-color': '#f03',
              //       'circle-stroke-color': '#f03',
              //       'circle-stroke-opacity': 1,
              //     },
              //     // filter: ['==', 'modelId', { index }],
              //   });
              // });

              this.setState(
                {
                  TotalInfo: this.state.TotalInfo.concat(result),
                  // index: this.state.index.concat(i),
                  features: this.state.features.concat({
                    id: Math.floor(Math.random() * 100000000),
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [
                        parseFloat(result.Lon),
                        parseFloat(result.Lat),
                      ],
                    },
                    properties: {
                      color:
                        result.Confirmed < 100
                          ? 'green'
                          : result.Confirmed >= 100 && result.Confirmed < 1000
                          ? 'blue'
                          : 'red',
                      Country: result.Country,
                      Province: result.Province,
                      Confirmed: result.Confirmed,
                      Deaths: result.Deaths,
                      Recovered: result.Recovered,
                      Active: result.Active,
                    },
                  }),
                },
                () => {
                  // const mapbox_token =
                  //   'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA';
                  // mapboxgl.accessToken = mapbox_token;
                  // const map = new mapboxgl.Map({
                  //   container: this.mapContainer,
                  //   style: 'mapbox://styles/mapbox/dark-v10',
                  //   center: [this.state.center_lat, this.state.center_long],
                  //   zoom: this.state.zoom,
                  // });
                  // map.addLayer({
                  //   id: 'circles2',
                  //   source: 'markers',
                  //   type: 'circle',
                  //   paint: {
                  //     'circle-radius': 20,
                  //     'circle-opacity': 0.2,
                  //     'circle-stroke-width': 1,
                  //     'circle-color': '#f03',
                  //     'circle-stroke-color': '#f03',
                  //     'circle-stroke-opacity': 1,
                  //   },
                  // });
                  // map.on('style.load', function (e) {
                  //   map.addSource('markers', {
                  //     type: 'geojson',
                  //     data: {
                  //       type: 'FeatureCollection',
                  //       features: this.state.features,
                  //     },
                  //   });
                  //   map.addLayer({
                  //     id: 'circles2',
                  //     source: 'markers',
                  //     type: 'circle',
                  //     paint: {
                  //       'circle-radius': 20,
                  //       'circle-opacity': 0.5,
                  //       'circle-stroke-width': 1,
                  //       'circle-color': '#f03',
                  //       'circle-stroke-color': '#f03',
                  //       'circle-stroke-opacity': 1,
                  //     },
                  //   });
                  // });
                  // create the popup
                  // let popup = new mapboxgl.Popup({ offset: 25 }).setText(
                  //   `Country: ${result.Country}
                  //   Province: ${result.Province}
                  //   Confirmed: ${result.Confirmed}
                  //   Deaths: ${result.Deaths}
                  //   Recovered: ${result.Recovered}
                  //   Active: ${result.Active}
                  //   `
                  // );
                  // map.on('style.load', function (e) {
                  //   map.addSource('markers', {
                  //     type: 'geojson',
                  //     data: {
                  //       type: 'FeatureCollection',
                  //       features: [
                  //         {
                  //           type: 'Feature',
                  //           geometry: {
                  //             type: 'Point',
                  //             coordinates: [
                  //               -77.03238901390978,
                  //               38.913188059745586,
                  //             ],
                  //           },
                  //           properties: {
                  //             modelId: 1,
                  //           },
                  //         },
                  //         {
                  //           type: 'Feature',
                  //           geometry: {
                  //             type: 'Point',
                  //             coordinates: [-122.414, 37.776],
                  //           },
                  //           properties: {
                  //             modelId: 2,
                  //           },
                  //         },
                  //       ],
                  //     },
                  //   });
                  //   map.addLayer({
                  //     id: 'circles1',
                  //     source: 'markers',
                  //     type: 'circle',
                  //     paint: {
                  //       'circle-radius': 10,
                  //       'circle-color': '#f03',
                  //       'circle-opacity': 0.5,
                  //       'circle-stroke-width': 0,
                  //     },
                  //     filter: ['==', 'modelId', 1],
                  //   });
                  //   map.addLayer({
                  //     id: 'circles2',
                  //     source: 'markers',
                  //     type: 'circle',
                  //     paint: {
                  //       'circle-radius': 20,
                  //       'circle-opacity': 0.5,
                  //       'circle-stroke-width': 1,
                  //       'circle-color': '#f03',
                  //       'circle-stroke-color': '#f03',
                  //       'circle-stroke-opacity': 1,
                  //     },
                  //     filter: ['==', 'modelId', 2],
                  //   });
                  // });
                  // new mapboxgl.Marker({
                  //   id: 'circle2',
                  //   color: this.getColorFromCount(result.Confirmed),
                  // })
                  //   .setLngLat([result.Lon, result.Lat])
                  //   .setPopup(popup)
                  //   .addTo(map);
                  // map.addLayer({
                  //   id: 'circles2',
                  //   source: 'markers',
                  //   type: 'circle',
                  //   paint: {
                  //     'circle-radius': 20,
                  //     'circle-opacity': 0.5,
                  //     'circle-stroke-width': 1,
                  //     'circle-color': '#f03',
                  //     'circle-stroke-color': '#f03',
                  //     'circle-stroke-opacity': 1,
                  //   },
                  // });
                }
              );
            });
            this.setState({
              isLoaded: true,
            });
            if (this.state.features.length > 565) {
              // console.log(this.state.features);
              var geojson = {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: this.state.features,
                },
              };

              const mapbox_token =
                'pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA';

              mapboxgl.accessToken = mapbox_token;

              const map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'mapbox://styles/mapbox/dark-v10',
                center: [this.state.center_lat, this.state.center_long],
                zoom: this.state.zoom,
              });

              var hoveredStateId = null;

              map.on('load', function (e) {
                map.addSource('markers', {
                  type: 'geojson',
                  data: geojson.data,
                });

                map.addLayer({
                  id: 'circles1',
                  source: 'markers',
                  type: 'circle',
                  paint: {
                    'circle-radius': 10,
                    'circle-opacity': 0.1,
                    'circle-stroke-width': 2,
                    'circle-color': '#00e676',
                    // 'circle-stroke-color': '#00e676',
                    'circle-stroke-color': [
                      'case',
                      ['boolean', ['feature-state', 'hover'], false],
                      'blue',
                      '#00e676',
                    ],
                    'circle-stroke-opacity': 1,
                  },
                  filter: ['==', 'color', 'green'],
                });

                map.addLayer({
                  id: 'circles2',
                  source: 'markers',
                  type: 'circle',
                  paint: {
                    'circle-radius': 20,
                    'circle-opacity': 0.1,
                    'circle-stroke-width': 2,
                    'circle-color': '#ff9800',
                    //'circle-stroke-color': '#ff9800',
                    'circle-stroke-color': [
                      'case',
                      ['boolean', ['feature-state', 'hover'], false],
                      'blue',
                      '#ff9800',
                    ],
                    'circle-stroke-opacity': 1,
                  },
                  filter: ['==', 'color', 'blue'],
                });

                map.addLayer({
                  id: 'circles3',
                  source: 'markers',
                  type: 'circle',
                  paint: {
                    'circle-radius': 30,
                    'circle-opacity': 0.1,
                    'circle-stroke-width': 2,
                    'circle-color': '#e91e63',
                    // 'circle-color': [
                    //   'case',
                    //   ['boolean', ['feature-state', 'hover'], false],
                    //   'blue',
                    //   '#e91e63',
                    // ],
                    // 'circle-stroke-color': '#e91e63',
                    'circle-stroke-color': [
                      'case',
                      ['boolean', ['feature-state', 'hover'], false],
                      'blue',
                      '#e91e63',
                    ],
                    'circle-stroke-opacity': 1,
                  },
                  filter: ['==', 'color', 'red'],
                });

                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                map.on('click', 'circles3', function (e) {
                  var coordinates = e.features[0].geometry.coordinates.slice();
                  var properties = e.features[0].properties;

                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] +=
                      e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  new mapboxgl.Popup({ offset: 25, closeButton: false })
                    .setLngLat(coordinates)
                    .setHTML(
                      `<div class='popup3'>
                          <div>
                            <h2
                              style='
                                padding-bottom: '15px',
                                border-bottom: '1.5px solid #84817a';
                              '>
                              ${properties.Country}
                            </h2>
                          </div>
                          <p>Deaths: ${properties.Deaths}</p>
                          <p>Active: ${properties.Active}</p>
                          <p>Recovered:  ${properties.Recovered}</p>
                          <p>Confirmed:  ${properties.Confirmed}</p>
                    </div>`
                    )
                    .addTo(map);
                });

                map.on('mousemove', 'circles3', function (e) {
                  if (e.features.length > 0) {
                    if (hoveredStateId) {
                      map.removeFeatureState({
                        source: 'markers',
                        id: hoveredStateId,
                      });
                    }

                    hoveredStateId = e.features[0].id;

                    // feature state for the feature under the mouse
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: true }
                    );
                  }
                });

                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.on('mouseleave', 'circles3', function () {
                  if (hoveredStateId) {
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: false }
                    );
                  }
                  hoveredStateId = null;
                });

                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                map.on('click', 'circles2', function (e) {
                  var coordinates = e.features[0].geometry.coordinates.slice();
                  var properties = e.features[0].properties;

                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] +=
                      e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  new mapboxgl.Popup({ offset: 25, closeButton: false })
                    .setLngLat(coordinates)
                    .setHTML(
                      `<div class='popup2'>
                          <div>
                            <h2
                              style='
                                padding-bottom: '15px',
                                border-bottom: '1.5px solid #84817a';
                              '>
                              ${properties.Country}
                            </h2>
                          </div>
                          <p>Deaths: ${properties.Deaths}</p>
                          <p>Active: ${properties.Active}</p>
                          <p>Recovered:  ${properties.Recovered}</p>
                          <p>Confirmed:  ${properties.Confirmed}</p>
                    </div>`
                    )
                    .addTo(map);
                });

                map.on('mousemove', 'circles2', function (e) {
                  if (e.features.length > 0) {
                    if (hoveredStateId) {
                      map.removeFeatureState({
                        source: 'markers',
                        id: hoveredStateId,
                      });
                    }

                    hoveredStateId = e.features[0].id;

                    // feature state for the feature under the mouse
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: true }
                    );
                  }
                });

                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.on('mouseleave', 'circles2', function () {
                  if (hoveredStateId) {
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: false }
                    );
                  }
                  hoveredStateId = null;
                });

                // When a click event occurs on a feature in the places layer, open a popup at the
                // location of the feature, with description HTML from its properties.
                map.on('click', 'circles1', function (e) {
                  var coordinates = e.features[0].geometry.coordinates.slice();
                  var properties = e.features[0].properties;

                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] +=
                      e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }

                  new mapboxgl.Popup({ offset: 25, closeButton: false })
                    .setLngLat(coordinates)
                    .setHTML(
                      `<div class='popup1'>
                          <div>
                            <h2
                              style='
                                padding-bottom: '15px',
                                border-bottom: '1.5px solid #84817a';
                              '>
                              ${properties.Country}
                            </h2>
                          </div>
                          <p>Deaths: ${properties.Deaths}</p>
                          <p>Active: ${properties.Active}</p>
                          <p>Recovered:  ${properties.Recovered}</p>
                          <p>Confirmed:  ${properties.Confirmed}</p>
                    </div>`
                    )
                    .addTo(map);
                });

                map.on('mousemove', 'circles1', function (e) {
                  if (e.features.length > 0) {
                    if (hoveredStateId) {
                      map.removeFeatureState({
                        source: 'markers',
                        id: hoveredStateId,
                      });
                    }

                    hoveredStateId = e.features[0].id;

                    // feature state for the feature under the mouse
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: true }
                    );
                  }
                });

                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.on('mouseleave', 'circles1', function () {
                  if (hoveredStateId) {
                    map.setFeatureState(
                      { source: 'markers', id: hoveredStateId },
                      { hover: false }
                    );
                  }
                  hoveredStateId = null;
                });
              });
            }
          });
      });
    });
  }
  getColorFromCount = (count) => {
    if (count >= 100) {
      return 'red';
    }
    if (count >= 10) {
      return 'blue';
    }
    return 'green';
  };
  render() {
    return (
      <div>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h4>Loading...</h4>
        </div>
        <div>
          <div className='sidebarStyle'>
            TotalConfirmed: {this.state.Global.TotalConfirmed} | TotalDeaths:{' '}
            {this.state.Global.TotalDeaths} | TotalRecovered:{' '}
            {this.state.Global.TotalRecovered}
          </div>
        </div>
        <div ref={(el) => (this.mapContainer = el)} className='mapContainer' />
      </div>
    );
  }
}

// return this.state.isLoaded === true ? (
//     <div ref={(el) => (this.mapContainer = el)} className='mapContainer' />
//   ) : (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h4>Loading...</h4>
//     </div>
//   );

// const today = new Date()
// const yesterday = new Date(today)

// yesterday.setDate(yesterday.getDate() - 1)

// today.toDateString()
// yesterday.toDateString()

export default Template;
