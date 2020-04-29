import React, { Component } from 'react';
import CleatItem from './CleatItem';
import axios from 'axios';

class Cleats extends Component {
  state = {
    cleats: [],
    isLoaded: false
  };
  componentDidMount() {
    axios('/wp-json/wp/v2/cleats')
      .then(res => this.setState({ cleats: res.data, isLoaded: true }))
      .then(err => console.log(err));
  }
  render() {
    // console.log(this.state);
    const { cleats, isLoaded } = this.state;
    return (
      <div>
        <h1>Cleats</h1>
        {isLoaded ? (
          cleats.map(cleat => <CleatItem key={cleat.id} cleat={cleat} />)
        ) : (
          <p>...Loading</p>
        )}
      </div>
    );
  }
}

export default Cleats;
