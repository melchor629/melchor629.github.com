import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import App from './containers/App';
import galleryApp from './reducers';

let store = createStore(galleryApp, applyMiddleware(ReduxThunk));

render(
    <Provider store={store}>
        <App userId='142458589@N03' photosetId='72157667134867210' perPage={12} />
    </Provider>,
    document.getElementById('root')
);