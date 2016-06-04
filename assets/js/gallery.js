(function($) {
    "use strict";

    if($ === undefined) {
        if(jQuery === undefined) {
            throw ("You need jQuery before running this script");
        } else {
            window.$ = jQuery;
            $ = jQuery;
        }
    }

    var loadCss = function(e, href) {
        var link = document.createElement('link');
        link.href = href;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        $(e).append(link);
    };

    var CuriousPromise = function CuriousPromise(numOfDoneCalls, cbk) {
        this.num = numOfDoneCalls;
        this.cbk = cbk;
        this.doneCalls = 0;
    };

    CuriousPromise.prototype.done = function done() {
        this.doneCalls++;
        if(this.num === this.doneCalls) {
            this.cbk();
        }
    };

    var loadGalleryScripts = function() {
        var promise = new CuriousPromise(6, function() {
            $.get('https://raw.githubusercontent.com/melchor629/melchor629.github.com/master/photo_gallery.html')
                .success(function(html) {
                    $('html').css('height', '100%');
                    $('body').css('height', '100%');
                    html = html.substr(270).replace('style="position:absolute"', 'style="position:relative;top:0"');
                    window.Gallery = function(obj) {
                        loadCss($(obj.container), 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css');
                        loadCss($(obj.container), 'http://melchor9000.me/assets/css/gallery.css');
                        $(obj.container).append(html);
                        return new FlickrGallery(obj);
                    };
                    $(document).trigger('gallery:ready', window.Gallery);
                });
        });
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.2.0/imagesloaded.pkgd.min.js', promise.done.bind(promise));
        $.getScript("http://melchor9000.me/assets/js/jquery.mobile.custom.min.js", promise.done.bind(promise));
        $.getScript("http://melchor9000.me/assets/js/parallax.js", promise.done.bind(promise));
        $.getScript("http://melchor9000.me/assets/js/flickrApi.js", promise.done.bind(promise));
        $.getScript("http://melchor9000.me/assets/js/timer.js", promise.done.bind(promise));
        $.getScript("http://melchor9000.me/assets/js/photoGallery.js", promise.done.bind(promise));
    };

    $(document).ready(function() {
        var load = function(container) {
            $(container).html('<div style="text-align:center"><h1>Cargando galería...</h1></div>');
            if($.fn.affix === undefined) {
                loadCss('head', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
                $.getScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js', loadGalleryScripts);
            } else {
                loadGalleryScripts();
            }

            $(document).on('gallery:ready', function() {
                $(container).empty();
                var user = $(container).data('flickr-user');
                var gallery = $(container).data('flickr-album');
                window.galleryInstance = Gallery({
                    userId: user,
                    photosetId: gallery,
                    container: $(container)
                });
            });
        };

        if($('.gallery-container').size() === 1) load($('.gallery-container')); else
        if($('.flickr-gallery-container').size() === 1) load($('.flickr-gallery-container')); else
        if($('#flickr').size() === 1) load($('#flickr')); else {
            window.loadGallery = function() {
                if($.fn.affix === undefined) {
                    loadCss('head', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
                    $.getScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js', loadGalleryScripts);
                } else {
                    loadGalleryScripts();
                }
            };
        }
    });

})($);
