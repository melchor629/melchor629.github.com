import { connect } from 'react-redux';
import { showDetailed } from '../actions/index';
import PhotoItem from '../components/PhotoItem.jsx';

const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(showDetailed(ownProps.photo))
});

const ContainerPhotoItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PhotoItem);

export default ContainerPhotoItem;
