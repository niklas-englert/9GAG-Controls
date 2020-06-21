![banner image](/symbol/banner.png)

<img src="/src/icons/256.png" alt="Google Inc. logo" title="9GAG Controls" align="right" height="96" width="96" />

# 9GAG Controls
[![chrome version][chromeVersionImg]][chromeWebStore]
[![chrome users][chromeUsersImg]][chromeWebStore]
[![firefox version][mozillaVersionImg]][mozillaAddon]
[![firefox users][mozillaUsersImg]][mozillaAddon]
[![issues open][issuesImg]][issues]


A browser extension that tries to make your 9GAG experience better.  
It adds **controls to video posts**, regulates the **audio volume**, **removes ads**, hides promoted content and allows you to **zoom in on posts**.

Available on the Chrome Web Store and on Firefox Add-ons. Just click:

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/9gag-controls/ggaflcnplcdgjodokhjdefdobpdhdnjm"><img src="https://img.shields.io/badge/-install%20on%20Chrome-4184F4?style=for-the-badge&logo=google-chrome&logoColor=white"></a>
  <a href="https://addons.mozilla.org/de/firefox/addon/9gag-controls/"><img src="https://img.shields.io/badge/-install%20on%20Firefox-E66000?style=for-the-badge&logo=mozilla-firefox&logoColor=white"></a>
</p>

<br><br>

## Changelog

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



[chromeWebStore]: https://chrome.google.com/webstore/detail/9gag-controls/ggaflcnplcdgjodokhjdefdobpdhdnjm
[chromeVersionImg]: https://img.shields.io/chrome-web-store/v/ggaflcnplcdgjodokhjdefdobpdhdnjm?label=chrome%20version&logo=google-chrome&logoColor=white
[chromeUsersImg]: https://img.shields.io/chrome-web-store/users/ggaflcnplcdgjodokhjdefdobpdhdnjm?label=chrome%20users&logo=google-chrome&logoColor=white
[mozillaAddon]: https://addons.mozilla.org/de/firefox/addon/9gag-controls/
[mozillaVersionImg]: https://img.shields.io/amo/v/9gag-controls?label=firefox%20version&logo=mozilla-firefox&logoColor=white
[mozillaUsersImg]: https://img.shields.io/amo/users/9gag-controls?label=firefox%20users&logo=mozilla-firefox&logoColor=white
[issues]: https://github.com/niklas-englert/9GAG-Controls/issues
[issuesImg]: https://img.shields.io/github/issues/niklas-englert/9GAG-Controls
