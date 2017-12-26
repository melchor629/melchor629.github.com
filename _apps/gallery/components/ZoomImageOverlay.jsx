import React from 'react';
import PropTypes from 'prop-types';

const ZoomImageOverlay = ({ photo, onTouchStart, onTouchEnd }) => {
    const styles = { width: photo.zoomSize.w, height: photo.zoomSize.h, backgroundImage: `url(${photo.zoomUrl})` };
    return (<div className="zoom-container" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="zoom-image-view" style={styles}></div>
        <div className="zoom-image-info">
            ESC para cerrar<br />
            Mantener apretado para cerrar
        </div>
    </div>);
};

ZoomImageOverlay.propTypes = {
    photo: PropTypes.object.isRequired,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func
};

export default ZoomImageOverlay;
