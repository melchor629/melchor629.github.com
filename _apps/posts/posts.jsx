import React from 'react';
import Entry from './entry.jsx';

const twitterIntentUrl = (username, url, text) =>
    `http://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=${username}&related=${username}%3AMelchor%20Garau%20Madrigal`

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entries: props.entries, showing: 3, post: null, topPos: null };
    }

    render() {
        if(this.state.post === null) {
            let cols = $(window).width() >= 1170 ? 3 : ($(window).width() >= 768 ? 2 : 1);
            let entries = this.state.entries.slice(0, this.state.showing).map((entry, i) => <Entry entry={entry} key={i} />);
            let entries1 = entries.filter((v, i) => i % cols === 0);
            let entries2 = entries.filter((v, i) => i % cols === 1);
            let entries3 = entries.filter((v, i) => i % cols === 2);
            if(this.state.topPos !== null) {
                setTimeout(() => {
                    window.scrollTo(window.scrollX, this.state.topPos);
                    this.setState({ topPos: null });
                });
            }
            $('title').text('Posts - The abode of melchor9000');
            return (
                <div className="posts_container row">
                    <div className="col-sm-6 col-lg-4">{entries1}</div>
                    {cols >= 2 && <div className="col-sm-6 col-lg-4">{entries2}</div>}
                    {cols >= 3 && <div className="col-sm-6 col-lg-4">{entries3}</div>}
                </div>
            );
        } else {
            setTimeout(() => {
                window.scrollTo(window.scrollX, 0);
                $('img').attr('data-action', 'zoom');
                $('.circle-button').css('opacity', 1).removeClass('hide').addClass('show')
            });
            $('title').text(`${this.state.post.titulo} - The abode of melchor9000`);
            return (
                <div className="postPage" dangerouslySetInnerHTML={{__html:this.state.post.html}}></div>
            );
        }
    }

    showMore(step = 3) {
        this.setState((prev, props) => ({
            showing: prev.showing + step
        }));
    }

    componentDidMount() {
        $(window).scroll((() => {
            if(this.state.post === null && this.state.showing < this.state.entries.length) {
                let abajoPos = window.scrollY + $(window).height();
                if(abajoPos > $('.posts_container').height() + 70) {
                    this.showMore();
                    if(this.state.showing >= this.state.entries.length) {
                        $(window).off('scroll');
                    }
                }
            }
        }).bind(this)).resize((() => {
            this.setState((prev, props) => ({ showing: prev.showing + 0 }));
            $(window).scroll();
        }).bind(this)).scroll();

        window.addEventListener("hashchange", (e) => {
            let oldHash = e.oldURL;
            let newHash = e.newURL;
            oldHash = oldHash.indexOf('#') !== -1 ? oldHash.substr(oldHash.indexOf('#') + 1) : '';
            newHash = newHash.indexOf('#') !== -1 ? newHash.substr(newHash.indexOf('#') + 1) : '';
            if(oldHash === '') {
                let titulo = this.state.entries.filter((v) => v.url === newHash)[0].titulo;
                $.get(newHash, (html) => {
                    this.setState((prev, props) => ({ post: { html, titulo }, topPos: window.scrollY }));
                });
            } else if(newHash === '') {
                this.setState((prev, props) => ({ post: null }));
                $('.circle-button').removeClass('show').addClass('hide')
            } else {
                //¿Algo mas?
                let titulo = this.state.entries.filter((v) => v.url === newHash)[0].titulo;
                $.get(newHash, (html) => {
                    this.setState((prev, props) => ({ post: { html, titulo }, topPos: window.scrollY }));
                });
            }
        }, false);

        if(window.location.hash !== '') {
            window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: window.location, newURL: window.location }));
        }

        $('#share-tw').click(() => window.open(twitterIntentUrl('melchor629', window.location, `"${this.state.post.titulo}"`)));
        $('#share-email').click(() => window.location = (`mailto:?subject=${encodeURIComponent(this.state.post.titulo)}%20-%20melchor9000&body=Lee%20la%20entrada%20de%20la%20morada%20de%20melchor9000:%0A%09${encodeURIComponent(this.state.post.titulo + "\n\t" + window.location)}`));
        $('#share-wa').click(() => window.location = `whatsapp://send?text=${encodeURIComponent(this.state.post.titulo+": "+window.location)}`);
        if(!/ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase())) $('#share-wa').hide();
    }
}

export default Posts;