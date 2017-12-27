import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import ZoomImageOverlay from './ZoomImageOverlay.jsx';
import flickr from '../flickr';

export default class Overlay extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
        photosetId: PropTypes.string.isRequired,
        perPage: PropTypes.number.isRequired,

        currentPhoto: PropTypes.object.isRequired,
        isZoomed: PropTypes.bool.isRequired,
        loadFullInfoForPhoto: PropTypes.func.isRequired,
        next: PropTypes.func.isRequired,
        prev: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired,
        zoom: PropTypes.func.isRequired,
        zoomOff: PropTypes.func.isRequired,
        hasNext: PropTypes.bool.isRequired,
        hasPrev: PropTypes.bool.isRequired,
        toggleShow: PropTypes.func.isRequired,
        show: PropTypes.bool,
        showInfoPanel: PropTypes.bool.isRequired,
        toggleInfoPanel: PropTypes.func.isRequired,
        photoIsLoading: PropTypes.func.isRequired,
        photoIsLoaded: PropTypes.func.isRequired,
        hasNextPage: PropTypes.bool.isRequired,
        page: PropTypes.number.isRequired,
        loadMorePhotosAndNext: PropTypes.func.isRequired,
        changeAnimation: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.loadFullInfoForPhoto(this.props.currentPhoto);
        requestAnimationFrame(this.props.toggleShow);
        $(window).keyup(this.onKeyUp.bind(this));
        $('body').css('overflow', 'hidden');
    }

    componentWillUnmount() {
        $(window).off('keyup');
        $('body').css('overflow', 'inherit');
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentPhoto.id !== this.props.currentPhoto.id) {
            this.props.loadFullInfoForPhoto(nextProps.currentPhoto);
            this.props.photoIsLoading();
        }
    }

    onKeyUp(event) {
        event.preventDefault();
        const key = event.keyCode;
        if(key === 27) { //ESC
            if(this.props.isZoomed) this.props.zoomOff();
             else this.props.close();
        } else if(key === 39 && this.props.hasNext) { //Right
            this.props.next();
        } else if(key === 37 && this.props.hasPrev) { //Left
            this.props.prev();
        }
    }

    onTap() {
        //That's not really a pure function, but we need it to simulate a double tap action on mobiles
        if(Date.now() - this._lastTapTime <= 500) {
            window.navigator.vibrate([ 40, 50 ]);
            this.props.zoom(this.props.currentPhoto);
        } else {
            this._lastTapTime = Date.now();
        }
    }

    onTouchStart(e) {
        this._startTouchInfo = e.changedTouches[0];
        this._startTouchTime = Date.now();
    }

    onTouchEnd(e) {
        //That's not really a pure function, but we need it to simulate a long tap action on mobiles
        if(Date.now() - this._startTouchTime >= 1000) {
            const diff = {
                x: Math.abs(e.changedTouches[0].clientX - this._startTouchInfo.clientX),
                y: Math.abs(e.changedTouches[0].clientY - this._startTouchInfo.clientY)
            };
            if(diff.x < 5 && diff.y < 5) {
                window.navigator.vibrate(100);
                this.props.zoomOff();
            }
        }
    }

    render() {
        const {
            currentPhoto, isZoomed, next, prev, close, zoom, hasNext,
            hasPrev, show, showInfoPanel, toggleInfoPanel, photoIsLoaded,
            hasNextPage, userId, photosetId, perPage, page, loadMorePhotosAndNext,
            changeAnimation
        } = this.props;
        const photo = currentPhoto;
        const info = photo.info ? photo.info : null;
        const exif = photo.exif ? photo.exif : null;
        let descripcion = null;
        let fecha = null;
        let camara = null;
        let exposicion = null;
        let apertura = null;
        let iso = null;
        let distanciaFocal = null;
        let flash = null;
        let enlace = null;

        if(info) {
            if(info.description) descripcion = <span id="descripcion">{ info.description._content }</span>;
            if(info.dates) {
                let sd = info.dates.taken.split(/[-: ]/);
                let date = new Date(sd[0], sd[1], sd[2], sd[3], sd[4], sd[5], 0);
                fecha = <p className="lead" id="fecha"><strong>Fecha de captura:</strong> <span>{date.toLocaleString()}</span></p>
            }
            if(info.urls.url) {
                enlace = <p id="enlace"><a href={ info.urls.url[0]._content } target="_blank">Ver en Flickr</a></p>;
            }
        }

        if(exif) {
            let _exposicion = null;
            let _apertura = null;
            let _iso = null;
            let _distFocal = null;
            let _flash = null;

            for(let tag of exif.exif) {
                if(tag.tagspace === 'ExifIFD') {
                    if(tag.tag === 'ExposureTime') _exposicion = tag.raw._content;
                    if(tag.tag === 'FNumber') _apertura = tag.raw._content;
                    if(tag.tag === 'ISO') _iso = tag.raw._content;
                    if(tag.tag === 'FocalLength') _distFocal = tag.raw._content;
                    if(tag.tag === 'Flash') _flash = tag.raw._content;
                }
            }

            if(exif.camera) camara = <p className="lead" id="camara"><strong>Capturado con:</strong> <span>{exif.camera}</span></p>;
            if(_exposicion) exposicion = <p className="lead" id="exposicion"><strong>Exposición:</strong> <span>{_exposicion}</span></p>;
            if(_apertura) apertura = <p className="lead" id="apertura"><strong>Apertura:</strong> <span>{_apertura}</span></p>;
            if(_iso) iso = <p className="lead" id="iso"><strong>ISO:</strong> <span>{_iso}</span></p>;
            if(_distFocal) distanciaFocal = <p className="lead" id="dist-focal"><strong>Dist. Focal:</strong> <span>{_distFocal}</span></p>;
            if(_flash) {
                if(_flash.indexOf('Off') !== -1) _flash = 'Apagado, no se disparó';
                else _flash = 'Encendido, se disparó';
                flash = <p className="lead" id="flash"><strong>Flash:</strong> <span>{_flash}</span></p>;
            }
        }

        const imageInfoClasses = [ 'image-info', 'col-sm-4', 'd-none', 'd-sm-block' ];
        if(!showInfoPanel) imageInfoClasses.push('min-size');
        const imageViewClasses = [ 'image-view', 'col-sm-8', 'col-12' ];
        if(!showInfoPanel) imageViewClasses.push('max-size');
        const leftButtonLeft = !showInfoPanel ? window.$(window).width() - 70 : null;

        const nnextt = loadMorePhotosAndNext.bind(null, userId, photosetId, perPage, page);

        const nopeWithVibration = () => window.navigator.vibrate(150);

        return (
            <div className={`photo-overlay ${show ? 'show' : ''}`}>
                <div className="photo-overlay-container" role="document" style={{height: "100%"}}>
                    { isZoomed ? <ZoomImageOverlay photo={currentPhoto} onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} /> : null }
                    <Swipeable onSwipedLeft={ hasNext ? next : (hasNextPage ? nnextt : nopeWithVibration ) }
                               onSwipedRight={ hasPrev ? prev : nopeWithVibration }
                               onTap={this.onTap.bind(this)}
                               className={imageViewClasses.join(' ')}>
                        <img src={flickr.buildLargePhotoUrl(photo)} onLoad={photoIsLoaded} style={{display: "none"}} alt={photo.title} />
                        { !changeAnimation.animating ?
                        <div className="img" id="img" style={{backgroundImage: `url(${flickr.buildLargePhotoUrl(photo)})`}}></div>
                        :
                        <div className="img" id="img" style={changeAnimation.style1} />
                        }
                        { !changeAnimation.animating ?
                        <div className="img" id="img2"></div>    
                        :
                        <div className="img" id="img2" style={changeAnimation.style2} />
                        }

                        <div className="buttons-container">
                            <div className="buttons">
                                <button type="button" className="close" id="close" onClick={close}>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"></i>
                                        <i className="fa fa-close fa-stack-1x"></i>
                                    </span>
                                </button>
                                <button type="button" className="close d-none d-sm-block" id="info" onClick={toggleInfoPanel}>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"></i>
                                        <i className="fa fa-info fa-stack-1x"></i>
                                    </span>
                                </button>
                                <button type="button" className="close d-none d-sm-block" id="zoom" onClick={zoom.bind(null,photo)}>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"></i>
                                        <i className="fa fa-search-plus fa-stack-1x"></i>
                                    </span>
                                </button>
                            </div>

                            { hasPrev ? <div className="change-photo prev d-none d-sm-block" onClick={prev}>
                                <i className="fa fa-chevron-left fa-3x"></i>
                            </div> : null }
                            { hasNext ? <div className="change-photo next d-none d-sm-block" onClick={next} style={{left: leftButtonLeft}}>
                                <i className="fa fa-chevron-right fa-3x"></i>
                            </div> : null }
                            { !hasNext && hasNextPage ? <div className="change-photo next next-page d-none d-sm-block"
                                onClick={nnextt} style={{left: leftButtonLeft}}>
                                <i className="fa fa-chevron-right fa-3x"></i>
                            </div> : null }
                        </div>
                    </Swipeable>

                    <div className={imageInfoClasses.join(' ')}>
                        <div className="page-header">
                            <h2>{ photo.title }</h2>
                            {descripcion}
                        </div>

                        {fecha}
                        {camara}
                        {exposicion}
                        {apertura}
                        {iso}
                        {distanciaFocal}
                        {flash}
                        {enlace}
                    </div>
                </div>
            </div>
        );
    }
}