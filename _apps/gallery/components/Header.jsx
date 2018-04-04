import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

export default class Header extends Component {
    static propTypes = {
        photo: PropTypes.string
    };

    render() {
        return (
            <div className="gallery-header" style={{position:"absolute"}}>
                <div className="image-background" style={ { backgroundImage: `url(${this.props.photo || ''})` } } />
                <div>
                    <h1>Galería de fotos</h1>
                    <p className="lead">Esos momentos en las que me llega la inspiración fotográfica, están
                    capturados en esta página</p>
                </div>
            </div>
        );
    }
};
