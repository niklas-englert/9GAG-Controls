if (localStorage.getItem('__ext_volume') == null) localStorage.setItem('__ext_volume', 0.7);
if (localStorage.getItem('__ext_zoom') == null) localStorage.setItem('__ext_zoom', 1.5);
if (localStorage.getItem('__ext_original_dark') == null) localStorage.setItem('__ext_original_dark', 'false');

/* to apply every change */
var update = () => {

  // set volume and add controls
  let volume = localStorage.getItem('__ext_volume') * 1;
  for (let video of document.querySelectorAll('video:not([data-volume="' + volume + '"])')) {
    video.volume = volume;
    video.dataset.volume = volume;
    video.controls = true;
  }
  // disable drag for video post
  $('.post-container a:not([draggable])').attr('draggable', 'false');

  // find promoted post
  var promotetArticles = [...document.querySelectorAll('article:not(.--ext-detected) .message>a[href^="javascript:"]')]
    .filter(elem => elem.textContent.match(/Promoted/))
    .map(elem => {
      while (elem) {
        elem = elem.parentElement;
        if (elem.tagName === 'ARTICLE') return elem;
      }
    });
  for (let article of promotetArticles) {
    article.dataset.blocked = 'Post from the section "Promoted"';
  }

  // find unlisted posts and ads covered in posts like connatix
  var unlistedArticles = [...document.querySelectorAll('article:not([id]):not(.--ext-detected)')];
  for (let article of unlistedArticles) {
    article.dataset.blocked = 'Post has no ID, so it is probably an ad.';
  }

  // hide posts
  for (let article of [...promotetArticles, ...unlistedArticles]) {
    let $blockMsg = $(
        '<div class="--ext-blocked-msg">[9GAG Controls has blocked this post. Click here to reveal.]<br>' +
        'Reason: ' + article.dataset.blocked + '</div>')
      .click(() => {
        $blockMsg.remove();
        $(article).removeClass('--ext-blocked');
      });
    $(article)
      .addClass('--ext-detected')
      .addClass('--ext-blocked')
      .append($blockMsg);
  }

  // remove video sources like webm or other weird non-mp4
  try {
    $('.post-container video>source[src^="https://img-9gag-fun.9cache.com/"]:not([type="video/mp4"])').each((i, elem) => {
      elem.parentElement.classList.add('--reloadable');
    }).remove();
  } catch (e) {}

  $('video.--reloadable').removeClass('--reloadable').each(async (i, elem) => {
    try {
      // This part is over-complicated because of Google Chromes nasty loading policy on videos and audios. It's causing 
      // "Uncaught (in promise) DOMException: The play() request was interrupted by a call to load()." errors otherwise.
      let paused = elem.paused;
      // elem.readyState
      await elem.pause();
      await elem.load();
      if (!paused) elem.play();
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

// detect changes in settings made by an other tab
window.addEventListener('storage', evt => {
  // stop on non-extention storage
  if (!evt.key.startsWith('__ext_')) return;
  // handle changes
  switch (evt.key) {
    // simulate volume input to apply changes
    case '__ext_volume':
      $('#--ext-volume-scale').val(evt.newValue * 1)[0]
        .dispatchEvent(new Event('input', {
          bubbles: true,
          cancelable: true,
        }));
      break;
    case '__ext_zoom':
      // simulate zoom input to apply changes
      $('#--ext-zoom-scale').val(evt.newValue * 1)[0]
        .dispatchEvent(new Event('input', {
          bubbles: true,
          cancelable: true,
        }));
      break;
  }
}, false);

// inject control html
{
  let volume = localStorage.getItem('__ext_volume') * 1;
  let zoom = localStorage.getItem('__ext_zoom') * 1;
  let originalDark = JSON.parse(localStorage.getItem('__ext_original_dark'));

  let $body = $(document.body)
    .append(`<div class="--ext-controls">
  <div class="--ext-option" title="audio volume">
    <button id="--ext-volume-btn" class="--ext-button" disabled>${getVolumeSymbol(volume)}</button>
    <div id="--ext-volume-value" class="--ext-value">${Math.round(volume*100)}%</div>
    <input id="--ext-volume-scale" class="--ext-range" type="range" step="0.05" min="0" max="1" />
  </div>
  <div class="--ext-option" title="post zoom">
    <button id="--ext-zoom-btn" class="--ext-button">🔍</button>
    <div id="--ext-zoom-value" class="--ext-value">${Math.round(zoom*100)}%</div>
    <input id="--ext-zoom-scale" class="--ext-range" type="range" step="0.05" min="1" max="3" />
  </div>
  <div class="--ext-option" title="switch back to original dark mode">
    <label class="--ext-original-dark-switch"><input type="checkbox" id="--ext-original-dark-switch"> black</label>
  </div>
</div>`)
    .append(`<div class="--ext-zoom-blocker" style="display:none" title="undo zoom"></div>`)
    .css('--ext-zoom', zoom + '');

  if (originalDark) {
    $body.addClass('--ext-original-dark');
    $('#--ext-original-dark-switch').prop('checked', true);
  }

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

  $('#--ext-original-dark-switch').on('input', evt => {
    var checked = $('#--ext-original-dark-switch').prop('checked');
    originalDark = checked;
    if (checked) $body.addClass('--ext-original-dark');
    else $body.removeClass('--ext-original-dark');
    localStorage.setItem('__ext_original_dark', JSON.stringify(originalDark));
  }).val(zoom);

}
