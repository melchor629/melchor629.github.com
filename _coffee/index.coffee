
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
        next: (str, key, num, seq)->
            addKey key

        fail: ->
            removeKeys()

        done: ->
            done()
            setTimeout ->
                removeKeys()
            , 1000
    }

createCheat '↑ ↑ ↓ ↓ ← → ← → b a', ->
    alert 'Voilà!'

createCheat 'f i l l space d e space p u t a', ->
    alert 'Com goses insultarme? Fill de meuca, al infern aniràs...'

createCheat 'a r o u n d space t h e space w o r l d', ->
    playSound 'atw'

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
window.AudioContext = window.webkitAudioContext || window.AudioContext
window.audioCtx = audioCtx = new AudioContext()

a = new Audio
canPlay =
    mp4: a.canPlayType('audio/m4a; codecs="mp4a.40.5'),
    mp3: a.canPlayType('audio/mp3'),
    ogg: a.canPlayType('audio/ogg; codecs="vorbis"')

for c of canPlay
    if canPlay[c]
        canPlay.def = c;

loadSound = (name, snd) ->
    file = snd or "/assets/snd/#{name}.#{canPlay.def}"
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
        source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        setTimeout ->
            source.start(0);
        , 100

loadSound 'atw'
