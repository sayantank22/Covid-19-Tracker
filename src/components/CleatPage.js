import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class CleatPage extends Component {
  state = {
    cleat: {},
    isLoaded: false
  };
  componentDidMount() {
    axios.get(`/wp-json/wp/v2/cleats/${this.props.match.params.id}`).then(res =>
      this.setState({
        cleat: res.data,
        isLoaded: true
      })
    );
  }
  render() {
    const { cleat, isLoaded } = this.state;
    return (
      <div>
        {isLoaded ? (
          <Fragment>
            <Link to='/'>Go Back</Link>
            <hr />
            <h1>{cleat.title.rendered}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: cleat.content.rendered
              }}></div>
            <h4>Publisher: {cleat.acf.publisher}</h4>
          </Fragment>
        ) : (
          <h4 style={{ textAlign: 'center' }}>Loading...</h4>
        )}
      </div>
    );
  }
}

export default CleatPage;
