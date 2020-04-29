import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Proptypes from 'prop-types';

export default class CleatItem extends Component {
  state = {
    imageUrl: '',
    author: '',
    isLoaded: false
  };
  static propTypes = {
    cleat: Proptypes.object.isRequired
  };
  componentDidMount() {
    const { featured_media, author } = this.props.cleat;
    const getImageUrl = axios.get(`wp-json/wp/v2/media/${featured_media}`);
    const getAuthor = axios.get(`/wp-json/wp/v2/users/${author}`);

    Promise.all([getImageUrl, getAuthor]).then(res =>
      this.setState({
        imageUrl: res[0].data.source_url,
        author: res[1].data.name,
        isLoaded: true
      })
    );
  }
  render() {
    const { id, title, excerpt } = this.props.cleat;
    const { author, imageUrl, isLoaded } = this.state;
    return (
      <div>
        {isLoaded ? (
          <div>
            <h2 style={{ marginBottom: 0 }}>{title.rendered}</h2>
            <small>
              Review By<strong>{author}</strong>
            </small>
            <img
              style={{ width: '100%' }}
              src={imageUrl}
              alt={title.rendered}
            />
            <div dangerouslySetInnerHTML={{ __html: excerpt.rendered }} />
            <Link to={`/cleat/${id}`}>Read Review</Link>
            <hr />
          </div>
        ) : null}
      </div>
    );
  }
}
