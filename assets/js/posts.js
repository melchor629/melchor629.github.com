// Generated by CoffeeScript 1.8.0
(function() {
  var hideReturnIcon, loadPost, oldScrollPos, returnMainPage, showReturnIcon, translateDay, translateMonth;

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
    return $('.return').removeClass('hide').addClass('show');
  };

  hideReturnIcon = function() {
    return $('.return').removeClass('show').addClass('hide');
  };

  oldScrollPos = 0;

  loadPost = function(url) {
    $('.mainPage').removeClass('show').addClass('_hide');
    oldScrollPos = window.scrollY;
    window.scrollTo(0, 0);
    $.get(url, function(html) {
      $('.postPage').append(html).removeClass('_hide').addClass('show').css('position', 'absolute');
      return showReturnIcon();
    });
    return setTimeout(function() {
      $('.mainPage').hide();
      return $('.postPage').css('position', 'relative');
    }, 500);
  };

  returnMainPage = function() {
    $('.postPage').removeClass('show').addClass('_hide');
    $('.mainPage').removeClass('_hide').addClass('show').show();
    hideReturnIcon();
    return setTimeout(function() {
      $('.postPage').empty();
      return window.scrollTo(0, oldScrollPos);
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
    return $('.return').click(function() {
      returnMainPage();
      return false;
    });
  })();

}).call(this);
