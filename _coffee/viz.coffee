window.AudioContext = window.AudioContext || window.mozAudioContext || window.webkitAudioContext;
window.audioCtx = audioCtx = new AudioContext()
window.soundAnalyser = audioCtx.createAnalyser()
soundAnalyser.maxDecibels = -5
redrawRequest = null
audioBuffer = null
source = null
canvasCtx = $('#background')[0].getContext('2d')
soundAnalyser.connect audioCtx.destination
aElement = $('<audio/>')[0]
startPos = 0
startTime = 0

$('#cancion').change((e) ->
    e.preventDefault()
    readFile e.target.files[0]
    false
)

$('body').on('drop', (e) ->
    e.stopPropagation()
    e.preventDefault()
    readFile e.originalEvent.dataTransfer.files[0]
    $('.arrastrar').stop().animate({opacity:0},500)
    $('.arrastrar').data('dragover', null)
    false
)

$('body').on('dragover', (e) ->
    e.stopPropagation()
    e.preventDefault()
    e.originalEvent.dataTransfer.dropEffect = 'copy'
    if not $('.arrastrar').data('dragover')
        $('.arrastrar').stop().animate({opacity:1}, 300)
        $('.arrastrar').data('dragover', 'yep')
    false
)

$('body').on('dragleave', (e) ->
    e.stopPropagation()
    e.preventDefault()
    $('.arrastrar').stop().animate({opacity:0},500)
    $('.arrastrar').data('dragover', null)
    false
)

$('#visualizador').change (e) ->
    window.cancelAnimationFrame redrawRequest if redrawRequest
    redrawRequest = null
    switch Number($('#visualizador').val())
        when 1 then drawBars()
        when 2 then drawWave()

$('#play').click (e) ->
    play()

$('#stop').click (e) ->
    stop()

$('#pos').mousedown (e) ->
    stop(true)
    $('#pos').attr('disabled', null)

$('#pos').mouseup (e) ->
    play Number($('#pos').val())

# seek con esto https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createBuffer

readFile = (file) ->
    console.log file
    if file.type.indexOf('audio/') is -1
        console.error "Esto no es musica #{file.type}"
        return showNotification "El archivo no es de sonido (#{file.type})", 'danger'
    if not aElement.canPlayType(file.type)
        console.error "nope #{file.type}"
        return showNotification "El archivo de sonido no es soportado por el navegador (#{file.type})", 'warning'
    fr = new FileReader()
    fr.onload = (e) ->
        filebuffer = e.target.result
        audioCtx.decodeAudioData filebuffer, (buffer) ->
            audioBuffer = buffer
            $('#pos').attr 'disabled', null
            $('#pos').attr 'max', audioBuffer.duration
            stop() if source
            play()
        , (e) ->
            console.error e
            showNotification "Ha habido un error al decodificar el sonido (#{e.message})", 'danger'

    fr.onprogress = (e) ->
        console.log Math.round((e.loaded / e.total) * 100)
    fr.onerror = (e) ->
        console.error e.target.error.code
        showNotification "El archivo no se ha podido leer (#{e.target.error.code})", 'danger'

    fr.readAsArrayBuffer file

play = (start, length) ->
    start = start | 0
    length = length | (audioBuffer.duration - start)
    buffer = audioBuffer

    if start isnt 0 or length < audioBuffer.duration
        s = Math.round start * audioBuffer.sampleRate
        l = Math.round length * audioBuffer.sampleRate
        buffer = audioCtx.createBuffer audioBuffer.numberOfChannels, l, audioBuffer.sampleRate

        for i in [0..audioBuffer.numberOfChannels - 1]
            fullSamples = audioBuffer.getChannelData i
            samples = fullSamples.slice s, s + l
            buffer.copyToChannel samples, i

    if not source
        source = audioCtx.createBufferSource()
        source.buffer = buffer
        source.connect soundAnalyser
        source.start()
        startPos = start
        startTime = audioCtx.currentTime
        switch Number($('#visualizador').val())
            when 1 then drawBars()
            when 2 then drawWave()
        $('#stop').attr 'disabled', null
        $('#pos').attr 'value', start
        source.onended = ->
            source = null
            stop()
        console.log "startPos = #{startPos}\nstartTime = #{startTime}"

stop = (nopos) ->
    source.onended = null if source
    source.stop() if source
    window.cancelAnimationFrame redrawRequest if redrawRequest
    requestAnimationFrame ->
        canvasCtx.fillStyle = if (localStorage.darkmode || 'false') is 'true' then '#282828' else 'rgb(255, 255, 255)'
        canvasCtx.fillRect 0, 0, $('#background')[0].width, $('#background')[0].height
    $('#stop').attr('disabled', 'disabled')
    $('#pos').attr('disabled', 'disabled') if nopos isnt true
    console.log nopos
    redrawRequest = source = null

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

        $('#pos').val startPos + audioCtx.currentTime - startTime

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

            $('#pos').val startPos + audioCtx.currentTime - startTime

    draw()

showNotification = (message, type) ->
    $('.notification .alert')
        .addClass("alert-#{type}")
        .text(message)
        .fadeIn(500)
        .delay(5000)
        .fadeOut(500, ->
            $(this).removeClass "alert-#{type}"
        )

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

$(window).resize ->
    # http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
    $('#background').width($(window).width()).height($(window).height())
    c = $('#background')[0]
    c.width = $(window).width() * PIXEL_RATIO
    c.height = $(window).height() * PIXEL_RATIO
$(window).resize()
