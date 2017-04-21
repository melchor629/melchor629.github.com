---
---

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
    'https://pbs.twimg.com/media/Cx9ZotYXUAAhih5.jpg:large'
    'https://pbs.twimg.com/media/CyiKCaAXgAAfp84.jpg:large'
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

cheet.onfail = removeKeys
cheet.onnext = (key, str) ->
    str = ' ' if str is 'space'
    addKey str
cheet.ondone = () ->
    setTimeout ->
        removeKeys()
    , 1000

createCheat = (cheatStr, done) ->
    cheet.add(cheatStr).then done

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

createCheat 'f l i p space i t', ->
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

createCheat 'f l o a t i n g space p o i n t s', ->
    switch Math.trunc(Math.random() * 10000) % 4
        when 0 then playSound 'k&g beat'
        when 1 then playSound 'nuits sonores'
        when 2 then playSound 'for marmish 2'
        when 3 then playSound 'peoples potential'

createCheat 'v i s u a l i z a d o r', ->
    if localStorage.visualizador
        if localStorage.visualizador is 'barras'
            localStorage.visualizador = 'onda'
        else if localStorage.visualizador is 'onda'
            localStorage.visualizador = 'random'
        else if localStorage.visualizador is 'random'
            localStorage.visualizador = 'barras'
    else
        localStorage.visualizador = 'barras'
    alert "Visualizador cambiado a #{localStorage.visualizador}"
    console.log "Visualizador cambiado a #{localStorage.visualizador}"

createCheat 'c o l d p l a y', ->
    switch Math.trunc(Math.random() * 10000) % 4
        when 0 then playSound 'violet hill'
        when 1 then playSound 'talk'
        when 2 then playSound 'brothers & sisters'
        when 3 then playSound 'every teardrop is a waterfall'

createCheat 'c y d o n i a', ->
    switch Math.trunc(Math.random() * 10000) % 5
        when 0 then playSound 'apocalypse please'
        when 1 then playSound 'uprising'
        when 2 then playSound 'the globalist'
        when 3 then playSound 'knights of cydonia1'
        when 4 then playSound 'knights of cydonia2'

createCheat 'a n d r e s', ->
    $('body').append('<iframe width="'+$(window).width()+'" height="'+$(window).height()+'" src="https://www.youtube-nocookie.com/embed/8arKaFFTFGo?autoplay=1&controls=0&disablekb=1&fs=0&rel=0&showinfo=0&color=white&iv_load_policy=3" id="background" frameborder="0" allowfullscreen></iframe>')

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
    if redrawRequest isnt null
        # No podemos poner otra canción si ya hay una, o está acabando
        return

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
            switch localStorage.visualizador || 'random'
                when 'barras' then drawBars()
                when 'onda' then drawWave()
                when 'random'
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

        canvasCtx.fillStyle = if (localStorage.darkmode || 'false') is 'true' then '#282828' else 'rgb(255, 255, 255)'
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

        canvasCtx.fillStyle = if (localStorage.darkmode || 'false') is 'true' then '#282828' else 'rgb(255, 255, 255)'
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

`
// http://detectmobilebrowsers.com/
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
`

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

$(document).ready ->
    console.log " @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    console.log " @@@@@   Ey locuelo, si quieres ver el código fuente, mejor miralo en Github   @@@@@"
    console.log " @@@@@ https://github.com/melchor629/melchor629.github.com/tree/master/assets  @@@@@"
    console.log " @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    console.log ""

    if not mobilecheck()
        loadSound 'atw', 'mp3', 'ogg'
        loadSound 'stay', 'm4a', 'ogg'
        loadSound 'staying alive', 'm4a', 'ogg'
        loadSound 'staying alive2', 'm4a', 'ogg'
        loadSound 'when-the-fire-starts-to-burn', 'm4a', 'ogg'
        loadSound 'k&g beat', 'm4a', 'ogg'
        loadSound 'nuits sonores', 'm4a', 'ogg'
        loadSound 'for marmish 2', 'm4a', 'ogg'
        loadSound 'peoples potential', 'm4a', 'ogg'
        loadSound 'every teardrop is a waterfall', 'm4a', 'ogg'
        loadSound 'violet hill', 'm4a', 'ogg'
        loadSound 'brothers & sisters', 'm4a', 'ogg'
        loadSound 'talk', 'm4a', 'ogg'
        loadSound 'apocalypse please', 'm4a', 'ogg'
        loadSound 'uprising', 'm4a', 'ogg'
        loadSound 'the globalist', 'm4a', 'ogg'
        loadSound 'knights of cydonia1', 'm4a', 'ogg'
        loadSound 'knights of cydonia2', 'm4a', 'ogg'
