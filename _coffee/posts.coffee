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

showReturnIcon = () ->
    $('.circle-button').css('opacity', 1).removeClass('hide').addClass('show')

hideReturnIcon = ->
    $('.circle-button').removeClass('show').addClass('hide')
    setTimeout () ->
        $('.circle-button').css('opacity', 0)
    , 1000

smoothScroll = (from, to, duration, cbk) ->
    position = {x: 0, y: from}
    target = {x: 0, y: to}
    done = false
    tween = new TWEEN.Tween(position).to target, duration
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
loadPost = (url) ->
    oldScrollPos = window.scrollY
    smoothScroll oldScrollPos, 0, 500, ->
        $('.mainPage').removeClass('show').addClass '_hide'
        showReturnIcon()
        $.get url, (html) ->
            $('.postPage').append(html).removeClass('_hide').addClass('show').css 'position', 'absolute'

            setTimeout ->
                $('.mainPage').hide()
                $('.postPage').css('position', 'relative')
            , 500

returnMainPage = ->
    $('.postPage').removeClass('show').addClass('_hide')
    $('.mainPage').removeClass('_hide').addClass('show').show()
    hideReturnIcon()
    setTimeout ->
        $('.postPage').empty()
        smoothScroll(0, oldScrollPos, 1000)
    , 500

twitterIntentUrl = (username, url, text) ->
    return "http://twitter.com/intent/tweet?text=#{encodeURIComponent(text)}&
        url=#{encodeURIComponent(url)}&via=#{username}&related=#{username}%3AMelchor%20Garau%20Madrigal"

(->
    $('.post_created_time').each (k, v) ->
        v = $ v
        parts = /^(\w{3}), \d\d (\w{3}).+$/i.exec v.text()
        dia = translateDay parts[1]
        mes = translateMonth parts[2]

        v.text(v.text().replace(parts[1], dia).replace(parts[2], mes))

    $('.post_url').click (e) ->
        e.preventDefault()
        loadPost $(this).attr('href')
        false

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

)()
