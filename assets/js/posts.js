(function(){var t,e,n,o,r,a,i,s,c,u,l,d,h,p,w,f,m,g,v;m=function(t){var e;switch(e=t,t){case"Mon":e="Lun";break;case"Tue":e="Mar";break;case"Wed":e="Mié";break;case"Thu":e="Jue";break;case"Fri":e="Vié";break;case"Sat":e="Sáb";break;case"Sun":e="Dom"}return e},g=function(t){var e;switch(e=t,t){case"Jan":e="Ene";break;case"Apr":e="Abr";break;case"Aug":e="Ago";break;case"Dec":e="Dic"}return e},l=void 0,d=window.location.hash,p=function(){return $(".circle-button").css("opacity",1).removeClass("hide").addClass("show")},i=function(){return $(".circle-button").removeClass("show").addClass("hide"),setTimeout(function(){return $(".circle-button").css("opacity",0)},1e3)},w=function(t,e,n){var o,r,a,i,s;return r={x:0,y:t},a={x:0,y:e},o=!1,i=new TWEEN.Tween(r).to(a,t-e===0?0:100*Math.log2(Math.abs(t-e))),i.easing(TWEEN.Easing.Cubic.InOut),i.onUpdate(function(){return window.scrollTo(r.x,r.y)}),i.onComplete(function(){return o=!0,null!=n?n():void 0}),i.start(),(s=function(){return TWEEN.update(),o?void 0:window.requestAnimationFrame(s)})()},u=0,c=function(t){var e;return t=Number(t),e=l[t],u=window.scrollY,window.location.hash="#"+e.url,d=window.location.hash,w(u,0,function(){return $(".mainPage").removeClass("show").addClass("_hide"),p(),$.get(e.url,function(t){return $(".postPage").append(t).removeClass("_hide").addClass("show").css("position","absolute"),$("#share-tw a").attr("href",v("melchor629",window.location,'"'+e.titulo+'"')),$("title").text(e.titulo+" - The abode of melchor9000"),setTimeout(function(){return $(".mainPage").hide(),$(".postPage").css("position","relative"),$("img").attr("data-action","zoom")},500)}).fail(function(t){return alert("Post no existente"),h()})})},h=function(){return $(".postPage").removeClass("show").addClass("_hide"),$(".mainPage").removeClass("_hide").addClass("show").show(),i(),window.location.hash="",setTimeout(function(){return $(".postPage").empty(),w(0,u),$("title").text("Posts - The abode of melchor9000")},500)},v=function(t,e,n){return"http://twitter.com/intent/tweet?text="+encodeURIComponent(n)+"&url="+encodeURIComponent(e)+"&via="+t+"&related="+t+"%3AMelchor%20Garau%20Madrigal"},a=function(t){var e,n,o;for(e=n=0,o=l.length;o>=0?o>=n:n>=o;e=o>=0?++n:--n)if(l[e].url===t)return e},r=function(t){var e,n,o,r;return r=window.scrollY,e=$(window).height(),n=80+$(t).position().top,o=$(t).height(),r+e>n&&n+o>=r},e=function(e){var n,o,r,a,i,s,c,u,d,h;for(i=1,$(window).width()>=768&&$(window).width()<=1199?i=2:$(window).width()>=1200&&(i=3),l.linea=e,l.cargados=(e+1)*i,l.cargados>l.length?(l.cargados=l.length,o=function(){u=[];for(var t=s=e*i,n=l.length-1;n>=s?n>=t:t>=n;n>=s?t++:t--)u.push(t);return u}.apply(this)):o=function(){d=[];for(var t=c=e*i,n=(e+1)*i-1;n>=c?n>=t:t>=n;n>=c?t++:t--)d.push(t);return d}.apply(this),h=[],a=0,r=o.length;r>a;a++)n=o[a],h.push(t(n));return h},t=function(t){var e,n,o,r,a,i,s,u,d,h,p,w;return s=l[t],u=$("<div/>").addClass("post_entry col-sm-6 col-lg-4").data("num",t),a=$("<div/>").addClass("inner-outer"),d=$("<div/>").addClass("post_thumb").css("background-image","url('"+s.img+"')"),h=$("<a/>").attr("href",s.url).append($("<div/>").addClass("cover")).addClass("post_url"),p=$("<h3/>").addClass("text-center post_title"),w=$("<a/>").attr("href",s.url).addClass("post_url").text(s.titulo),o=/^(\w{3}), \d\d (\w{3}).+$/i.exec(s.fecha),e=m(o[1]),i=g(o[2]),n=s.fecha.replace(o[1],e).replace(o[2],i),r=$("<div/>").addClass("post_info").append('<small><p class="text-right post_created_time">'+n+"</p></small>"),d.append(h),p.append(w),a.append(d).append(p).append(r),u.append(a),u.find(".post_url").click(function(t){return t.preventDefault(),c($(this).closest(".post_entry").data("num")),!1}),$(".posts_container").append(u)},$(".circle-button.back").click(function(){return d="",h(),!1}),o=void 0,s=void 0,f=!1,$(".circle-button.share").mouseenter(function(){return $(this).parent().find(".circle-button-extra").css("display","block"),clearTimeout(s),o=setTimeout(function(t){return function(){return $(t).parent().find(".circle-button-extra").addClass("hover").animate({top:"-45px"},300)}}(this),20)}).mouseleave(function(){return $(this).parent().find(".circle-button-extra").removeClass("hover").each(function(t,e){return $(e).animate({top:-73-48*t+"px"},300)}),clearTimeout(o),s=setTimeout(function(t){return function(){return $(t).parent().find(".circle-button-extra").css("display","none")}}(this),333)}),$(".circle-button.share").on("tap",function(){return f?($(".circle-button.share").trigger("mouseleave"),f=!1):($(".circle-button.share").trigger("mouseenter"),f=!0)}),$(".circle-button-group.share .circle-button-extra").each(function(t,e){return $(e).css("top",-73-48*t+"px")}),$("#share-fb").click(function(t){return FB.ui({method:"share",href:window.location.toString(),quote:$("title").text()},function(t){return console.log(t)})}),n=function(){var t;return t=window.location.hash,d!==t&&(""===t?h():c(a(decodeURIComponent(window.location.hash.substr(1)))),d=t),setTimeout(n,100)},n(),$.get("/assets/posts.json").success(function(t){return l=t,l.pop(),e(0),$(window).scroll(),""!==window.location.hash?c(a(decodeURIComponent(window.location.hash.substr(1)))):void 0}),$(window).scroll(function(t){var n;if(!$(".mainPage").hasClass("_hide"))return n=window.scrollY+$(window).height(),n>$(".posts_container").height()+70&&l.length!==l.cargados?e(l.linea+1):l.length===l.cargados?($(window).off("scroll"),$(window).off("resize")):void 0}),$(window).resize($(window).scroll.bind($(window)))}).call(this);