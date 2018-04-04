import React from 'react';
import ReactDOM from 'react-dom';
import Posts from './posts.jsx';

const $ = window.$;

$.get('/assets/posts.json').success((data) => {
    data.pop();
    ReactDOM.render(
        <Posts entries={data} />,
        document.querySelector('.mainPage')
    );
});

$('#share-fb').click(() => {
    window.FB.ui({
        method: 'share',
        href: window.location.toString(),
        quote: $('title').text(),
    }, (response) =>
        console.log(response)
    );
});

$('.circle-button.back').click(() => window.location.hash = "");
$('.circle-button-group.share').click(() => $('#share-modal').modal('toggle'));