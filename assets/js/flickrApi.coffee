---
---

apiKey = 'a901b91486eb90e967465d6df5f96ea1'
apiUrl = 'https://api.flickr.com/services/rest/'

randomString = ->
    rand = ->
        Math.round(Math.random() * 1000000)
    str = ''
    for i in [0..8]
        num = Math.round(Math.random() * 3) % 3
        if num == 0
            str += String.fromCharCode((rand() % 26) + 97)
        else if num == 1
            str += String.fromCharCode((rand() % 26) + 65)
        else
            str += String.fromCharCode((rand() % 10) + 48)
    str

doRequest = (request, cbk) ->
    rndCbk = 'flickr_' + randomString()
    request = extend request, {
        api_key: apiKey,
        format: 'json',
        jsoncallback: rndCbk
    }
    window[rndCbk] = (json) ->
        cbk json
        delete window[rndCbk]
    script = document.createElement 'script'
    script.src = buildUrl apiUrl, request
    document.head.appendChild(script)
    document.head.removeChild(script)

buildUrl = (url, parameters) ->
    queryString = '';

    for key of parameters
        if parameters.hasOwnProperty(key)
            queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&'

    if queryString.lastIndexOf('&') is queryString.length - 1
        queryString = queryString.substring(0, queryString.length - 1);

      return url + '?' + queryString;

extend = (object) ->
    for arg in arguments
        for key of arg
            if arg.hasOwnProperty key
                object[key] = arg[key]

      return object;

protoFunc = (meth) ->
    (params, callback) ->
        doRequest(extend(params, { method: meth }), callback)

flickr =
    galleries:
        getPhotos: protoFunc 'flickr.galleries.getPhotos'

    photos:
        getInfo: protoFunc 'flickr.photos.getInfo'
        getExif: protoFunc 'flickr.photos.getExif'
        getSizes: protoFunc 'flickr.photos.getSizes'

    photosets:
        getPhotos: protoFunc 'flickr.photosets.getPhotos'
        getList: protoFunc 'flickr.photosets.getList'

    buildThumbnailUrl: (photo) ->
        "https://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
    buildPhotoUrl: (photo) ->
        "https://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}.jpg"
    buildLargePhotoUrl: (photo) ->
        "https://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_b.jpg"

window.flickr = flickr
