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
    $('.return').css('opacity', 1).removeClass('hide').addClass('show')

hideReturnIcon = ->
    $('.return').removeClass('show').addClass('hide')
    setTimeout () ->
        $('.return').css('opacity', 0)
    , 1000

smoothScroll = (from, to, duration) ->
    #TODO Change interpollator
    started = window.performance.now()
    scroll = (timestamp) ->
        time = (timestamp - started) / 1000
        window.scrollTo 0, from + (to - from) * time / duration
        console.log from + (to - from) * time / duration
        console.log "Tiempo #{time}"
        if(time <= duration)
            window.requestAnimationFrame scroll
    scroll from, to, 0

oldScrollPos = 0
loadPost = (url) ->
    $('.mainPage').removeClass('show').addClass('_hide')
    oldScrollPos = window.scrollY
    smoothScroll(oldScrollPos, 0, 0.5)
    $.get(url, (html) ->
        $('.postPage').append(html).removeClass('_hide').addClass('show').css('position', 'absolute')
        showReturnIcon()
    );
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
        smoothScroll(0, oldScrollPos, 1.0)
    , 500

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

    $('.back').click ->
        returnMainPage()
        false

    $('.share').click ->
        alert 'share'
        false
)()
