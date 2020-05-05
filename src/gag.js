if (localStorage.getItem('__ext_volume') == null) localStorage.setItem('__ext_volume', 0.7);
if (localStorage.getItem('__ext_zoom') == null) localStorage.setItem('__ext_zoom', 1.5);

/* to apply every change */
var update = () => {

  // set volume and add controls
  let volume = localStorage.getItem('__ext_volume') * 1;
  for (let video of document.querySelectorAll('video:not([data-volume="' + volume + '"])')) {
    video.volume = volume;
    video.dataset.volume = volume;
    video.controls = true;
  }

  // remove Connatix posts
  $('.post-container>*>cnx:not(.--ext-detected), .post-container>cnx:not(.--ext-detected)').each((_, elem) => {
    const parent = elem.parentElement;
    $(elem).addClass('--ext-detected').hide();
    var $blockMsg = $('<div class="--ext-conanix">[9GAG Controls: Promoted video from Connatix hidden. Click to reveal.]</div>');
    $(parent).append($blockMsg);
    $blockMsg.click(() => {
      $blockMsg.remove();
      $(elem).show().slideDown();
    });
  });

  // find promoted articles
  // [...$('article .message>a[href^="javascript:"]')].map(elem => elem.textContent.trim() == 'Promoted')

  // remove video sources like webm or other weird non-mp4 
  try {
    $('.post-container video>source[src^="https://img-9gag-fun.9cache.com/"]:not([type="video/mp4"])').each((i, elem) => {
      elem.parentElement.classList.add('--reloadable');
    }).remove();
  } catch (e) {}

  $('video.--reloadable').removeClass('--reloadable').each((i, elem) => {
    try {
      elem.load();
    } catch (e) {}
  });

  // remove picture sources like webp
  $('picture>source[type="image/webp"]').remove();

  // calculate zoom intend
  let toMuchRight = window.innerWidth - $('.main-wrap').offset().left * 2 - 500 - 30;
  $(document.body).css('--ext-zoom-intend', toMuchRight / 2);
};
setInterval(update, 100);

function getVolumeSymbol(volume) {
  if (volume <= 0) return '🔇';
  else if (volume < 0.5) return '🔈';
  else if (volume < 1) return '🔉';
  else return '🔊';
}

function getCurrentArticle() {
  let bestElem, bestMiddle = Infinity;
  $('article').each((i, elem) => {
    let middle = Math.abs($(elem).offset().top + elem.offsetHeight / 2 - pageYOffset - innerHeight / 2 - 25);
    if (middle < bestMiddle) {
      bestElem = elem;
      bestMiddle = middle;
    }
  });
  return bestElem;
}

// inject control html
{
  let volume = localStorage.getItem('__ext_volume') * 1;
  let zoom = localStorage.getItem('__ext_zoom') * 1;

  $(document.body)
    .append(`<div class="--ext-controls">
  <div class="--ext-option" title="audio volume">
    <button id="--ext-volume-btn" class="--ext-button" disabled>${getVolumeSymbol(volume)}</button>
    <div id="--ext-volume-value" class="--ext-value">${Math.round(volume*100)}%</div>
    <input id="--ext-volume-scale" class="--ext-range" type="range" step="0.05" min="0" max="1" />
  </div>
  <div>
  <div class="--ext-option" title="post zoom">
    <button id="--ext-zoom-btn" class="--ext-button">🔍</button>
    <div id="--ext-zoom-value" class="--ext-value">${Math.round(zoom*100)}%</div>
    <input id="--ext-zoom-scale" class="--ext-range" type="range" step="0.05" min="1" max="3" />
  </div>
</div>`)
    .append(`<div class="--ext-zoom-blocker" style="display:none" title="undo zoom"></div>`)
    .css('--ext-zoom', zoom + '');

  $('#--ext-volume-scale').on('input', evt => {
    let volume = evt.target.value * 1;
    localStorage.setItem('__ext_volume', volume);
    $('#--ext-volume-btn').text(getVolumeSymbol(volume));
    $('#--ext-volume-value').text(Math.round(volume * 100) + '%');
    update();
  }).val(volume);

  $('#--ext-zoom-btn, .--ext-zoom-blocker').click(evt => {
    // undo last zoom
    if ($('article.--ext-zoom').removeClass('--ext-zoom').length) {
      $('.--ext-zoom-blocker').hide();
      $('#--ext-zoom-btn').removeClass('--ext-undo');
      return;
    }
    // zoom
    $(getCurrentArticle()).addClass('--ext-zoom');
    $('.--ext-zoom-blocker').show();
    $('#--ext-zoom-btn').addClass('--ext-undo');
  });

  $('#--ext-zoom-scale').on('input', evt => {
    let zoom = evt.target.value * 1;
    localStorage.setItem('__ext_zoom', zoom);
    $(document.body).css('--ext-zoom', zoom + '');
    $('#--ext-zoom-value').text(Math.round(zoom * 100) + '%');
  }).val(zoom);

}
