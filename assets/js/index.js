(function(){var e,o,a,t,n,i,r,s,l,c,d,u,m,g,p,f,h;u=[1,"assets/img/Pixel Art.png","https://pbs.twimg.com/media/CERI-yNW0AIwIA6.jpg:large","https://pbs.twimg.com/media/CDGwAolWIAA-xkF.jpg:large","https://pbs.twimg.com/media/CEe1sRkWYAE0Wiy.jpg:large","https://pbs.twimg.com/media/CGGc8fnWMAA0GnY.jpg:large","https://pbs.twimg.com/media/CeBLo6ZWIAQE_Qn.jpg:large","https://pbs.twimg.com/media/Cgf7-IEUEAAgWk5.jpg:large","https://pbs.twimg.com/media/Ci-4rIQWgAABok3.jpg:large","https://pbs.twimg.com/media/Cx9ZotYXUAAhih5.jpg:large","https://pbs.twimg.com/media/CyiKCaAXgAAfp84.jpg:large"],a=function(e){return $(".keys").append('<div class="key"> '+e+" </div>").removeClass("hidden")},f=function(){return $(".keys").find(".key").addClass("bye"),setTimeout(function(){return $(".keys").addClass("hidden").empty()},300)},cheet.onfail=f,cheet.onnext=function(e,o){return"space"===o&&(o=" "),a(o)},cheet.ondone=function(){return setTimeout(function(){return f()},1e3)},l=function(e,o){return cheet.add(e).then(o)},l("↑ ↑ ↓ ↓ ← → ← → b a",function(){return u[0]=(u[0]+1)%u.length,0===u[0]&&(u[0]=1),$(".profile_img img").attr("src",u[u[0]])}),l("f i l l space d e space p u t a",function(){return alert("Com goses insultarme? Fill de meuca, al infern aniràs...")}),l("a r o u n d space t h e space w o r l d",function(){return g("atw")}),l("i n t e r s t e l l a r",function(){return g("stay")}),l("s a t u r d a y space n i g h t space f e v e r",function(){return g(Math.round(Math.random())?"staying alive":"staying alive2")}),l("d o space a space b a r r e l space r o l l",function(){return $("body").addClass("barrel-roll"),setTimeout(function(){return $("body").removeClass("barrel-roll")},4e3)}),l("f l i p space i t",function(){return $("body").hasClass("flip")?($("body").removeClass("flip").addClass("iflip"),setTimeout(function(){return $("body").removeClass("iflip")},2e3)):$("body").addClass("flip")}),l("w t f s t b",function(){return g("when-the-fire-starts-to-burn")}),l("o s c u r o",function(){return localStorage.darkmode?(localStorage.removeItem("darkmode"),$("body").removeClass("darkmode").removeClass("darkmode-inmediate")):(localStorage.darkmode="true",$("body").addClass("darkmode"))}),l("f l o a t i n g space p o i n t s",function(){switch(Math.trunc(1e4*Math.random())%4){case 0:return g("k&g beat");case 1:return g("nuits sonores");case 2:return g("for marmish 2");case 3:return g("peoples potential")}}),l("v i s u a l i z a d o r",function(){return localStorage.visualizador?"barras"===localStorage.visualizador?localStorage.visualizador="onda":"onda"===localStorage.visualizador?localStorage.visualizador="random":"random"===localStorage.visualizador&&(localStorage.visualizador="barras"):localStorage.visualizador="random",alert("Visualizador cambiado a "+localStorage.visualizador),console.log("Visualizador cambiado a "+localStorage.visualizador)}),n=function(){var e,o,a;return o=new Date,a=new Date(8300376e5),e=o.getMonth()>a.getMonth()||o.getMonth()===a.getMonth()&&o.getDate()>=a.getDate()?o.getYear()-a.getYear():o.getYear()-a.getYear()-1,$("#año").text(e)},n(),window.soundBuffers=h={},window.AudioContext=window.AudioContext||window.mozAudioContext||window.webkitAudioContext,window.audioCtx=t=new AudioContext,window.soundAnalyser=t.createAnalyser(),soundAnalyser.maxDecibels=-5,p=null,s=$("#background")[0].getContext("2d"),soundAnalyser.connect(t.destination),o=new Audio,r={m4a:o.canPlayType("audio/m4a")||o.canPlayType("audio/x-m4a")||o.canPlayType("audio/aac"),mp3:o.canPlayType("audio/mp3")||o.canPlayType("audio/mpeg;"),ogg:o.canPlayType('audio/ogg; codecs="vorbis"'),wav:o.canPlayType('audio/wav; codecs="1"')};for(i in r)r[i]&&(r.def=i);m=function(e,o,a){var n,i;if(1===arguments.length)n="/assets/snd/"+e+"."+r.def;else if(2===arguments.length)n=o;else{if(3!==arguments.length)return void console.error("Demasiados argumentos para loadSound. No se hace nada");if(r[o])n="/assets/snd/"+e+"."+o;else{if(!r[a])throw"No se puede reproducir en ningún formato";n="/assets/snd/"+e+"."+a}}return i=new XMLHttpRequest,i.open("GET",n),i.responseType="arraybuffer",i.onload=function(o){return t.decodeAudioData(i.response,function(o){return h[e]=o})},i.onerror=function(e){return console.error("El archivo "+n+" no existe")},i.send()},g=function(e){var o,a;if(null===p)return o=h[e],o?(t.resume(),a=t.createBufferSource(),a.buffer=o,a.connect(soundAnalyser),$("#background").removeClass("nope"),setTimeout(function(){switch(a.start(0),localStorage.visualizador||"random"){case"barras":c();break;case"onda":d();break;case"random":Math.round(1e3*Math.random())%2&&c();break;default:d()}return console.log("Reproduciendo "+e)},100),a.onended=function(){return a.onended=null,$("#background").addClass("noping"),console.log("Fin de "+e),setTimeout(function(){return cancelAnimationFrame(p),p=null,$("#background").removeClass("noping").addClass("nope"),t.suspend()},500)}):window.alert("Buffer is null or undefined")},d=function(){var e,o,a,t,n;return n=function(){return $("#background")[0].width},t=function(){return $("#background")[0].height},soundAnalyser.fftSize=2048,e=soundAnalyser.frequencyBinCount,o=new Uint8Array(e),s.clearRect(0,0,n(),t()),(a=function(){var i,r,l,c,d,u,m;for(p=requestAnimationFrame(a),soundAnalyser.getByteTimeDomainData(o),s.fillStyle="rgb(255, 255, 255)",s.fillRect(0,0,n(),t()),s.lineWidth=4,s.strokeStyle="#3f51b5",s.beginPath(),c=1*n()/e,u=0,i=r=0,l=e;l>=0?l>=r:r>=l;i=l>=0?++r:--r)d=o[i]/128,m=d*t()/2,0===i?s.moveTo(u,m):s.lineTo(u,m),u+=c;return s.lineTo(n(),t()/2),s.stroke()})()},c=function(){var e,o,a,t,n;return n=function(){return $("#background")[0].width},t=function(){return $("#background")[0].height},soundAnalyser.fftSize=512,e=soundAnalyser.frequencyBinCount,o=new Uint8Array(e),s.clearRect(0,0,n(),t()),(a=function(){var i,r,l,c,d,u,m;for(p=requestAnimationFrame(a),soundAnalyser.getByteFrequencyData(o),s.fillStyle="rgb(255, 255, 255)",s.fillRect(0,0,n(),t()),r=n()/e*2.5,m=0,u=[],l=c=0,d=e;d>=0?d>=c:c>=d;l=d>=0?++c:--c)i=t()*o[l]/256,s.fillStyle="#3f51b5",s.fillRect(m,t()-i,r,i),u.push(m+=r+1);return u})()},e=function(){var e,o,a;return o=document.createElement("canvas").getContext("2d"),a=window.devicePixelRatio||1,e=o.webkitBackingStorePixelRatio||o.mozBackingStorePixelRatio||o.msBackingStorePixelRatio||o.oBackingStorePixelRatio||o.backingStorePixelRatio||1,a/e},e=e(),window.mobilecheck=function(){var e=!1;return function(o){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(o)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(o.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e},mobilecheck()||(m("atw","mp3","ogg"),m("stay","m4a","ogg"),m("staying alive","m4a","ogg"),m("staying alive2","m4a","ogg"),m("when-the-fire-starts-to-burn","m4a","ogg"),m("k&g beat","m4a","ogg"),m("nuits sonores","m4a","ogg"),m("for marmish 2","m4a","ogg"),m("peoples potential","m4a","ogg")),$(".profile_img img").load(function(){return $(this).css("margin-top",(256-$(this).height())/2+"px")}),new Hammer(document.querySelector(".profile_img img")).on("press",function(e){return u[0]=(u[0]+1)%u.length,0===u[0]&&(u[0]=1),$(".profile_img img").attr("src",u[u[0]])}),$(window).resize(function(){return $("#background").width($(window).width()).height($(window).height()),i=$("#background")[0],i.width=$(window).width()*e,i.height=$(window).height()*e}),$(window).resize(),$(document).ready(function(){return console.log(" @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"),console.log(" @@@@@   Ey locuelo, si quieres ver el código fuente, mejor miralo en Github   @@@@@"),console.log(" @@@@@ https://github.com/melchor629/melchor629.github.com/tree/master/_coffee @@@@@"),console.log(" @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"),console.log("")})}).call(this);