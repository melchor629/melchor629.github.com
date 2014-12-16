
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

window.soundBuffers = soundBuffers = {}
window.audioCtx = audioCtx = new AudioContext()

loadSound = (name, snd) ->
    request = new XMLHttpRequest();
    request.open('GET', snd);
    request.responseType = 'arraybuffer';
    request.onload = (e) ->
        audioCtx.decodeAudioData(request.response, (buffer) ->
            soundBuffers[name] = buffer
        )
    request.onerror = (e) ->
        window.alert e
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

loadSound 'atw', 'assets/snd/atw.ogg'