// Browserify entry point
'use strict';
var $ = require('jquery');
window.$ = $;
window.jQuery = window.$;
var velocity = require('velocity-animate');

$('a[href*=#]').on('click', function (event) {
  event.preventDefault();
  var target = $(this).attr('href');
  $(target).velocity('scroll', {duration: 1500, easing: "easeInOutQuart"});
});

//Map code
var bittersMap = (function () {
  var myLatlng = new google.maps.LatLng(-33.433267,-70.774975),
      mapCenter = new google.maps.LatLng(-33.433267,-70.774975),
      mapCanvas = document.getElementById('map_canvas'),
      mapOptions = {
        center: mapCenter,
        zoom: 15,
        scrollwheel: false,
        draggable: true,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      map = new google.maps.Map(mapCanvas, mapOptions),
      contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Sociedad Comercial Sajonia Ltda.</h1>' +
        '<div id="bodyContent"' +
        '<p>Salar Surire 1274</p>' +
        '</div>' +
        '</div>',
      infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 300
      }),
      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Socomsa Ltda. Salar Surire 1274'
      });

  return {
    init: function () {
      map.set('styles', [{
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
          {hue: '#ffff00'},
          {saturation: 30},
          {lightness: 10}
        ]
      }
      ]);

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });
    }
  };
}());

//carousel
var carousel = {};
carousel.dir = 'images/';
carousel.maxItems = 6;
carousel.images= [
  'marca1.png',
  'marca2.png',
  'marca3.png',
  'marca4.png',
  'marca5.png',
  'marca6.png',
  'marca7.png',
  'marca8.png',
  'marca9.png',
  'marca10.jpg',
  'marlew.jpg'
];

function generateItem(image) {
  $('<img src="' + image + '"/>', {class: 'obstacle'}).
    appendTo('.carousel').fadeIn().
    velocity({left: 0}, {
      duration: 15000,
      easing: 'linear',
      complete: function (els) {
        $.each(els, function (index, el) {
          carousel.images.push($(el).attr('src').split('/')[1]);
          $(el).fadeOut(function(){
            $(this).remove();
          });
        });
      }
    });
}
function startCarousel() {
  var item = carousel.dir + carousel.images.shift();
  if($('.carousel>img').length < carousel.maxItems || !$('.carousel>img')) {
    generateItem(item);
  }
    setTimeout(startCarousel, 3000);
}
function CreateBannerText(arr,selector) {
  var num = 0;
  var items = arr.slice(0);
  var sel = selector;
  return function() {
    num++;
    if (num === items.length) {
      console.log("reset");
      num = 0;
    }
    var newEl = '<div class="animated fadeInLeftBig">'+items[num]+'</div>';
    var sel = $("."+selector);
    sel.fadeOut(500,function() {
      sel.empty().append(newEl).show();
    });
  }
}
var bannerText = CreateBannerText(['CONDUCTORES ELÉCTRICOS','MATERIALES ELÉCTRICOS','TABLEROS ELÉCTRICOS'],'bannertext');

bannerText();
setInterval(bannerText,5000);
startCarousel();
bittersMap.init();

//Material design input

$('input').focus(function(){
  if (!$(this).val()) {
    $(this).css({
      'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMwqgcAAOYAsvYGvkIAAAAASUVORK5CYII=)',
      'background-size': '0 100%',
      'background-repeat': 'repeat-y'
    });
    $(this).parent().find('span').velocity({top: "-=3rem"},500,'linear');
    $(this).velocity({'background-size': '100%'});
  }})
  .blur(function() {
    if (!$(this).val()) {
      $(this).parent().find('span').animate({top: "+=3rem"},500);
      $(this).velocity({'background-size': '0%'},'linear');
    }});

$(document).ready(function () {
  $('.accordion-tabs').each(function(index) {
    $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
  })
    .on('click', 'li > a.tab-link', function(event) {
    if (!$(this).hasClass('is-active')) {
      event.preventDefault();
      var accordionTabs = $(this).closest('.accordion-tabs');
      accordionTabs.find('.is-open').removeClass('is-open').hide();

      $(this).next().toggleClass('is-open').toggle();
      accordionTabs.find('.is-active').removeClass('is-active');
      $(this).addClass('is-active');
    } else {
      event.preventDefault();
    }
  });
});
//side menu scroll
$(window).on('scroll',function() {
  var height = $(document).height();
  var scrollBottom = height - $(this).scrollTop();

  if ($(this).scrollTop() > 400 && scrollBottom > 0.2*height )
  {
    $('.sidemenu').fadeIn();
  }
  else
  {
    $('.sidemenu').fadeOut();
  }
});
//formspree
var frm = $('#contactform');
frm.submit(function (ev) {
  $.ajax({
    url: "//formspree.io/web@socomsa.cl",
    method: "POST",
    data: frm.serialize(),
    dataType: "json",
    success: function (data) {
      $('#contactform').
        find(".submit").
        text("¡Gracias por su mensaje!");
      $('#contactform').
        find(".submit").
        prop("disabled",true);
    }
  });
  ev.preventDefault();
});

