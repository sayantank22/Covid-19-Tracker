import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip, Popup } from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import axios from 'axios';
import cors from 'cors';
import '../App.css';
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
      Geolocation: [],
      CountryInfo: [],
      TotalInfo: [],
      index: [],
      chartData: [],
      color: 'blue',
      isLoaded: false,
      center_lat: '5',
      center_long: '34',
      map: null,
      zoom: 5,
    };
  }
  componentDidMount() {
    this.setState({
      chartData: {
        labels: [
          'Boston',
          'Worcester',
          'Springfield',
          'Lowell',
          'Cambridge',
          'New Bedford',
        ],
        datasets: [
          {
            label: 'Population',
            data: [617594, 181045, 153060, 106519, 105162, 95072],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      },
    });

    axios.get('https://api.covid19api.com/summary', cors()).then((res) => {
      this.setState({
        Global: res.data.Global,
        CountryInfo: this.state.CountryInfo.concat(res.data.Countries),
      });
    });

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 3);

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
    if (this.state.CountryInfo.length > 225) {
      let arr1 = [].concat(this.state.CountryInfo);
      TotalConfirmed = arr1.sort(function (a, b) {
        return b.TotalConfirmed - a.TotalConfirmed;
      });

      let arr2 = [].concat(this.state.CountryInfo);
      TotalDeaths = arr2.sort(function (a, b) {
        return b.TotalDeaths - a.TotalDeaths;
      });

      let arr3 = [].concat(this.state.CountryInfo);
      TotalRecovered = arr3.sort(function (a, b) {
        return b.TotalRecovered - a.TotalRecovered;
      });
    }

    // var centerLat = (data.minLat + data.maxLat) / 2;
    // var distanceLat = data.maxLat - data.minLat;
    // var bufferLat = distanceLat * 0.05;
    // var centerLong = (data.minLong + data.maxLong) / 2;
    // var distanceLong = data.maxLong - data.minLong;
    // var bufferLong = distanceLong * 0.05;
    return this.state.TotalInfo.length > 560 ? (
      <section class='dashboard'>
        <div class='left-pannel'>
          <div class='panel-box total-confirmed'>
            <span>Total Confirmed</span>
            <div class='total-numbers'>
              {this.state.Global.TotalConfirmed.toString().replace(
                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                ','
              )}
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
                          {result.TotalConfirmed.toString().replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ','
                          )}
                        </span>{' '}
                        {result.Country}
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

            {this.state.TotalInfo.map((result, k) => {
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
                  center={[result.Lat, result.Lon]}
                  color={this.getColor(result.Confirmed)}
                  radius={
                    result.Deaths < 10
                      ? 8
                      : result.Deaths >= 10 && result.Deaths < 100
                      ? 15
                      : result.Deaths >= 500 && result.Deaths < 1000
                      ? 20
                      : result.Deaths >= 1000 && result.Deaths < 5000
                      ? 25
                      : result.Deaths >= 5000 && result.Deaths < 10000
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
                    <div className={this.getClassName(result.Confirmed)}>
                      <div>
                        <h2>{result.Country}</h2>
                      </div>
                      <p>
                        Deaths: <span>{result.Deaths}</span>{' '}
                      </p>
                      <p>
                        Active: <span>{result.Active}</span>
                      </p>
                      <p>
                        Recovered: <span>{result.Recovered}</span>
                      </p>
                      <p>
                        Confirmed: <span>{result.Confirmed}</span>
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
                    {this.state.Global.TotalDeaths.toString().replace(
                      /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                      ','
                    )}
                  </div>
                </div>

                <div class='total-deaths-list'>
                  <ul>
                    {TotalDeaths.map((result) => {
                      return (
                        <li>
                          <p>
                            <span>
                              {result.TotalDeaths.toString().replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )}
                            </span>{' '}
                            {result.Country}
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
                    {this.state.Global.TotalRecovered.toString().replace(
                      /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                      ','
                    )}
                  </div>
                </div>

                <div class='total-test-list'>
                  <ul>
                    {TotalRecovered.map((result) => (
                      <li>
                        <p>
                          <span>
                            {result.TotalRecovered.toString().replace(
                              /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                              ','
                            )}
                          </span>{' '}
                          {result.Country}
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
