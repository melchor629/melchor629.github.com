images = [
    1
    'assets/img/Pixel Art.png'
    'https://pbs.twimg.com/media/CERI-yNW0AIwIA6.jpg:large'
    'https://pbs.twimg.com/media/CDGwAolWIAA-xkF.jpg:large'
    'https://pbs.twimg.com/media/CEe1sRkWYAE0Wiy.jpg:large'
    'https://pbs.twimg.com/media/CGGc8fnWMAA0GnY.jpg:large'
    'https://pbs.twimg.com/media/CeBLo6ZWIAQE_Qn.jpg:large'
    'https://pbs.twimg.com/media/Cgf7-IEUEAAgWk5.jpg:large'
    'https://pbs.twimg.com/media/Ci-4rIQWgAABok3.jpg:large'
]

addKey = (key)->
    $('.keys').append("""
        <div class="key"> #{key} </div>
    """).removeClass 'hidden'

removeKeys = ->
    $('.keys').find('.key').addClass 'bye'
    setTimeout ->
        $('.keys').addClass('hidden').empty()
    , 300

createCheat = (cheatStr, done) ->
    cheet cheatStr, {
        next: (str, key, num, seq) ->
            key = ' ' if key is 'space'
            addKey key

        fail: ->
            removeKeys()

        done: ->
            done() if done?
            setTimeout ->
                removeKeys()
            , 1000
    }

createCheat '↑ ↑ ↓ ↓ ← → ← → b a', ->
    images[0] = (images[0] + 1) % (images.length)
    (images[0] = 1) if images[0] is 0
    $('.profile_img img').attr('src', images[images[0]])

createCheat 'f i l l space d e space p u t a', ->
    alert 'Com goses insultarme? Fill de meuca, al infern aniràs...'

createCheat 'a r o u n d space t h e space w o r l d', ->
    playSound 'atw'

createCheat 'i n t e r s t e l l a r', ->
    playSound 'stay'

createCheat 's a t u r d a y space n i g h t space f e v e r', ->
    if Math.round Math.random()
        playSound 'staying alive'
    else
        playSound 'staying alive2'

createCheat 'd o space a space b a r r e l space r o l l', ->
    $('body').addClass 'barrel-roll'
    setTimeout ->
        $('body').removeClass 'barrel-roll'
    , 4000

createCheat 'l e t s space f l i p', ->
    if $('body').hasClass 'flip'
        $('body').removeClass('flip').addClass('iflip')
        setTimeout ->
            $('body').removeClass 'iflip'
        , 2000
    else
        $('body').addClass 'flip'

createCheat 'w t f s t b', ->
    playSound 'when-the-fire-starts-to-burn'

createCheat 'o s c u r o', ->
    if localStorage.darkmode
        localStorage.removeItem 'darkmode'
        $('body').removeClass('darkmode').removeClass('darkmode-inmediate')
    else
        localStorage.darkmode = 'true'
        $('body').addClass('darkmode')

años = ->
    d = new Date
    n = new Date 830037600000
    if d.getMonth() > n.getMonth() or (d.getMonth() is n.getMonth() and d.getDate() >= n.getDate())
        año = d.getYear() - n.getYear()
    else
        año = d.getYear() - n.getYear() - 1
    $('#año').text año

años()

window.soundBuffers = soundBuffers = {}
window.AudioContext = window.AudioContext || window.mozAudioContext || window.webkitAudioContext;
window.audioCtx = audioCtx = new AudioContext()
window.soundAnalyser = audioCtx.createAnalyser()
soundAnalyser.maxDecibels = -5
redrawRequest = null
canvasCtx = $('#background')[0].getContext('2d')
soundAnalyser.connect audioCtx.destination

a = new Audio
canPlay =
    m4a: a.canPlayType('audio/m4a') or a.canPlayType('audio/x-m4a') or a.canPlayType('audio/aac'),
    mp3: a.canPlayType('audio/mp3') or a.canPlayType('audio/mpeg;'),
    ogg: a.canPlayType('audio/ogg; codecs="vorbis"')
    wav: a.canPlayType('audio/wav; codecs="1"');

for c of canPlay
    if canPlay[c]
        canPlay.def = c;

loadSound = (name, snd_or_av1, av2) ->
    if arguments.length is 1
        file = "/assets/snd/#{name}.#{canPlay.def}"
    else if arguments.length is 2
        file = snd_or_av1
    else if arguments.length is 3
        if canPlay[snd_or_av1]
            file = "/assets/snd/#{name}.#{snd_or_av1}"
        else if canPlay[av2]
            file = "/assets/snd/#{name}.#{av2}"
        else
            throw "No se puede reproducir en ningún formato";
    else
        console.error "Demasiados argumentos para loadSound. No se hace nada"
        return;

    request = new XMLHttpRequest();
    request.open('GET', file);
    request.responseType = 'arraybuffer';
    request.onload = (e) ->
        audioCtx.decodeAudioData request.response, (buffer) ->
            soundBuffers[name] = buffer
    request.onerror = (e) ->
        console.error 'El archivo ' + file + ' no existe'
    request.send();

playSound = (name) ->
    buffer = soundBuffers[name]
    if not buffer
        window.alert 'Buffer is null or undefined'
    else
        audioCtx.resume()
        source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect soundAnalyser
        $('#background').removeClass 'nope'
        setTimeout( ->
            source.start(0);
            if Math.round(Math.random() * 1000) % 2 then drawBars() else drawWave()
            console.log "Reproduciendo " + name
        , 100)
        source.onended = ->
            source.onended = null
            $('#background').addClass 'noping'
            console.log "Fin de " + name
            setTimeout( ->
                cancelAnimationFrame redrawRequest
                redrawRequest = null
                $('#background').removeClass('noping').addClass 'nope'
                audioCtx.suspend()
            , 500)

# https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js#L128-L205
drawWave = ->
    width = -> $('#background')[0].width
    height = -> $('#background')[0].height
    soundAnalyser.fftSize = 2048
    bufferLength = soundAnalyser.frequencyBinCount
    dataArray = new Uint8Array bufferLength

    canvasCtx.clearRect 0, 0, width(), height()
    draw = ->
        redrawRequest = requestAnimationFrame(draw)
        soundAnalyser.getByteTimeDomainData dataArray

        canvasCtx.fillStyle = 'rgb(255, 255, 255)'
        canvasCtx.fillRect 0, 0, width(), height()

        canvasCtx.lineWidth = 4
        canvasCtx.strokeStyle = '#3f51b5'
        canvasCtx.beginPath()

        sliceWidth = width() * 1.0 / bufferLength
        x = 0

        for i in [0..bufferLength]
            v = dataArray[i] / 128.0
            y = v * height() / 2

            if i is 0
                canvasCtx.moveTo(x, y)
            else
                canvasCtx.lineTo(x, y)

            x += sliceWidth

        canvasCtx.lineTo width(), height()/2
        canvasCtx.stroke()

    draw()

drawBars = ->
    width = -> $('#background')[0].width
    height = -> $('#background')[0].height
    soundAnalyser.fftSize = 512
    bufferLength = soundAnalyser.frequencyBinCount
    dataArray = new Uint8Array bufferLength

    canvasCtx.clearRect 0, 0, width(), height()
    draw = ->
        redrawRequest = requestAnimationFrame(draw)
        soundAnalyser.getByteFrequencyData dataArray

        canvasCtx.fillStyle = 'rgb(255, 255, 255)'
        canvasCtx.fillRect 0, 0, width(), height()

        barWidth = width() / bufferLength * 2.5
        x = 0

        for i in [0..bufferLength]
            barHeight = height() * dataArray[i] / 256

            canvasCtx.fillStyle = "#3f51b5"
            canvasCtx.fillRect x, height() - barHeight, barWidth, barHeight

            x += barWidth + 1

    draw()

# http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
PIXEL_RATIO = ->
    ctx = document.createElement("canvas").getContext("2d")
    dpr = window.devicePixelRatio || 1
    bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1

    dpr / bsr
PIXEL_RATIO = PIXEL_RATIO()

loadSound 'atw', 'mp3', 'ogg'
loadSound 'stay', 'm4a', 'ogg'
loadSound 'staying alive', 'm4a', 'ogg'
loadSound 'staying alive2', 'm4a', 'ogg'
loadSound 'when-the-fire-starts-to-burn', 'm4a', 'ogg'

$('.profile_img img').load ->
    $(this).css('margin-top', "#{(256 - $(this).height()) / 2}px");

new Hammer(document.querySelector('.profile_img img')).on 'press', (e) ->
    images[0] = (images[0] + 1) % (images.length)
    (images[0] = 1) if images[0] is 0
    $('.profile_img img').attr('src', images[images[0]])

$(window).resize ->
    # http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
    $('#background').width($(window).width()).height($(window).height())
    c = $('#background')[0]
    c.width = $(window).width() * PIXEL_RATIO
    c.height = $(window).height() * PIXEL_RATIO
$(window).resize()
