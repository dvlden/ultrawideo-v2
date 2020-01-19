<p align="center">
  <a href="https://github.com/dvlden/ultrawideo">
    <img src=".github/logo.svg" width="300" alt="UltraWideo" />
  </a>
</p>

<p align="center">
  <i>The cross-browser extension that manipulates video aspect ratio to fit your entire screen.</i>
</p>

---

![License](https://img.shields.io/github/license/dvlden/ultrawideo?color=%238a5fff&label=License&style=flat-square)
![Version](https://img.shields.io/github/package-json/version/dvlden/ultrawideo?color=%238a5fff&label=Version&style=flat-square)
![Chrome rating](https://img.shields.io/chrome-web-store/rating/bfbnagnphiehemkdgmmficmjfddgfhpl?color=%238a5fff&label=Chrome%20rating&style=flat-square)
![Firefox rating](https://img.shields.io/amo/rating/ultrawideo?color=%238a5fff&label=Firefox%20rating&style=flat-square)

### Getting started

Select one of the possible options to install this extension, depending on your browser.

1. [Chrome Extension](https://chrome.google.com/webstore/detail/ultrawideo/bfbnagnphiehemkdgmmficmjfddgfhpl)
2. [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/ultrawideo/)
3. [Opera Add-on](https://addons.opera.com/en/extensions/details/ultrawideo/)
4. [~~Whale Extension~~](https://store.whale.naver.com/detail/lceccdkmdhebaiojbjdplcdpadehipbm) _(deprecated, see the note below.)_

> **Note for Opera browser users**: They allow installing extensions directly from Chrome store, but you must install this extension - [Install Chrome Extensions](https://addons.opera.com/en/extensions/details/install-chrome-extensions/) in order to do that.

> **Note for Whale browser users**: They allow installing extensions directly from Chrome store. Unlike Opera, you do not need to install any special extension to do this.

> I am considering to deprecate Opera Add-on as well, because as the note from above says, you can install their official chrome extension add-on that will allow installing all extensions from the Chrome store. Why to deprecate? - Simply because Opera approvals take longer than 20 days. If they enroll me into automatic-approval program, I will keep it on their store as well.

<br>

### Introduction
This is the only extension on the market that has two major functionalities that no other extension in this category has. 

- Works on all video streaming platforms.
- Works on all embedded videos.

It doesn't matter if there are multiple direct or embedded video players on a single page. The extension is smart enough to manipulate the video that you put into a fullscreen, without affecting other video players.

If you are using multiple browsers on the same or different device, this extension is cross-browser and will work in all major browsers. It has been tested in _Chrome_, _Firefox_ and _Opera_; without a single issue.
There are many other browsers out there, that uses _Webkit engine_, so the extension will work in those browsers too.

<br>

### Who is it for?
It's for everyone who wants the power over video aspect ratio. This extension is primarily for UltraWide monitors, but that does not mean it's only good for it. You can manipulate the size of the video that contains horizontal or vertical black bars and let the video fill your entire screen for a better experience.

<br>

### How to use it?
The extension is fairly easy to use but very powerful at what it does. It has a couple of options...

- **Pause the extension** - _It will stop listening for all memory consuming events and restore any DOM manipulations.  _
- **Toggle between modes** - _Toggle between different modes that will affect the video: normal, upscale and stretch. _
- **Configurable shortcuts** - _Set desired keystroke, with min/max of 3 keys to control pause or mode toggling._

<br>

### Works everywhere?
To be honest, it is working on all **globally popular** video streaming platforms. Making a list of all platforms where this extension works would be huge and time consuming, so it's better to build a list of platforms where this extension doesn't work and specify the reason why.

| Platform | Issue | 
| --- | --- |
| [Movistar](https://ver.movistarplus.es/) | [investigation](https://github.com/dvlden/ultrawideo/issues/12#issuecomment-502765621) |
