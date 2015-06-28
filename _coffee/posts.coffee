translateDay = (day) ->
    dia = day
    switch(day)
        when 'Mon' then dia = 'Lun'
        when 'Tue' then dia = 'Mar'
        when 'Wed' then dia = 'Mié'
        when 'Thu' then dia = 'Jue'
        when 'Fri' then dia = 'Vié'
        when 'Sat' then dia = 'Sáb'
        when 'Sun' then dia = 'Dom'
    dia

translateMonth = (month) ->
    mes = month
    switch(month)
        when 'Jan' then mes = 'Ene'
        when 'Apr' then mes = 'Abr'
        when 'Aug' then mes = 'Ago'
        when 'Dec' then mes = 'Dic'
    mes

postsInfo = undefined

showReturnIcon = () ->
    $('.circle-button').css('opacity', 1).removeClass('hide').addClass('show')

hideReturnIcon = ->
    $('.circle-button').removeClass('show').addClass('hide')
    setTimeout () ->
        $('.circle-button').css('opacity', 0)
    , 1000

smoothScroll = (from, to, cbk) ->
    position = {x: 0, y: from}
    target = {x: 0, y: to}
    done = false
    tween = new TWEEN.Tween(position).to target, if from-to is 0 then 0 else Math.log2(Math.abs(from - to))*100
    tween.easing TWEEN.Easing.Cubic.InOut
    tween.onUpdate ->
        window.scrollTo position.x, position.y
    tween.onComplete ->
        done = true
        cbk() if cbk?
    tween.start()
    update = ->
        TWEEN.update()
        if not done
            window.requestAnimationFrame update
    update()

oldScrollPos = 0
loadPost = (num) ->
    num = Number num
    post = postsInfo[num]
    oldScrollPos = window.scrollY
    smoothScroll oldScrollPos, 0, ->
        $('.mainPage').removeClass('show').addClass '_hide'
        showReturnIcon()
        $.get post.url, (html) ->
            $('.postPage').append(html).removeClass('_hide').addClass('show').css 'position', 'absolute'
            window.location.hash = "#" + post.url
            $('#share-tw a').attr 'href', twitterIntentUrl 'melchor629', window.location, "\"#{post.titulo}\""
            $('title').text "#{post.titulo} - The abode of melchor9000"

            setTimeout ->
                $('.mainPage').hide()
                $('.postPage').css('position', 'relative')
            , 500
        .fail (error) ->
            alert 'Post no existente'
            returnMainPage()

returnMainPage = ->
    $('.postPage').removeClass('show').addClass('_hide')
    $('.mainPage').removeClass('_hide').addClass('show').show()
    hideReturnIcon()
    window.location.hash = ""
    setTimeout ->
        $('.postPage').empty()
        smoothScroll(0, oldScrollPos)
        $('title').text "Posts - The abode of melchor9000"
    , 500

twitterIntentUrl = (username, url, text) ->
    return "http://twitter.com/intent/tweet?text=#{encodeURIComponent(text)}&
        url=#{encodeURIComponent(url)}&via=#{username}&related=#{username}%3AMelchor%20Garau%20Madrigal"

findNum = (url) ->
    for i in [0..postsInfo.length]
        if postsInfo[i].url is url
            return i

esVisible = (v) ->
    scrollTop = window.scrollY
    height = $(window).height()
    position = 80 + $(v).position().top
    postHeight = $(v).height()
    #console.log "#{position} < #{scrollTop + height} and #{position} >= #{scrollTop}"
    position < scrollTop + height and position + postHeight >= scrollTop
    #position < scrollTop + height

añadirPosts = (linea) ->
    numOfPostsPerLine = 1
    if $(window).width() >= 768 and $(window).width() <= 1199
        numOfPostsPerLine = 2
    else if $(window).width() >= 1200
        numOfPostsPerLine = 3

    postsInfo.linea = linea
    postsInfo.cargados = (linea + 1) * numOfPostsPerLine
    if postsInfo.cargados > postsInfo.length
        postsInfo.cargados = postsInfo.length
        int = [linea * numOfPostsPerLine..postsInfo.length - 1]
    else
        int = [linea * numOfPostsPerLine..(linea + 1) * numOfPostsPerLine - 1]
    for i in int
        añadirPost i

añadirPost = (num) ->
    post = postsInfo[num]
    postEntry = $('<div/>').addClass('post_entry col-sm-6 col-lg-4').data('num', num);
    innerOuter = $('<div/>').addClass('inner-outer')
    postThumb = $('<div/>').addClass('post_thumb').css('background-image', "url('#{post.img}')")
    postThumbLink = $('<a/>').attr('href', post.url).append($('<div/>').addClass('cover'))
        .addClass('post_url')
    title = $('<h3/>').addClass('text-center post_title')
    titleLink = $('<a/>').attr('href', post.url).addClass('post_url').text(post.titulo)
    fechaPartes = /^(\w{3}), \d\d (\w{3}).+$/i.exec post.fecha
    dia = translateDay fechaPartes[1]
    mes = translateMonth fechaPartes[2]
    fecha = post.fecha.replace(fechaPartes[1], dia).replace(fechaPartes[2], mes)
    info = $('<div/>').addClass('post_info')
    .append("<small><p class=\"text-right post_created_time\">#{fecha}</p></small>")

    postThumb.append postThumbLink
    title.append titleLink
    innerOuter.append(postThumb).append(title).append(info)
    postEntry.append(innerOuter)
    postEntry.find('.post_url').click (e) ->
        e.preventDefault()
        loadPost $(this).closest('.post_entry').data('num')
        false
    $('.posts_container').append(postEntry)

(->
    $('.circle-button.back').click ->
        returnMainPage()
        false

    #Efecto para share
    enterT = undefined; leaveT = undefined; tapped = false
    $('.circle-button-group.share').mouseenter ->
        $(this).find('.circle-button-extra').css('display', 'block')
        clearTimeout leaveT
        enterT = setTimeout =>
            $(this).find('.circle-button-extra').addClass('hover')
                .animate({top: '-45px'}, 300);
        , 20
    .mouseleave ->
        $(this).find('.circle-button-extra').removeClass('hover').each (k,v) ->
            $(v).animate({top: "#{-73 - 48 * k}px"}, 300)
        clearTimeout enterT
        leaveT = setTimeout =>
            $(this).find('.circle-button-extra').css('display', 'none')
        , 333
    $('.circle-button.share').on 'tap', ->
        if tapped
            $('.circle-button-group.share').trigger 'mouseleave'
            tapped = false
        else
            $('.circle-button-group.share').trigger 'mouseenter'
            tapped = true

    #Mejorar efecto de aparicion de los elementos de share
    $('.circle-button-group.share .circle-button-extra').each (k,v) ->
        $(v).css('top', "#{-73 - 48 * k}px")

    $('#share-fb').click (e) ->
        FB.ui
            method: 'share'
            href: window.location.toString()
        , (response) ->
            console.log response

    $.get('/assets/posts.json').success (data) ->
        postsInfo = data
        postsInfo.pop()
        añadirPosts(0)
        $(window).scroll()
        if window.location.hash isnt ""
            loadPost findNum decodeURIComponent window.location.hash.substr 1

    $(window).scroll (e) ->
        abajoPos = window.scrollY + $(window).height()
        if abajoPos > $('.posts_container').height() + 70 and postsInfo.length isnt postsInfo.cargados
            añadirPosts postsInfo.linea + 1
        else if postsInfo.length is postsInfo.cargados
            $(window).off 'scroll'
            $(window).off 'resize'
    $(window).resize (e) ->
        $(window).scroll()

)()
