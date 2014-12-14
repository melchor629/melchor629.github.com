
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
