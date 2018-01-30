$(document).ready(function() {
  redrawTransparentTitle();
  $(window).on('throttledresize', function(event) {
    redrawTransparentTitle();
  });

  function redrawTransparentTitle() {
    var title = 'Are we out of the woods yet?';
    var words = title.split(' ');

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
