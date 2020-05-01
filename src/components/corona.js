import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip, Popup } from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import axios from 'axios';
import cors from 'cors';
import '../App.css';
import unirest from 'unirest';
// import Piechart from './Piechart';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      long: '',
      place: '',
      Global: {},
      features: [],
      latlong: [],
      rapidInfo: [],
      CountryInfo: [],
      TotalInfo: [],
      index: [],
      chartData: [],
      coordinates: [],
      color: 'blue',
      isLoaded: false,
      center_lat: '5',
      center_long: '34',
      map: null,
      zoom: 5,
    };
  }
  componentDidMount() {
    var req1 = unirest('GET', 'https://covid-193.p.rapidapi.com/statistics');

    req1.headers({
      'x-rapidapi-host': 'covid-193.p.rapidapi.com',
      'x-rapidapi-key': '4c03320f02msh1b8f889e4c533d3p1ace7ajsnd5485bc0a069',
    });

    req1.end((res) => {
      if (res.error) throw new Error(res.error);
      //   this.setState({
      //     features: [...this.state.features, res.body.response],
      //   });

      // console.log(res.body.response);
      res.body.response.map((result, index) => {
        // console.log(result);
        axios
          .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${result.country}.json?access_token=pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA&limit=1`,
            cors()
          )
          .then((res) => {
            if (index === 3) {
              this.setState({
                rapidInfo: [
                  ...this.state.rapidInfo,
                  {
                    confirmed: result.cases.total,
                    country: result.country,
                    deaths: result.deaths.total,
                    recovered: result.cases.recovered,
                    long: res.data.features[0].center[0],
                    lat: res.data.features[0].center[1],
                  },
                ],
              });
            }
            this.setState({
              features: [
                ...this.state.features,
                {
                  ...result,
                  long: res.data.features[0].center[0],
                  lat: res.data.features[0].center[1],
                },
              ],
              latlong: [
                ...this.state.latlong,
                [
                  res.data.features[0].center[0],
                  res.data.features[0].center[1],
                ],
              ],
            });
          });
      });
    });

    var req = unirest(
      'GET',
      'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats'
    );

    // req.query({
    //   country: 'Canada',
    // });

    req.headers({
      'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
      'x-rapidapi-key': '4c03320f02msh1b8f889e4c533d3p1ace7ajsnd5485bc0a069',
    });

    req.end((res) => {
      if (res.error) throw new Error(res.error);

      // console.log(res.body);

      res.body.data.covid19Stats.map((result, index) => {
        // console.log(result.keyId);
        if (result.country !== 'US') {
          //   this.setState({
          //     features: this.state.features.concat(result),
          //   });
          axios
            .get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                result.province !== null ? result.province : result.country
              }.json?access_token=pk.eyJ1Ijoic2F5YW50YW5rMjIiLCJhIjoiY2s5ZWoxc2F0MDJhNDNtdGJqdmdzYmN4cSJ9.xICKivbxTOfggB9Q1nPkHA&limit=1`,
              cors()
            )
            .then((res) => {
              this.setState({
                rapidInfo: [
                  ...this.state.rapidInfo,
                  {
                    confirmed: result.confirmed === null ? 0 : result.confirmed,
                    country: result.country,
                    deaths: result.deaths === null ? 0 : result.deaths,
                    keyId: result.keyId,
                    lastUpdate: result.lastUpdate,
                    province: result.lastUpdate,
                    recovered: result.recovered === null ? 0 : result.recovered,
                    long: res.data.features[0].center[0],
                    lat: res.data.features[0].center[1],
                  },
                ],
              });
            });
        }
      });
    });

    var req2 = unirest(
      'GET',
      'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total'
    );

    req2.headers({
      'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
      'x-rapidapi-key': '4c03320f02msh1b8f889e4c533d3p1ace7ajsnd5485bc0a069',
    });

    req2.end((res) => {
      if (res.error) throw new Error(res.error);

      this.setState({
        Global: res.body.data,
      });
    });

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 2);

    let date = yesterday.toISOString();

    axios.get('https://api.covid19api.com/countries', cors()).then((res) => {
      res.data.map((result, index1) => {
        axios
          .get(
            `https://api.covid19api.com/live/country/${result.Country}/status/confirmed/date/${date}`
          )
          .then((res) => {
            res.data.map((result, index) => {
              this.setState({
                TotalInfo: this.state.TotalInfo.concat(result),
                isLoaded: true,
              });
            });
          });
      });
    });
  }
  getClassName = (count) => {
    if (count >= 1000) {
      return 'popup3';
    }
    if (count >= 100) {
      return 'popup2';
    }
    return 'popup1';
  };
  getColor = (count) => {
    if (count >= 1000) {
      return '#e91e63';
    }
    if (count >= 100) {
      return '#ff9800';
    }
    return '#00e676';
  };
  changeBackground = (e) => {
    // console.log(e.target);

    e.target.options.color = 'blue';
    e.target.options.radius = 100;
  };
  render() {
    let TotalConfirmed, TotalDeaths, TotalRecovered;
    if (this.state.rapidInfo.length > 250) {
      let arr1 = [].concat(this.state.rapidInfo);
      TotalConfirmed = arr1.sort(function (a, b) {
        return b.confirmed - a.confirmed;
      });

      let arr2 = [].concat(this.state.rapidInfo);
      TotalDeaths = arr2.sort(function (a, b) {
        return b.deaths - a.deaths;
      });

      let arr3 = [].concat(this.state.rapidInfo);
      TotalRecovered = arr3.sort(function (a, b) {
        return b.recovered - a.recovered;
      });
    }
    // console.log(TotalConfirmed, TotalDeaths, TotalRecovered);

    // var centerLat = (data.minLat + data.maxLat) / 2;
    // var distanceLat = data.maxLat - data.minLat;
    // var bufferLat = distanceLat * 0.05;
    // var centerLong = (data.minLong + data.maxLong) / 2;
    // var distanceLong = data.maxLong - data.minLong;
    // var bufferLong = distanceLong * 0.05;
    return this.state.rapidInfo.length > 250 ? (
      <section class='dashboard'>
        <div class='left-pannel'>
          <div class='panel-box total-confirmed'>
            <span>Total Confirmed</span>
            <div class='total-numbers'>
              {this.state.Global.confirmed
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
          <div class='panel-box'>
            <div class='pannel-header'>
              <p>Confirmed Cases by Country</p>
            </div>

            <div class='list-item-content'>
              <ul>
                {TotalConfirmed.map((result) => {
                  return (
                    <li>
                      <a href='#'>
                        <span>
                          {result.confirmed
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                        </span>{' '}
                        {result.country}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div class='dashboard-viewport'>
          {/* <img src="images/covid-world-map.png" alt="" /> */}
          <Map
            id='map'
            style={{ height: '100vh', width: '100%' }}
            zoom={3}
            center={[this.state.center_lat, this.state.center_long]}
            //   bounds={[
            //     [data.minLat - bufferLat, data.minLong - bufferLong],
            //     [data.maxLat + bufferLat, data.maxLong + bufferLong]
            //   ]}
          >
            <TileLayer
              // id='https://maps.omniscale.net/v2/private-sayantan-karmakar-bcbb61be/style.default/map'
              url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
              // attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              // url='https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png'
              // url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              // attribution={
              //   '&copy; 2020 &middot; <a href="https://maps.omniscale.com/">Omniscale</a> ' +
              //   '&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              // }

              // url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
              // url='https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png'
            />

            {this.state.features.map((result, k) => {
              return (
                <CircleMarker
                  id='circle'
                  key={k}
                  onMouseOver={(e) =>
                    e.target.setStyle({
                      fillColor: '#00a8ff',
                      fillOpacity: 0.5,
                    })
                  }
                  onMouseOut={(e) =>
                    e.target.setStyle({
                      fillColor: e.target.options.color,
                      fillOpacity: 0.1,
                    })
                  }
                  center={[result.lat, result.long]}
                  color={this.getColor(result.cases.total)}
                  radius={
                    result.deaths.total < 10
                      ? 8
                      : result.deaths.total >= 10 && result.deaths.total < 100
                      ? 15
                      : result.deaths.total >= 500 && result.deaths.total < 1000
                      ? 20
                      : result.deaths.total >= 1000 &&
                        result.deaths.total < 5000
                      ? 25
                      : result.deaths.total >= 5000 &&
                        result.deaths.total < 10000
                      ? 30
                      : 35
                  }
                  fillOpacity={0.1}
                  stroke={true}
                  weight={1}>
                  <Tooltip
                    className='tooltip'
                    direction='top'
                    offset={[-8, -2]}
                    opacity={1}>
                    <div className={this.getClassName(result.cases.total)}>
                      <div>
                        <h2>{result.country}</h2>
                      </div>
                      <p>
                        Deaths: <span>{result.deaths.total}</span>{' '}
                      </p>
                      <p>
                        Active: <span>{result.cases.active}</span>
                      </p>
                      <p>
                        Recovered: <span>{result.cases.recovered}</span>
                      </p>
                      <p>
                        Confirmed: <span>{result.cases.total}</span>
                      </p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </Map>
        </div>

        <div class='right-pannel'>
          <div class='right-pannel-top'>
            <div class='total-deaths'>
              <div class='panel-box'>
                <div class='pannel-header'>
                  <span>Total Deaths</span>
                  <div class='total-numbers'>
                    {this.state.Global.deaths
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>

                <div class='total-deaths-list'>
                  <ul>
                    {TotalDeaths.map((result) => {
                      return (
                        <li>
                          <p>
                            <span>
                              {result.deaths
                                .toString()
                                .replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )}
                            </span>{' '}
                            {result.country}
                          </p>
                          {/* <p>
                            <strong>{result.Country}</strong>
                          </p> */}
                        </li>
                      );
                    })}
                    {/* <li>
                      <p>
                        <span>17,515</span> deaths
                      </p>
                      <p>
                        New York City <strong>New York</strong> US
                      </p>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>

            <div class='total-test'>
              <div class='panel-box'>
                <div class='pannel-header'>
                  <span>Total Recovered</span>
                  <div class='total-numbers'>
                    {this.state.Global.recovered
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>

                <div class='total-test-list'>
                  <ul>
                    {TotalRecovered.map((result) => (
                      <li>
                        <p>
                          <span>
                            {result.recovered
                              .toString()
                              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                          </span>{' '}
                          {result.country}
                        </p>
                        {/* <p>
                          <strong>{result.Country}</strong>
                        </p> */}
                      </li>
                    ))}

                    {/* <li>
                      <p>
                        <span>826,095 tested</span>
                      </p>
                      <p>
                        <strong>New York</strong> US
                      </p>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* <div class='right-pannel-bottom'>
            <div class='panel-box'>
              <img src={require('../assets/images/graph.jpg')} alt='' />
            </div>
          </div> */}
        </div>
      </section>
    ) : (
      // <div className='App'>
      //   {/* <div className='App-header'>
      //     <img src={logo} className='App-logo' alt='logo' />
      //     <h2>Welcome to React</h2>
      //   </div> */}
      //   {/* <Piechart chartData={this.state.chartData} /> */}
      //   <Piechart
      //     chartData={this.state.chartData}
      //     location='Massachusetts'
      //     legendPosition='bottom'
      //   />
      // </div>
      <div class='loader'>
        <div class='loader-inner'>
          <div class='loader-line-wrap'>
            <div class='loader-line'></div>
          </div>
          <div class='loader-line-wrap'>
            <div class='loader-line'></div>
          </div>
          <div class='loader-line-wrap'>
            <div class='loader-line'></div>
          </div>
          <div class='loader-line-wrap'>
            <div class='loader-line'></div>
          </div>
          <div class='loader-line-wrap'>
            <div class='loader-line'></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
