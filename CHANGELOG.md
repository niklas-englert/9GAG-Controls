# Changelog

### v1.4.2 (2023.01.15) “maintenance update 6”
- Added new option "default comments" to auto-switch the content under posts to comments and not related post – 9GAG's latest annoying change. (Closing #6)
- Deactivated option "center play". This feature was requested in issue #2 but it keeps producing problems and is hard to maintain.

### v1.4.1 (2023.01.11) “maintenance update 5”
- Fixed a bug caused by breaking changes of the original page.
- Volume button now mutes and unmutes the audio.

### v1.4.0 (2022.04.22) “Going Manifest V3”
- Updated this extension to [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/).  
  Firefox is still lacking support of V3 for multiple years now (although it's adaption [was announced](https://blog.mozilla.org/addons/2021/05/27/manifest-v3-update/)) while Chrome's support for V2 expires this year, forcing me to split this release in two (regular and Firefox-Edition). Get your shit together Mozilla!
- Fixed #5: “9gag pure black gone”

### v1.3.5 (2022.01.06) “maintenance update 5”
- Improved performance of syncing settings between tabs.

### v1.3.4 (2021.12.07) “maintenance update 4”
- On vertical post scrolls: Removed new double ad blocks that appear randomly between posts.
- On individual posts: Removed new double ad block that appears between the end of comments and the "More posts from 9GAG" section.

### v1.3.3 (2021.06.22) “maintenance update 3”
- Fixed style of download button.
- Fixed drawer (left menu) and sticky navbar (top/trending/flash and tags) background on better dark mode.
- Removed ad links for 9GAG's own apps and social media.
- Removed navigation option "Shop".

### v1.3.2 (2021.04.09) “maintenance update 2”
- Removed ad banner at the top (internally called billboard).
- Removed navigation options "Get App", "Win a PS5" and "Donate".
- Fixed videos/gifs in comments that were constantly paused and cannot be played... again.

### v1.3.1 (2020.12.11) “maintenance update”
- Removed custom Cyberpunk 2077 background and menu link, even though they were cool.
- Fixed videos/gifs in comments that were constantly paused and cannot be played.

### v1.3.0 (2020.07.17) “big screen support”
- Added option: 9GAGs auto-play plays _only_ the one centered video. (Suggested in [#2](https://github.com/niklas-englert/9GAG-Controls/issues/2) by kelderek)
- The width of the right control bar now grows with the width of the screen, so the controls are now more easy to operate on big screens.
- Updated ad-block filter: Adjusted due to changes of 9GAG and Google AdSense.
- Fixed internal error `filename.split is not a function` if the download button is pressed on a GIF.
- Fixed smaller CSS and JavaScript issues.

#### v1.2.1 (copy of v1.2.0 for Firefox because of [this](https://discourse.mozilla.org/t/-/62570))

### v1.2.0 (2020.06.21) “new and better”
- Hide all promoted video posts (not just Connatix video posts). Instead a message is displayed: "**[9GAG Controls has blocked this post. Click here to reveal.]**"
- Updated ad-block filter: Included new "9GAG: App FREE" banner in right sidebar and "Get 9GAG app" link in left side navigation.
- Added download button after up/down vote and comment button.
- Better dark mode. Can be switched off by a checkbox at the top left corner.
- Posts can be downloaded as JPEG or MP4 via the context menu opened with a right click. Video posts have to be right clicked on the controls at the bottom. Clicking the center will not work, because an invisible mute/unmute area is stretched over the video.
- Changes of the settings (e.g. volume and zoom) now synchronize between tabs.
- Moved "Manage consent" button (Cookie Management by Quantcast - GDPR Consent Solution) and scroll to top button in better positions.
- Added logo to extension sidebar.
- Fix: Muted video unmute themselves and play if the tab is changed.

### v1.1.1 (2020.05.07) “release on Firefox Add-ons”
- The extension has now **full Firefox support**. Manifest, CSS and JavaScript are adjusted to work on both platforms.
- The icon is round now.
- Added GPL-3.0 license to this GitHub repository.

#### v1.1.0 (no release / unstable)

### v1.0.1 (2020.05.05) “release on Chrome Web Store”
- New icon image. It shows a wrench that is put on the 9GAG logo.
- Started this GitHub repository.
- Moved elements overlaid by the right control bar to the left.
- Fixed smaller CSS issues.

### v1.0.0 (2020.05.04) “beta phase finished”
- Added a new control bar on the right.
- Added volume slider. Changes will saved in browser storage and applied to all videos.
- Added zoom button and slider. Changes will be saved in browser storage.
- Activate controls on videos. Moved mute button and duration display to the sides so the controls aren't overlaid.
- Hide various external ads (like Google AdSense embeds).
- Hide various disruptive promotions for 9GAG's own products like their mobile apps.
- Hide Connatix video posts. Instead this message is displayed: "9GAG Controls: Promoted video from Connatix hidden. Click to reveal."
- Hide Facebook and Pinterest share buttons.
