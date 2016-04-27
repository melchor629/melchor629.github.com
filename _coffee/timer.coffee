class Timer
    constructor: (time, cbk, autostart) ->
        @time = time || 1000
        @_cbk = cbk
        @_hdl = null

        if autostart then @start()

    start: ->
        if @_hdl
            clearTimeout @_hdl

        @_hdl = setTimeout @_cbk, @time

    cancel: ->
        if @_hdl
            clearTimeout @_hdl
            @_hdl = null

    restart: ->
        @cancel()
        @start()

class IntervalTimer
    constructor: (time, cbk, autostart) ->
        @time = time || 1000
        @_cbk = cbk
        @_hdl = null

        if autostart
            @start()

    start: ->
        if @_hdl
            clearInterval @_hdl

        @_hdl = setInterval @_cbk, @time

    cancel: ->
        if @_hdl
            clearInterval @_hdl
            @_hdl = null

    restart: ->
        @cancel()
        @start()

class AnimationTimer
    constructor: (duration, cbk, autostart) ->
        @duration = duration || 1000
        @_cbk = cbk
        @_startTime = null

        if autostart then @start()

    start: ->
        @_startTime = null
        func = (timestamp) =>
            if @_startTime is null then @_startTime = timestamp
            if timestamp - @_startTime <= @duration
                @_cbk((timestamp - @_startTime) / @duration, timestamp)
                window.requestAnimationFrame func
            else
                @_endCbk()
        window.requestAnimationFrame func

    stop: ->
        @_startTime = @duration + 1

    onEnd: (cbk) ->
        @_endCbk = cbk

    restart: ->
        @stop()
        @start()

window.Timer = Timer
window.IntervalTimer = IntervalTimer
window.AnimationTimer = AnimationTimer
