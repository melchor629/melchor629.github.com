// Generated by CoffeeScript 1.10.0
(function() {
  var a, addKey, audioCtx, años, c, canPlay, createCheat, images, loadSound, playSound, removeKeys, soundBuffers;

  images = [1, 'assets/img/Pixel Art.png', 'https://pbs.twimg.com/media/CERI-yNW0AIwIA6.jpg:large', 'https://pbs.twimg.com/media/CDGwAolWIAA-xkF.jpg:large', 'https://pbs.twimg.com/media/CEe1sRkWYAE0Wiy.jpg:large', 'https://pbs.twimg.com/media/CGGc8fnWMAA0GnY.jpg:large', 'https://pbs.twimg.com/media/CeBLo6ZWIAQE_Qn.jpg:large', 'https://pbs.twimg.com/media/Cgf7-IEUEAAgWk5.jpg:large', 'https://pbs.twimg.com/media/Ci-4rIQWgAABok3.jpg:large'];

  addKey = function(key) {
    return $('.keys').append("<div class=\"key\"> " + key + " </div>").removeClass('hidden');
  };

  removeKeys = function() {
    $('.keys').find('.key').addClass('bye');
    return setTimeout(function() {
      return $('.keys').addClass('hidden').empty();
    }, 300);
  };

  createCheat = function(cheatStr, done) {
    return cheet(cheatStr, {
      next: function(str, key, num, seq) {
        if (key === 'space') {
          key = ' ';
        }
        return addKey(key);
      },
      fail: function() {
        return removeKeys();
      },
      done: function() {
        if (done != null) {
          done();
        }
        return setTimeout(function() {
          return removeKeys();
        }, 1000);
      }
    });
  };

  createCheat('↑ ↑ ↓ ↓ ← → ← → b a', function() {
    images[0] = (images[0] + 1) % images.length;
    if (images[0] === 0) {
      images[0] = 1;
    }
    return $('.profile_img img').attr('src', images[images[0]]);
  });

  createCheat('f i l l space d e space p u t a', function() {
    return alert('Com goses insultarme? Fill de meuca, al infern aniràs...');
  });

  createCheat('a r o u n d space t h e space w o r l d', function() {
    return playSound('atw');
  });

  createCheat('i n t e r s t e l l a r', function() {
    return playSound('stay');
  });

  createCheat('s a t u r d a y space n i g h t space f e v e r', function() {
    if (Math.round(Math.random())) {
      return playSound('staying alive');
    } else {
      return playSound('staying alive2');
    }
  });

  createCheat('d o space a space b a r r e l space r o l l', function() {
    $('body').addClass('barrel-roll');
    return setTimeout(function() {
      return $('body').removeClass('barrel-roll');
    }, 4000);
  });

  createCheat('l e t s space f l i p', function() {
    if ($('body').hasClass('flip')) {
      $('body').removeClass('flip').addClass('iflip');
      return setTimeout(function() {
        return $('body').removeClass('iflip');
      }, 2000);
    } else {
      return $('body').addClass('flip');
    }
  });

  createCheat('w t f s t b', function() {
    return playSound('when-the-fire-starts-to-burn');
  });

  años = function() {
    var año, d, n;
    d = new Date;
    n = new Date(830037600000);
    if (d.getMonth() > n.getMonth() || (d.getMonth() === n.getMonth() && d.getDate() >= n.getDate())) {
      año = d.getYear() - n.getYear();
    } else {
      año = d.getYear() - n.getYear() - 1;
    }
    return $('#año').text(año);
  };

  años();

  window.soundBuffers = soundBuffers = {};

  window.AudioContext = window.AudioContext || window.mozAudioContext || window.webkitAudioContext;

  window.audioCtx = audioCtx = new AudioContext();

  a = new Audio;

  canPlay = {
    m4a: a.canPlayType('audio/m4a;') || a.canPlayType('audio/x-m4a') || a.canPlayType('audio/aac'),
    mp3: a.canPlayType('audio/mp3') || a.canPlayType('audio/mpeg;'),
    ogg: a.canPlayType('audio/ogg; codecs="vorbis"'),
    wav: a.canPlayType('audio/wav; codecs="1"')
  };

  for (c in canPlay) {
    if (canPlay[c]) {
      canPlay.def = c;
    }
  }

  loadSound = function(name, snd_or_av1, av2) {
    var file, request;
    if (arguments.length === 1) {
      file = "/assets/snd/" + name + "." + canPlay.def;
    } else if (arguments.length === 2) {
      file = snd_or_av1;
    } else if (arguments.length === 3) {
      if (canPlay[snd_or_av1]) {
        file = "/assets/snd/" + name + "." + snd_or_av1;
      } else if (canPlay[av2]) {
        file = "/assets/snd/" + name + "." + av2;
      } else {
        throw "No se puede reproducir en ningún formato";
      }
    } else {
      console.error("Demasiados argumentos para loadSound. No se hace nada");
      return;
    }
    request = new XMLHttpRequest();
    request.open('GET', file);
    request.responseType = 'arraybuffer';
    request.onload = function(e) {
      return audioCtx.decodeAudioData(request.response, function(buffer) {
        return soundBuffers[name] = buffer;
      });
    };
    request.onerror = function(e) {
      return console.error('El archivo ' + file + ' no existe');
    };
    return request.send();
  };

  playSound = function(name) {
    var buffer, source;
    buffer = soundBuffers[name];
    if (!buffer) {
      return window.alert('Buffer is null or undefined');
    } else {
      source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      return setTimeout(function() {
        return source.start(0);
      }, 100);
    }
  };

  loadSound('atw', 'mp3', 'ogg');

  loadSound('stay', 'm4a', 'ogg');

  loadSound('staying alive', 'm4a', 'ogg');

  loadSound('staying alive2', 'm4a', 'ogg');

  loadSound('when-the-fire-starts-to-burn', 'm4a', 'ogg');

  $('.profile_img img').load(function() {
    return $(this).css('margin-top', ((256 - $(this).height()) / 2) + "px");
  });

  new Hammer(document.querySelector('.profile_img img')).on('press', function(e) {
    images[0] = (images[0] + 1) % images.length;
    if (images[0] === 0) {
      images[0] = 1;
    }
    return $('.profile_img img').attr('src', images[images[0]]);
  });

}).call(this);
