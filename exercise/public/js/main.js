$(document).ready(function() {
  // initialize
  window.title = $('#title-main').text();

  redrawTransparentTitle(window.title);
  $('.title-input').trigger('change');
  var slugInterval = null;

  // event handers
  $(window).on('throttledresize', function(event) {
    redrawTransparentTitle(window.title);
  });

  $('.action-btns .btn-close').click(function(e) {
    $('.editable-title')
      .removeClass('mode-edit')
      .addClass('mode-read');
  });

  $('.action-btns .btn-edit').click(function(e) {
    $('.title-input').val(window.title);
    $('.editable-title')
      .removeClass('mode-read')
      .addClass('mode-edit');
    $('.title-input').trigger('change');
  });

  $('.action-btns .btn-save').click(function(e) {
    if ($(this).hasClass('disabled')) return;

    window.title = $('.title-input')
      .val()
      .trim();

    $.post('/title', { title: window.title, slug: window.slug }, res => {
      redrawTransparentTitle(window.title);

      $('.editable-title')
        .removeClass('mode-edit')
        .addClass('mode-read');
    });
  });

  $('.title-input').keydown(function(e) {
    setTimeout(() => {
      let val = $('.title-input').val();
      if (val.trim() === '') {
        $('a.btn-save').addClass('disabled');
      } else {
        $('a.btn-save').removeClass('disabled');
      }
    }, 50);

    if (slugInterval) {
      clearTimeout(slugInterval);
    }
    slugInterval = setTimeout(() => {
      let val = $('.title-input').val();
      $.get('/slug?title=' + val.trim(), res => {
        if (res.error === 0) {
          window.slug = res.slug;
          $('#slug').text(res.slug);
        } else {
          alert('error, try again later: ' + res.msg);
        }
      });
    }, 200);
  });

  // redraw title
  function redrawTransparentTitle(sentence) {
    var words = sentence.split(' ');

    var hiddenTitle = $('#title-main');
    hiddenTitle.text('a'); // reset text
    var lineHeight = hiddenTitle.height();
    var width = hiddenTitle.width();

    var composed = [];

    clearSvg();

    for (var p in words) {
      composed.push(words[p]);

      var oldWidth = hiddenTitle.width();
      var newHeight = hiddenTitle.text(composed.join(' ')).height();

      if (newHeight > lineHeight) {
        drawSVGText(composed.slice(0, -1).join(' '), oldWidth);
        composed = [words[p]];
      }
    }

    var oldWidth = hiddenTitle.width();
    if (composed.length > 0) {
      drawSVGText(composed.join(' '), oldWidth);
    }

    redrawHiders();
  }

  function redrawHiders(width) {
    var left = 70 - 22 + $('.svg-wrapper svg:last-child').outerWidth();
    // margin-left - (padding-left) + width
    $('.hider2').css('left', left + 'px');
  }

  function clearSvg() {
    $('.svg-wrapper svg').remove();
  }

  function uniqueId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  function drawSVGText(text, width) {
    if (text === '') return;
    var maskId = 'mask-' + uniqueId();
    $('.svg-wrapper').append(
      '\
      <svg class="bg-mask" style="width: ' +
        width +
        'px;">\
        <defs>\
          <mask id="' +
        maskId +
        '" x="0" y="0" width="100%" height="100%" >\
            <rect class="alpha" x="0" y="0" width="100%" height="100%"/>\
            <text class="title" x="0%" y="70px">' +
        text +
        '</text>\
          </mask>\
        </defs>\
        <rect class="base" x="0" y="0" width="100%" height="92px" style="fill: white; mask: url(#' +
        maskId +
        ')"/>\
      </svg>\
    ',
    );
  }
});
