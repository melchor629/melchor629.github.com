const apiKey = 'a901b91486eb90e967465d6df5f96ea1'
const apiUrl = 'https://api.flickr.com/services/rest/'

function* range(start, end, step = 1) {
    for(let i = start; i < end; i += step) {
        yield i;
    }
}

const randomString = () => {
    const rand = () => Math.round(Math.random() * 1000000)
    let str = ''
    for(let i of range(0, 8)) {
        let num = Math.trunc(Math.random() * 3) % 3
        if(num === 0)
            str += String.fromCharCode((rand() % 26) + 97)
        else if(num === 1)
            str += String.fromCharCode((rand() % 26) + 65)
        else
            str += String.fromCharCode((rand() % 10) + 48)
    }
    return str
}

const doRequest = (request, cbk) => {
    const rndCbk = 'flickr_' + randomString()
    request = { ...request,
        api_key: apiKey,
        format: 'json',
        jsoncallback: rndCbk
    }
    window[rndCbk] = (json) => {
        cbk(json)
        delete window[rndCbk]
    }
    let script = document.createElement('script')
    script.src = buildUrl(apiUrl, request)
    document.head.appendChild(script)
    document.head.removeChild(script)
}

const buildUrl = (url, parameters) => {
    let queryString = ''

    for(let key in parameters) {
        if(parameters.hasOwnProperty(key))
            queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&'
    }

    if(queryString.lastIndexOf('&') === queryString.length - 1)
        queryString = queryString.substring(0, queryString.length - 1)

      return url + '?' + queryString
};

const protoFunc = (meth) =>
    (params, callback) =>
        doRequest({ ...params, method: meth }, callback)

export default {
    galleries: {
        getPhotos: protoFunc('flickr.galleries.getPhotos')
    },

    photos: {
        getInfo: protoFunc('flickr.photos.getInfo'),
        getExif: protoFunc('flickr.photos.getExif'),
        getSizes: protoFunc('flickr.photos.getSizes')
    },

    photosets: {
        getPhotos: protoFunc('flickr.photosets.getPhotos'),
        getList: protoFunc('flickr.photosets.getList')
    },

    buildThumbnailUrl: (photo) =>
        `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
    buildPhotoUrl: (photo) =>
        `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
    buildLargePhotoUrl: (photo) =>
        `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
};
