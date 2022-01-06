// If local storage wasn't set: set defaut options
if (localStorage.getItem('__ext_volume') == null) localStorage.setItem('__ext_volume', 0.7);
if (localStorage.getItem('__ext_zoom') == null) localStorage.setItem('__ext_zoom', 1.5);
if (localStorage.getItem('__ext_original_dark') == null) localStorage.setItem('__ext_original_dark', 'false');
if (localStorage.getItem('__ext_play_control') == null) localStorage.setItem('__ext_play_control', 'false');

// buffered version of localStorage.setItem
// (inspired but probably not fixing issue #4)
function localStorageSetItem(key, value) {
  const timeouts = localStorageSetItem.timeouts;
  localStorageSetItem.values.set(key, value);
  // cancel old timeout
  const lastTimeout = timeouts.get(key);
  if (lastTimeout) clearTimeout(lastTimeout);
  // start new timeout
  timeouts.set(key, setTimeout(() => {
    localStorage.setItem(key, value);
    timeouts.delete(key);
    localStorageSetItem.values.delete(key);
  }, 750));
}

localStorageSetItem.timeouts = new Map();
localStorageSetItem.values = new Map();

/* to apply every change */
var update = () => {

  // set volume and add controls
  let volume = localStorageSetItem.values.has('__ext_volume') ? localStorageSetItem.values.get('__ext_volume') : localStorage.getItem('__ext_volume') * 1;
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

  // add download buttons
  $('article:not(.--ext-downloadable)').each((i, elem) => {
    let $elem = $(elem);
    $elem.addClass('--ext-downloadable');
    // get filename
    if (typeof elem.id !== 'string') return;
    let filename = false;
    $('picture>img', elem).each((j, img) => filename = img.src);
    $('source[type="video/mp4"]', elem).each((j, source) => filename = source.src);
    if (!filename) return;
    filename = filename.split('/').pop();
    if (!filename) return;
    // add download button
    $('.post-afterbar-a>.btn-vote:last-of-type, .post-afterbar-a>.vote+.share', elem)
      .after('<ul class="btn-vote left"><li data-v-download><a title="download post" class="--ext-download" href="/photo/' + filename + '" rel="nofollow" download="">&nbsp;&nbsp;</a></li></ul>');
  });

  // run better autoplay: modify the auto-play feature, so only the centered video plays
  if (playControlActive()) {
    const article = getCurrentArticle();
    const video = $('video', article)[0];
    if (video) {
      if (video.__extInCenter === false) video.play();
      video.__extInCenter = true;
    }
    const isVideoPost = !!video;
    $(':not(.img-embed)>video').each((i, elem) => {
      if (hasParentWith(elem, '.post-comment')) return;
      if (elem !== video) {
        if (!elem.paused) elem.pause();
        elem.__extInCenter = false;
      }
    });
    // update css class for center focus highlighting
    let lastInCenter = $('article.--ext-in-center');
    if (lastInCenter.length && lastInCenter[0] !== article) lastInCenter.removeClass('--ext-in-center');
    $(article).addClass('--ext-in-center');
  } else {
    $('article.--ext-in-center').removeClass('--ext-in-center');
  }
};
setInterval(update, 100);

/**
 * Get volume symbol that shows the "loudnes".
 * @param {Number} volume Volume percentage from 0.0 to 1.0.
 * @return {String} Volume unicode.
 */
function getVolumeSymbol(volume) {
  if (volume <= 0) return '🔇';
  else if (volume < 0.5) return '🔈';
  else if (volume < 1) return '🔉';
  else return '🔊';
}

/**
 * Get current article thag that is the best in current viewport.
 * @return {ArticleElement} The found element.
 */
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

/**
 * Get the current state of the center played option.
 * @return {Boolean} Returns true if the center play option is checked.
 */
function playControlActive() {
  return localStorage.getItem('__ext_play_control') === 'true';
}

/**
 * Communicates download request with background.js.
 * See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
 * @param {Object} options An object specifying what file you wish to download, and any other preferences you wish to set concerning the download.
 */
function download(options) {
  chrome.runtime.sendMessage({
    type: 'download_request',
    options
  }, function(response) {
    console.log("Download request resolved with:", response);
  });
}

/**
 * Checks if any parent of an element is a match for a CSS selector.
 * @param {HTMLElement} elem element to check.
 * @param {string} selector CSS selector for parent.
 * @return {boolean} true on match.
 */
function hasParentWith(elem, selector) {
  while (elem.parentElement) {
    elem = elem.parentElement;
    if (elem.matches(selector)) return true;
  }
  return false;
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
    case '__ext_original_dark':
      {
        let originalDark = JSON.parse(evt.newValue);
        $('#--ext-original-dark-switch').prop('checked', originalDark);
        if (originalDark) $('body').addClass('--ext-original-dark');
        else $('body').removeClass('--ext-original-dark');
      }
      break;
    case '__ext_play_control':
      $('#--ext-play-control-switch').prop('checked', JSON.parse(evt.newValue));
      break;
  }
}, false);

// inject control html
{
  let volume = localStorage.getItem('__ext_volume') * 1;
  let zoom = localStorage.getItem('__ext_zoom') * 1;
  let originalDark = JSON.parse(localStorage.getItem('__ext_original_dark'));
  let playControl = JSON.parse(localStorage.getItem('__ext_play_control'));

  let $body = $(document.body)
    .append(`<div class="--ext-controls">
    <img title="9GAG Controls Extension" src="data:image/png;base64,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" />
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
  <div class="--ext-option" title="modify the auto-play feature, so only the centered video plays">
    <label class="--ext-option-switch">
      <input type="checkbox" id="--ext-play-control-switch">
      <span>center play</span>
    </label>
  </div>
  <div class="--ext-option --ext-original-dark-option" title="switch back to original dark mode">
    <label class="--ext-option-switch">
      <input type="checkbox" id="--ext-original-dark-switch">
      <span>black</span>
    </label>
  </div>
</div>`)
    .append(`<div class="--ext-zoom-blocker" style="display:none" title="undo zoom"></div>`)
    .css('--ext-zoom', zoom + '');

  if (originalDark) {
    $body.addClass('--ext-original-dark');
    $('#--ext-original-dark-switch').prop('checked', true);
  }
  if (playControl) {
    $('#--ext-play-control-switch').prop('checked', true);
  }

  $('#--ext-volume-scale').on('input', evt => {
    let volume = evt.target.value * 1;
    localStorageSetItem('__ext_volume', volume);
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
    localStorageSetItem('__ext_zoom', zoom);
    $(document.body).css('--ext-zoom', zoom + '');
    $('#--ext-zoom-value').text(Math.round(zoom * 100) + '%');
  }).val(zoom);

  $('#--ext-original-dark-switch').on('input', evt => {
    originalDark = $('#--ext-original-dark-switch').prop('checked');
    if (originalDark) $body.addClass('--ext-original-dark');
    else $body.removeClass('--ext-original-dark');
    localStorageSetItem('__ext_original_dark', JSON.stringify(originalDark));
  }).val(zoom);

  $('#--ext-play-control-switch').on('input', evt => {
    playControl = $('#--ext-play-control-switch').prop('checked');
    localStorageSetItem('__ext_play_control', JSON.stringify(playControl));
  }).val(zoom);

}

// advanced ad and feater detection
setTimeout(() => {
  console.log('######', document.querySelectorAll('nav a[href*="://bit.ly"]'));
  for (const a of [...document.querySelectorAll('nav a[href*="://bit.ly"]')]) {
    const content = a.textContent.trim().toLowerCase().replace(/[\s_]+/g, '_');
    if (
      content.indexOf('get_app') !== -1 ||
      content.indexOf('win_a') !== -1 ||
      content.indexOf('donate') !== -1 ||
      content.indexOf('shop') !== -1
    ) {
      a.remove();
    }
  }
}, 1200);
