import React, { Fragment } from 'react';
// import Home from './home';
// import Cleats from './components/Cleats';
// import CleatPage from './components/CleatPage';
// import Covid19 from './components/Covid19';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import Leaflet from './components/leaflet';
// import Template from './template';
import CoronaApp from './components/covid-19-leafllet';

function App() {
  return (
    // <Router>
    //   <Fragment>
    //     <Route exact path='/' component={Cleats} />
    //     <Route exact path='/cleat/:id' component={CleatPage} />
    //   </Fragment>
    // </Router>
    <CoronaApp />
  );
}

export default App;
