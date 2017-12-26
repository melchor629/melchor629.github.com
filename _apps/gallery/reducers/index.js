import { combineReducers } from 'redux';
import { MORE_PHOTOS_LOADED, FIRST_PHOTOS_LOADED, SHOW_DETAILED, HIDE_DETAILED, LOADING_PHOTO_DETAIL, LOADED_PHOTO_DETAIL, NEXT_DETAILED, PREV_DETAILED, HIDDEN_DETAILED, TOGGLE_INFO_PANEL, LOADED_PHOTO_IMAGE, LOADING_PHOTO_IMAGE, LOADING_MORE_PHOTOS, ENABLE_PHOTO_ZOOM, DISABLE_PHOTO_ZOOM } from '../actions';

const linkedPhotos = photos => photos.map((photo, i) => ({
    photo,
    next: i < photos.length ? photos[i+1] : null,
    prev: i > 0 ? photos[i-1] : null
}));

const find = (photos, id) => photos.filter(p => p.photo.id === id)[0];

const initialState = {
    primary: null,
    totalPages: 0,
    photos: [],
    page: 1,

    detailedPhoto: undefined,
    zoomEnabled: false,
    hasNext: false,
    hasPrev: false,
    showOverlayEffect: false,
    showInfoPanel: true,

    loadingPhotos: true,
    loading: false,
    loadingPhoto: false
}

const galleryList = (state = initialState, action) => {
    switch(action.type) {
        case MORE_PHOTOS_LOADED:
            return { ...state, photos: [...state.photos, ...action.photos], page: state.page + 1, loadingPhotos: false };
        
        case FIRST_PHOTOS_LOADED:
            return { ...state, primary: action.primary, totalPages: action.totalPages, photos: action.photos, page: 1, loadingPhotos: false };

        case LOADING_MORE_PHOTOS:
            return { ...state, loadingPhotos: true };

        case SHOW_DETAILED:
            return {
                ...state,
                detailedPhoto: action.photo,
                zoomEnabled: false,
                hasNext: !!find(linkedPhotos(state.photos), action.photo).next,
                hasPrev: !!find(linkedPhotos(state.photos), action.photo).prev
            };
        
        case HIDE_DETAILED:
            return { ...state, showOverlayEffect: false };
        
        case HIDDEN_DETAILED:
            return { ...state, detailedPhoto: undefined, zoomEnabled: false, hasNext: false, hasPrev: false };
        
        case LOADING_PHOTO_DETAIL:
            return { ...state, loading: true };
        
        case LOADED_PHOTO_DETAIL:
            return {
                ...state,
                loading: false,
                photos: state.photos.map(photo => {
                    return photo.id === state.detailedPhoto ? { ...photo, ...action.extra } : photo
                })
            };
        
        case LOADING_PHOTO_IMAGE:
            return { ...state, loadingPhoto: true };
        
        case LOADED_PHOTO_IMAGE:
            return { ...state, loadingPhoto: false };
        
        case NEXT_DETAILED:
            let photos = linkedPhotos(state.photos);
            let next = find(photos, state.detailedPhoto).next;
            return {
                ...state,
                detailedPhoto: next.id,
                hasNext: !!find(photos, next.id).next,
                hasPrev: true
            }
        
        case PREV_DETAILED:
            photos = linkedPhotos(state.photos);
            let prev = find(photos, state.detailedPhoto).prev;
            return {
                ...state,
                detailedPhoto: prev.id,
                hasNext: true,
                hasPrev: !!find(photos, prev.id).prev
            }
        
        case TOGGLE_INFO_PANEL:
            return { ...state, showInfoPanel: !state.showInfoPanel };
        
        case 'TOGGLE_SHOW': return { ...state, showOverlayEffect: true };

        case ENABLE_PHOTO_ZOOM:
            return {
                ...state,
                zoomEnabled: true,
                photos: state.photos.map(photo => photo.id === action.photo.id ?
                    { ...photo, zoomUrl: action.zoomUrl, zoomSize: action.zoomSize } : photo)
            }
        
        case DISABLE_PHOTO_ZOOM:
            return { ...state, zoomEnabled: false };

        default: return state;
    }
};

const galleryApp = combineReducers({
    galleryList
});
  
export default galleryApp