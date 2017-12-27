import { connect } from 'react-redux';
import Overlay from '../components/Overlay.jsx';
import { loadDetailedPhoto, nextDetailed, prevDetailed, hideDetailed, toggleInfoPanel, loadingPhotoImage, loadedPhotoImage, loadMorePhotos, enablePhotoZoom, disablePhotoZoom } from '../actions';

const mapStateToProps = ({ galleryList }, ownProps) => {
    return {
        currentPhoto: galleryList.photos.filter(photo => photo.id === galleryList.detailedPhoto)[0],
        isZoomed: galleryList.zoomEnabled,
        hasNext: galleryList.hasNext,
        hasPrev: galleryList.hasPrev,
        show: galleryList.showOverlayEffect,
        showInfoPanel: galleryList.showInfoPanel || galleryList.showInfoPanel === undefined,
        hasNextPage: galleryList.page < galleryList.totalPages,
        page: galleryList.page,
        changeAnimation: galleryList.animation
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadFullInfoForPhoto: photo => dispatch(loadDetailedPhoto(photo)),
        toggleShow: () => dispatch({ type: 'TOGGLE_SHOW' }),
        toggleInfoPanel: () => dispatch(toggleInfoPanel()),
        photoIsLoading: () => dispatch(loadingPhotoImage()),
        photoIsLoaded: () => dispatch(loadedPhotoImage()),
        loadMorePhotosAndNext: (u, p, pp, page) => dispatch(loadMorePhotos(u, p, pp, page, true)),
        next: () => dispatch(nextDetailed()),
        prev: () => dispatch(prevDetailed()),
        close: () => dispatch(hideDetailed()),
        zoom: photo => dispatch(enablePhotoZoom(photo)),
        zoomOff: () => dispatch(disablePhotoZoom())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Overlay);
