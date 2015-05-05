// Generated by CoffeeScript 1.9.2
(function() {
  var hideReturnIcon, loadPost, oldScrollPos, returnMainPage, showReturnIcon, smoothScroll, translateDay, translateMonth;

  translateDay = function(day) {
    var dia;
    dia = day;
    switch (day) {
      case 'Mon':
        dia = 'Lun';
        break;
      case 'Tue':
        dia = 'Mar';
        break;
      case 'Wed':
        dia = 'Mié';
        break;
      case 'Thu':
        dia = 'Jue';
        break;
      case 'Fri':
        dia = 'Vié';
        break;
      case 'Sat':
        dia = 'Sáb';
        break;
      case 'Sun':
        dia = 'Dom';
    }
    return dia;
  };

  translateMonth = function(month) {
    var mes;
    mes = month;
    switch (month) {
      case 'Jan':
        mes = 'Ene';
        break;
      case 'Apr':
        mes = 'Abr';
        break;
      case 'Aug':
        mes = 'Ago';
        break;
      case 'Dec':
        mes = 'Dic';
    }
    return mes;
  };

  showReturnIcon = function() {
    return $('.return').css('opacity', 1).removeClass('hide').addClass('show');
  };

  hideReturnIcon = function() {
    $('.return').removeClass('show').addClass('hide');
    return setTimeout(function() {
      return $('.return').css('opacity', 0);
    }, 1000);
  };

  smoothScroll = function(from, to, duration, cbk) {
    var done, position, target, tween, update;
    position = {
      x: 0,
      y: from
    };
    target = {
      x: 0,
      y: to
    };
    done = false;
    tween = new TWEEN.Tween(position).to(target, duration);
    tween.easing(TWEEN.Easing.Cubic.InOut);
    tween.onUpdate(function() {
      window.scrollTo(position.x, position.y);
      return console.log(position);
    });
    tween.onComplete(function() {
      done = true;
      if (cbk != null) {
        return cbk();
      }
    });
    tween.start();
    update = function() {
      TWEEN.update();
      if (!done) {
        return window.requestAnimationFrame(update);
      }
    };
    return update();
  };

  oldScrollPos = 0;

  loadPost = function(url) {
    oldScrollPos = window.scrollY;
    return smoothScroll(oldScrollPos, 0, 500, function() {
      $('.mainPage').removeClass('show').addClass('_hide');
      showReturnIcon();
      return $.get(url, function(html) {
        $('.postPage').append(html).removeClass('_hide').addClass('show').css('position', 'absolute');
        return setTimeout(function() {
          $('.mainPage').hide();
          return $('.postPage').css('position', 'relative');
        }, 500);
      });
    });
  };

  returnMainPage = function() {
    $('.postPage').removeClass('show').addClass('_hide');
    $('.mainPage').removeClass('_hide').addClass('show').show();
    hideReturnIcon();
    return setTimeout(function() {
      $('.postPage').empty();
      return smoothScroll(0, oldScrollPos, 1000);
    }, 500);
  };

  (function() {
    $('.post_created_time').each(function(k, v) {
      var dia, mes, parts;
      v = $(v);
      parts = /^(\w{3}), \d\d (\w{3}).+$/i.exec(v.text());
      dia = translateDay(parts[1]);
      mes = translateMonth(parts[2]);
      return v.text(v.text().replace(parts[1], dia).replace(parts[2], mes));
    });
    $('.post_url').click(function(e) {
      e.preventDefault();
      loadPost($(this).attr('href'));
      return false;
    });
    $('.back').click(function() {
      returnMainPage();
      return false;
    });
    return $('.share').click(function() {
      alert('share');
      return false;
    });
  })();

}).call(this);
