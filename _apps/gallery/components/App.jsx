import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.jsx';
import PhotoItem from '../containers/PhotoItem.js';
import Overlay from '../containers/Overlay.js';
import { loadFirstPhotos, loadMorePhotos } from '../actions/index.js';

class App extends Component {
    static propTypes = {
        photos: PropTypes.array.isRequired,
        primary: PropTypes.string,
        userId: PropTypes.string.isRequired,
        photosetId: PropTypes.string.isRequired,
        perPage: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        detailedPhoto: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        loadingPhotosList: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { dispatch, userId, photosetId, perPage, page } = this.props;
        dispatch(loadFirstPhotos(userId, photosetId, perPage, page));
        //No se me ocurre mejor idea para esto :(
        $(window).scroll(() => {
            const bottom = $(document).scrollTop() + $(window).height();
            const sizeOfPage = document.body.scrollHeight;
            if(sizeOfPage - bottom < 100 && !this.props.loadingPhotosList) {
                const { dispatch, userId, photosetId, perPage, page, totalPages } = this.props;
                dispatch(loadMorePhotos(userId, photosetId, perPage, page));
                if(page + 1 === totalPages) {
                    $(window).off('scroll');
                }
            }
        });
    }

    componentWillUnmount() {
        $(window).off('scroll');
    }

    render() {
        const { photos, primary, detailedPhoto, loading, page, totalPages, userId, photosetId, perPage } = this.props;
        let spinnerClasses = [ "load-spin-container", "d-flex", "justify-content-center"];
        if(loading) spinnerClasses.push('overlay-loading');
        else if(page === totalPages) spinnerClasses = [ 'd-none' ];
        //Loading spinner from http://codepen.io/jczimm/pen/vEBpoL
        return (
        <div>
            <Header photo={primary} />

            <div className="row gallery">
                { photos.map(photo => <PhotoItem photo={photo} key={photo.id} />) }
            </div>

            <div className={spinnerClasses.join(' ')}>
                <div className="load-spin">
                    <svg className="load-spin-inner" viewBox="25 25 50 50">
                        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="6" strokeMiterlimit="10"/>
                    </svg>
                </div>
            </div>

            { detailedPhoto ? <Overlay userId={userId} photosetId={photosetId} perPage={perPage} /> : null }
        </div>
        );
    }
};

export default App;