import { connect } from 'react-redux';
import App from '../components/App.jsx';

const mapStateToProps = ({ galleryList }, ownProps) => {
    return {
        primary: galleryList.primary,
        photos: galleryList.photos,
        page: galleryList.page,
        totalPages: galleryList.totalPages,
        detailedPhoto: galleryList.detailedPhoto,
        loading: galleryList.loading || galleryList.loadingPhoto,
        loadingPhotosList: galleryList.loadingPhotos
    }
};

export default connect(
    mapStateToProps
)(App);
