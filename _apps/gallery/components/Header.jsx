import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

export default class Header extends Component {
    static propTypes = {
        photo: PropTypes.string
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.photo !== this.props.photo) {
            //NO me gusta, pero es lo mejor que podemos hacer ahora mismo :(
            window.$(findDOMNode(this)).find('.image-background').parallax({imageSrc: nextProps.photo});
            window.$('.parallax-mirror > img').attr('src', nextProps.photo);
        }
    }

    render() {
        return (
            <div className="gallery-header" style={{position:"absolute"}}>
                <div className="image-background"></div>
                <div>
                    <h1>Galería de fotos</h1>
                    <p className="lead">Esos momentos en las que me llega la inspiración fotográfica, están
                    capturados en esta página</p>
                </div>
            </div>
        );
    }
};
