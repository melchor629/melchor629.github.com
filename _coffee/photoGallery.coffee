class FlickrGallery
    constructor: (opt) ->
        @photosPerPage = opt.photosPerPage || 12
        @container = opt.container || $('.gallery-container') || $('#gallery-container')
        @userId = opt.userId
        @photosetId = opt.photosetId

        if not @userId then throw "userId is not set for FlickrGallery"
        if not @photosetId then throw "photosetId is not set for FlickrGallery"
        if not @container then throw "Container not found, select a valid one"

        @page = 0
        @totalPages = 1
        @loadingMorePhotos = false
        @photos = []
        @photoInfo = {}
        @currentPhoto = null

        @_setUpListeners()
        @loadMorePhotos()

    loadMorePhotos: ->
        if @page is @totalPages
            $('.load-spin-container').hide()
            return

        @loadingMorePhotos = true
        @page++
        flickr.photosets.getPhotos({user_id: @userId, photoset_id: @photosetId, per_page: @photosPerPage, page: @page}, (json) =>
            @totalPages = json.photoset.pages
            photoNum = 0
            for photo in json.photoset.photo
                @photos.push photo

                $('.gallery').append(
                    $('<div/>')
                        .addClass('col-xs-6')
                        .addClass('col-sm-4')
                        .addClass('col-md-3')
                        .append(
                            $('<div/>').css(
                                'background-image': "url(#{flickr.buildPhotoUrl(photo)})"
                            ).append(
                                $('<div/>').append(
                                    $('<p/>').text(photo.title).addClass('photo-title')
                                )
                            ).data('num', @photos.length - 1)
                            .click((e) =>
                                e.preventDefault()
                                @showPhoto $(e.delegateTarget).data('num')
                                false
                            )
                        )
                    )
                photoNum++

            $(window).resize()
            @loadingMorePhotos = false
        )

    showPhoto: (num) ->
        $('body').css('overflow', 'hidden')
        $('.photo-overlay').find('img').attr('src', flickr.buildLargePhotoUrl(@photos[num]))
        $('.photo-overlay').find('.img').css('background-image', "url('#{flickr.buildLargePhotoUrl(@photos[num])}')")
        $('.photo-overlay').find('.image-info').find('h2').text(@photos[num].title)
        $('.photo-overlay').removeClass('hide').addClass('show')
        @_loadPhotoImage @photos[num]
        @currentPhoto = num

        if @currentPhoto is 0
            $('.photo-overlay').find('div.prev').hide()
        else
            $('.photo-overlay').find('div.prev').show()
        if @currentPhoto is @photos.length - 1
            $('.photo-overlay').find('div.next').hide()
        else
            $('.photo-overlay').find('div.next').show()

    hideOverlay: ->
        @currentPhoto = null
        $('body').css('overflow', 'inherit')
        $('.photo-overlay').removeClass('show')
        setTimeout(->
            $('.photo-overlay').addClass('hide')
            $('.photo-overlay').find('#fecha').find('span').text ''
            $('.photo-overlay').find('#camara').find('span').text ''
        , 500)

    toggleInfoPanel: ->
        if $('.photo-overlay').find('.image-info').hasClass 'min-size'
            $('.photo-overlay').find('.image-info').removeClass 'min-size'
            $('.photo-overlay').find('.image-view').removeClass 'max-size'
        else
            $('.photo-overlay').find('.image-info').addClass 'min-size'
            $('.photo-overlay').find('.image-view').addClass 'max-size'

    nextImage: ->
        if @currentPhoto isnt null and @currentPhoto < @photos.length - 1
            @showPhoto @currentPhoto + 1

    previousImage: ->
        if @currentPhoto isnt null and @currentPhoto > 0
            @showPhoto @currentPhoto - 1

    _loadPhotoImage: (photo) ->
        infoFunc = (data) ->
            if data.stat is "ok"
                sd = data.photo.dates.taken.split(/[-: ]/)
                date = new Date(sd[0], sd[1], sd[2], sd[3], sd[4], sd[5], 0)
                $('.photo-overlay').find('#descripcion').text(data.photo.description._content).show()
                $('.photo-overlay').find('#fecha').show().find('span').text(date.toLocaleString())
                $('.photo-overlay').find('#enlace').find('a').attr('href', data.photo.urls.url[0]._content).show()
            else
                $('.photo-overlay').find('#descripcion').hide()
                $('.photo-overlay').find('#fecha').hide()
                $('.photo-overlay').find('#enlace').hide()

        exifFunc = (data) ->
            exposicion = null
            apertura = null
            iso = null
            distFocal = null
            flash = null

            for tag in data.photo.exif
                if tag.tagspace is 'ExifIFD'
                    if tag.tag is 'ExposureTime' then exposicion = tag.raw._content
                    if tag.tag is 'FNumber' then apertura = tag.raw._content
                    if tag.tag is 'ISO' then iso = tag.raw._content
                    if tag.tag is 'FocalLength' then distFocal = tag.raw._content
                    if tag.tag is 'Flash' then flash = tag.raw._content

            if data.stat is "ok"
                $('.photo-overlay').find('#camara').show().find('span').text data.photo.camera
            else
                $('.photo-overlay').find('#camara').hide()
            if exposicion
                $('.photo-overlay').find('#exposicion').show().find('span').text exposicion
            else
                $('.photo-overlay').find('#exposicion').hide()
            if apertura
                $('.photo-overlay').find('#apertura').show().find('span').text apertura
            else
                $('.photo-overlay').find('#apertura').hide()
            if iso
                $('.photo-overlay').find('#iso').show().find('span').text iso
            else
                $('.photo-overlay').find('#iso').hide()
            if distFocal
                $('.photo-overlay').find('#dist-focal').show().find('span').text distFocal
            else
                $('.photo-overlay').find('#dist-focal').hide()
            if flash
                if flash.indexOf 'Off' isnt -1
                    $('.photo-overlay').find('#flash').show().find('span').text 'Apagado, no se disparó'
                else
                    $('.photo-overlay').find('#flash').show().find('span').text 'Encendido, se disparó'
            else
                $('.photo-overlay').find('#flash').hide()

        if @photoInfo[photo.id] and @photoInfo[photo.id].info
            infoFunc @photoInfo[photo.id].info
        else
            flickr.photos.getInfo {photo_id: photo.id, secret: photo.secret}, (data) =>
                infoFunc data
                if @photoInfo[photo.id] then @photoInfo[photo.id].info = data else @photoInfo[photo.id] = {info:data}

        if @photoInfo[photo.id] and @photoInfo[photo.id].exif
            exifFunc @photoInfo[photo.id].exif
        else
            flickr.photos.getExif {photo_id: photo.id, secret: photo.secret}, (data) =>
                exifFunc data
                if @photoInfo[photo.id] then @photoInfo[photo.id].exif = data else @photoInfo[photo.id] = {exif:data}

    _setUpListeners: ->
        $(window).scroll( =>
            bottom = $(window).scrollTop() + $(window).height()
            sizeOfPage = $('#wrap').height()

            if sizeOfPage - bottom < 100 and not @loadingMorePhotos
                @loadMorePhotos()
        )

        $(window).resize( ->
            $('.gallery > div > div').each((k, v) ->
                $(v).height($(v).width())
            )
        )

        $(window).keyup((e) =>
            if $('.photo-overlay').hasClass('show')
                if e.keyCode is 27 #ESC
                    @hideOverlay()
                else if e.keyCode is 39 #Derecha
                    @nextImage()
                else if e.keyCode is 37 #Izquierda
                    @previousImage()
                else if e.keyCode is 32 #Espacio
                    console.log null
        )

        $('.image-view').mousemove( =>
            $('.photo-overlay').find('.buttons-container').removeClass('no-move')
            @_timer.restart()
        )

        @_timer = new Timer(3000, =>
            $('.photo-overlay').find('.buttons-container').addClass('no-move')
        , true)

        $('.photo-overlay').find('#close').click(@hideOverlay.bind(this))
        .parent().find('#info').click(@toggleInfoPanel.bind(this))
        $('.photo-overlay').find('div.next').click(@nextImage.bind(this))
        $('.photo-overlay').find('div.prev').click(@previousImage.bind(this))
        $('.image-view').swipeleft(@nextImage.bind(this))
        $('.image-view').swiperight(@previousImage.bind(this))

window.melchordegaleria = new FlickrGallery
    userId: '107436442@N02'
    photosetId: '72157646899786200'
    container: $('.container')
