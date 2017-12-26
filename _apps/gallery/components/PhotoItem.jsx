import React from 'react';
import PropTypes from 'prop-types';

const PhotoItem = ({ photo, onClick }) =>
    <div className="col-6 col-sm-4 col-md-3">
        <div onClick={onClick} style={{backgroundImage: `url(${photo.url})`}}>
            <div className="square">
                <div className="square-content photo-title"> {photo.title} </div>
            </div>
        </div>
    </div>
;

PhotoItem.propTypes = {
    photo: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default PhotoItem;