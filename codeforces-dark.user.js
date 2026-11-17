// ==UserScript==
// @name         Codeforces — Night Slate
// @namespace    cf-night-slate
// @version      1.6.1
// @description  A clean, quiet dark theme for Codeforces. Toggle with Alt+Shift+D or the userscript menu.
// @match        *://codeforces.com/*
// @match        *://*.codeforces.com/*
// @run-at       document-start
// @homepageURL  https://github.com/Hav1ck/codeforces-dark
// @updateURL    https://raw.githubusercontent.com/Hav1ck/codeforces-dark/main/codeforces-dark.user.js
// @downloadURL  https://raw.githubusercontent.com/Hav1ck/codeforces-dark/main/codeforces-dark.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'cf-night-slate';
  const KEY = 'enabled';

  const get = (k, d) => { try { return typeof GM_getValue === 'function' ? GM_getValue(k, d) : d; } catch (_) { return d; } };
  const set = (k, v) => { try { if (typeof GM_setValue === 'function') GM_setValue(k, v); } catch (_) {} };

  const CSS = String.raw`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

/* ───────── Palette ─────────
   ink    page background
   slate  panels
   raise  headers, zebra rows, inputs
   rule   borders
   chalk  text
   signal links + accent (Codeforces blue, lifted for dark)
   The logo's yellow / blue / red appear only in the redrawn logo. */
:root {
  color-scheme: dark;
  --ink:      #111418;
  --slate:    #171b21;
  --raise:    #1e232b;
  --hover:    #242a34;
  --rule:     #2a303a;
  --rule-2:   #363d49;
  --chalk:    #dde2ea;
  --chalk-2:  #a3acba;
  --chalk-3:  #6f7887;
  --signal:   #8eabf2;
  --signal-2: #b3c7f7;
  --cf-yellow:#f2c14b;
  --cf-blue:  #5b84d6;
  --cf-red:   #e0564f;
  --ok:       #5ccf7c;
  --bad:      #ff6b6b;
  --warn:     #ffad5a;
  --code-bg:  #0d1014;

  --sans: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;

  /* Codeforces' own variables */
  --border-radius: 8px;
  --notice-color: var(--chalk-3);
  --border-color: var(--rule);
  --muted-color: var(--chalk-2);
  --highlighted-blue-color: rgba(142,171,242,.12);
  --highlighted-green-color: rgba(92,207,124,.12);
  --success-color: var(--ok);
  --warning-color: var(--warn);
  --error-color: var(--bad);
}

::selection { background: rgba(142,171,242,.35); color: #fff; }

/* Cloudflare Turnstile (submit captcha) lives in a closed shadow root + cross-origin iframe.
   color-scheme inherits into it; keeping it "light" stops Firefox painting an opaque white
   backdrop behind the frame. The script also asks Turnstile for its dark theme. */
.cf-turnstile, .turnstile-container { color-scheme: light; }

html, body {
  background: var(--ink) !important;
  color: var(--chalk) !important;
}
body, input, select, textarea, button, .rated-user, .problem-statement .header .title,
.problem-statement .section-title, .second-level-menu-list li, .menu-list, .caption {
  font-family: var(--sans) !important;
}
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

pre, code, tt, kbd, samp, .monospaced, .tt, .problem-statement .sample-tests,
.problem-statement .sample-tests pre, .source, #program-source-text, .prettyprint {
  font-family: var(--mono) !important;
  font-variant-ligatures: none;
}

/* Scrollbars (Firefox) */
* { scrollbar-color: var(--rule-2) transparent; scrollbar-width: thin; }

/* ───────── Links ───────── */
a, a:link { color: var(--signal); text-decoration: none; }
a:visited { color: #a99bdc; }
a:hover { color: var(--signal-2); text-decoration: underline; text-underline-offset: 2px; }
.ttypography a, .ttypography a:visited { color: var(--signal); }
.rated-user:hover { text-decoration: none !important; filter: brightness(1.15); }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
  outline: 2px solid var(--signal) !important; outline-offset: 2px;
}

/* Kill decorative corner images everywhere */
.lt, .rt, .lb, .rb, .ilt, .irt,
.roundbox .roundbox-lt, .roundbox .roundbox-rt, .roundbox .roundbox-lb, .roundbox .roundbox-rb { display: none !important; }

/* ───────── Header ─────────
   The PNG logo has a baked-in white box, so it's redrawn in CSS. The script moves the logo
   and the login links into the menu bar, then hides the old header row entirely. */
a:has(> img[src*="codeforces-logo"]) > img { display: none !important; }
a:has(> img[src*="codeforces-logo"]) {
  display: inline-flex; align-items: flex-end; gap: 9px;
  text-decoration: none !important;
  color: #f3f5f8 !important;
  font: 600 2.6rem/1 var(--sans);
  letter-spacing: -0.02em;
}
a:has(> img[src*="codeforces-logo"])::before {
  content: ""; width: 26px; height: 28px; flex: none; margin-bottom: 1px;
  background:
    linear-gradient(var(--cf-yellow), var(--cf-yellow)) 0    100% / 7px 58%  no-repeat,
    linear-gradient(var(--cf-blue),   var(--cf-blue))   9.5px 100% / 7px 100% no-repeat,
    linear-gradient(var(--cf-red),    var(--cf-red))    19px 100% / 7px 76%  no-repeat;
  border-radius: 2px;
}
a:has(> img[src*="codeforces-logo"])::after { content: "Codeforces"; }
.menu-list-container a.cfns-logo { font-size: 1.75rem; gap: 7px; padding: 0 6px 0 14px; flex: none; }
.menu-list-container > .menu-list li { white-space: nowrap; }
@media (max-width: 1180px) {
  .menu-list-container a.cfns-logo::after { content: none; }
  .menu-list-container > .menu-list li { margin-right: .8em !important; }
}
.menu-list-container a.cfns-logo::before {
  width: 17px; height: 18px;
  background:
    linear-gradient(var(--cf-yellow), var(--cf-yellow)) 0  100% / 5px 58%  no-repeat,
    linear-gradient(var(--cf-blue),   var(--cf-blue))   6px 100% / 5px 100% no-repeat,
    linear-gradient(var(--cf-red),    var(--cf-red))    12px 100% / 5px 76%  no-repeat;
}
#header.cfns-moved { display: none !important; }
#header .lang-chooser > div:first-child,
#header .lang-chooser a[href*="/register"] { display: none !important; }
#header .lang-chooser a { color: var(--chalk-2) !important; }

/* Menu bar: one flex row, everything vertically centered */
.roundbox.menu-box { height: auto !important; padding: 4px 0 !important; line-height: normal !important; margin-top: 0 !important; }
/* Vertical density: trim the gaps CF leaves above and below the menu bar */
#body { padding-top: 8px !important; }
#body > br[style*="3em"] { display: none !important; }
#pageContent { margin-top: 10px !important; padding-top: 0 !important; }
#sidebar { margin-top: 10px !important; }
#pageContent > .second-level-menu { position: static !important; margin: 4px 0 8px !important; padding: 0 !important; }
#pageContent > .second-level-menu .second-level-menu-list { height: 24px !important; }
.problemindexholder > div.ttypography { margin-top: .8em !important; }
.menu-list-container { display: flex !important; align-items: center; gap: 16px; padding-right: 12px; min-height: 30px; }
.menu-list-container > .menu-list {
  flex: 1; display: flex !important; align-items: center; flex-wrap: nowrap; min-width: 0;
  margin: 0 0 0 .8em !important; padding: 0 !important;
}
.menu-list-container > .menu-list li {
  float: none !important; top: 0 !important; margin: 0 1.1em 0 0 !important; padding: 0 !important;
}
.menu-list-container > .menu-list li a {
  float: none !important; height: auto !important; line-height: 28px !important; display: block;
}
.menu-list-container > form { display: flex; align-items: center; }
.menu-list-container > br { display: none; }
.menu-list-container input.search { float: none !important; margin: 0 !important; }
.cfns-auth { display: flex; align-items: center; gap: 12px; font-size: 1.35rem; white-space: nowrap; }
.cfns-auth a { color: var(--chalk-2) !important; font-weight: 500; text-decoration: none !important; }
.cfns-auth a:hover { color: var(--chalk) !important; }
.cfns-auth a[href*="/enter"] {
  color: var(--chalk) !important;
  border: 1px solid var(--rule-2); border-radius: 6px;
  padding: 0 12px; line-height: 2.2rem;
}
.cfns-auth a[href*="/enter"]:hover { border-color: var(--signal); }

/* ───────── Panels ───────── */
.roundbox, .roundbox.menu-box, .sidebox {
  background: var(--slate) !important;
  border: 1px solid var(--rule) !important;
  border-radius: var(--border-radius) !important;
  box-shadow: none !important;
}
.roundbox .caption { color: var(--chalk) !important; font-size: 1.4rem !important; font-weight: 600 !important; }
.roundbox .titled { border-bottom: 1px solid var(--rule) !important; padding: .5em .7em .6em !important; }
.roundbox .bottom-links { background: var(--raise) !important; border-top: 1px solid var(--rule) !important; }
.roundbox .dark, td.dark, tr.dark > td { background-color: var(--raise) !important; }
.roundbox .rtable td, .roundbox .rtable th { border-color: var(--rule) !important; }

/* ───────── Compact sidebar ───────── */
#sidebar > .roundbox, #sidebar > div > .roundbox { margin-bottom: 10px !important; }
#sidebar .roundbox .caption { font-size: 1.25rem !important; margin: 0 !important; }
#sidebar .roundbox .titled { padding: .55em .8em !important; }
#sidebar .sidebar-caption-icon { font-size: 1.4rem; opacity: .6; }
/* Collapsible frames (Virtual participation, Clone contest, …): hide the boilerplate, keep the button */
#sidebar [data-page-url] > div:not(:has(form, input, button, a)) { display: none !important; }
#sidebar [data-page-url] > div:has(form, input, button) { margin: 8px 10px 10px !important; text-align: left !important; }
#sidebar [data-page-url] > div:has(form, input, button) > div { margin: 0 !important; }
/* Contest info box */
#sidebar .rtable th, #sidebar .rtable td { padding: 5px 8px !important; font-size: 1.25rem !important; }
#sidebar .rtable img { max-height: 18px; }
#sidebar .rtable .contest-state-phase { font-size: 1.2rem; }
/* Submit form, tag list, materials */
#sidebar table.table-form td, #sidebar .sidebox form td { padding: 3px 6px !important; }
#sidebar .sidebox form .submit, #sidebar .sidebox form input[type=submit] { margin: 6px 0 2px !important; }
#sidebar .sidebox > div[style*="padding: 0.5em"] { padding: 8px !important; }
#sidebar .sidebar-menu ul { margin: 6px 8px !important; font-size: 1.25rem !important; }
#sidebar .sidebar-menu ul li { margin: 0 !important; padding: 3px 6px !important; }
#sidebar .notice { font-size: 1.1rem; }

/* ───────── Problem pages: sidebar becomes a slide-in drawer ───────── */
body.cfns-drawer #pageContent.content-with-sidebar { margin-right: 1em !important; }
body.cfns-drawer #sidebar {
  position: fixed !important; top: 0; right: 0; bottom: 0;
  width: 320px; margin: 0 !important; float: none !important; display: block !important;
  overflow-y: auto; padding: 16px 14px;
  background: var(--ink); border-left: 1px solid var(--rule);
  box-shadow: -12px 0 32px rgba(0,0,0,.45);
  z-index: 1000;
  transform: translateX(100%); visibility: hidden;
  transition: transform .2s ease, visibility 0s linear .2s;
}
body.cfns-drawer.cfns-drawer-open #sidebar {
  transform: none; visibility: visible;
  transition: transform .2s ease, visibility 0s;
}
.cfns-drawer-btn {
  flex: none; cursor: pointer;
  background: transparent !important; color: var(--chalk-2) !important;
  border: 1px solid var(--rule-2) !important; border-radius: 6px !important;
  padding: 0 12px !important; font: 500 1.3rem/2.2rem var(--sans) !important;
}
.cfns-drawer-btn:hover, body.cfns-drawer-open .cfns-drawer-btn { color: var(--chalk) !important; border-color: var(--signal) !important; }
/* Whatever paints white inside the submit form, flatten it */
#sidebar form *:not(input):not(select):not(textarea):not(button):not(option):not(iframe):not(img) { background-color: transparent !important; }

/* ───────── Main menu ───────── */
.menu-box { overflow: hidden; }
.menu-list li a {
  color: var(--chalk-2) !important; font-weight: 500; text-decoration: none !important;
  text-transform: none !important; font-family: var(--sans) !important; font-size: 1.45rem !important;
}
.menu-list li a:hover { color: var(--chalk) !important; }
.menu-list li.current { border-bottom: none !important; box-shadow: inset 0 -2px 0 var(--signal); }
.menu-list li.current a { color: var(--chalk) !important; }
input.search {
  background: var(--raise) !important;
  border: 1px solid var(--rule) !important;
  border-radius: 6px !important;
  color: var(--chalk) !important;
  padding-left: .6em !important;
  background-image: none !important;
}

/* Second-level (contest) tabs: drop the lava-lamp sprite */
.second-level-menu-list li.backLava, .second-level-menu-list li.backLava .leftLava { background: none !important; display: none !important; }
.second-level-menu { background: var(--ink); padding: 0 6px; border-radius: 6px; }
.second-level-menu-list li a {
  color: var(--chalk-3) !important;
  text-transform: none !important;
  font-size: 1.3rem !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}
.second-level-menu-list li a:hover { color: var(--chalk) !important; }
.second-level-menu-list li.current a, .second-level-menu-list li.selectedLava a {
  color: var(--chalk) !important;
  box-shadow: inset 0 -2px 0 var(--signal);
}

/* ───────── Tables ───────── */
.datatable { background: var(--slate) !important; border: 1px solid var(--rule); border-radius: var(--border-radius); padding-bottom: 0 !important; overflow: hidden; }
.datatable > div:first-of-type { color: var(--chalk) !important; font-weight: 600; }
.datatable td, .datatable th,
table.standings td, table.standings th,
.status-frame-datatable td, .status-frame-datatable th,
.bordertable td, .bordertable th, table.table-form td {
  border-color: var(--rule) !important;
  color: inherit;
}
.datatable th, table.standings th, .status-frame-datatable th {
  background: var(--raise) !important;
  color: var(--chalk-2) !important;
  font-weight: 600 !important;
}
.datatable table tr:hover > td,
table.standings tr:hover > td,
.status-frame-datatable tr:hover > td { background-color: var(--hover) !important; }
.highlighted-row td, .highlighted-row th { background-color: rgba(142,171,242,.14) !important; }
table, td, th { border-color: var(--rule); }
.datatable .closed, .datatable .opened { filter: invert(.8); }
.datatable .filter input { background: var(--raise) !important; color: var(--chalk) !important; border-color: var(--rule) !important; }

/* Problem list states */
.problems .accepted-problem td.act { background-color: rgba(92,207,124,.13) !important; }
.problems .accepted-problem td.id  { border-left: 4px solid var(--ok) !important; }
.problems .rejected-problem td.act { background-color: rgba(255,107,107,.12) !important; }
.problems .rejected-problem td.id  { border-left: 4px solid var(--bad) !important; }
.problems .submitted-verdict-problem td.act { background-color: rgba(142,171,242,.12) !important; }
.problems .submitted-verdict-problem td.id  { border-left: 4px solid var(--signal) !important; }
.accepted-problem { background-color: transparent !important; }
tr.accepted-problem > td { background-color: rgba(92,207,124,.07) !important; }
tr.rejected-problem > td { background-color: rgba(255,107,107,.06) !important; }

/* Standings cells */
.cell-accepted, .cell-passed-system-test, .standings .cell-accepted { color: var(--ok) !important; }
.cell-rejected, .cell-failed-system-test, .cell-challenged { color: var(--bad) !important; }
.cell-time { color: var(--chalk-3) !important; }
.standings .first-accepted, .first-accepted { background-color: rgba(92,207,124,.16) !important; }

/* ───────── Verdicts ───────── */
.verdict-accepted, .verdict-accepted-challenged, .verdict-successful-challenge { color: var(--ok) !important; }
.verdict-failed, .verdict-challenged { color: var(--bad) !important; }
.verdict-rejected, .verdict-unsuccessful-challenge { color: #9fb0ff !important; }
.verdict-waiting { color: var(--chalk-3) !important; }
.error, .red-link { color: var(--bad) !important; }
.warning { color: var(--warn) !important; }
.welldone { color: var(--ok) !important; }
.countdown { color: var(--chalk-2) !important; }

/* ───────── Rating colors, retuned for dark ───────── */
.user-gray   { color: #9aa1ac !important; }
.user-green  { color: #4fcf6f !important; }
.user-cyan   { color: #3ed2c4 !important; }
.user-blue   { color: #7891ff !important; }
.user-violet { color: #d07cff !important; }
.user-orange { color: #ffa24a !important; }
.user-yellow { color: #ebdc4a !important; }
.user-red, .user-legendary, .user-fire { color: #ff5a5a !important; }
.user-legendary::first-letter, .legendary-user-first-letter,
.user-4000, .user-admin { color: #f3f5f8 !important; }
.user-4000::first-letter, .user-4000-first-letter { color: #ff5a5a !important; }
.user-black { color: var(--chalk) !important; }

/* ───────── Problem statement ───────── */
.ttypography, .problem-statement { color: var(--chalk) !important; }
.problem-statement { line-height: 1.65; }

.problem-statement .header {
  /* Title on the left, limits on the right, one row */
  display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 1.6em; row-gap: .3em;
  text-align: left !important;
  padding-bottom: 1em;
  margin: .6em 0 1.4em !important;
  border-bottom: 1px solid var(--rule);
}
.problem-statement .header .title {
  flex: 1 1 auto;
  font-size: 2.4rem !important;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #f3f5f8;
  margin: 0 !important;
}
.problem-statement .header .time-limit,
.problem-statement .header .memory-limit,
.problem-statement .header .input-file,
.problem-statement .header .output-file {
  display: block;
  margin: 0 !important;
  color: var(--chalk);
  font-size: 1.3rem;
  white-space: nowrap;
}
/* Standard I/O is the same on nearly every problem; only show file-based I/O */
.problem-statement .header .input-file.input-standard,
.problem-statement .header .output-file.output-standard { display: none !important; }
.problem-statement .header .property-title { color: var(--chalk-3); padding-right: .35em; }
.problem-statement .header .property-title::after { content: "" !important; }

.problem-statement .section-title {
  color: #f3f5f8;
  font-size: 1.6rem !important;
  font-weight: 600 !important;
  margin: 1.4em 0 .5em;
}
.problem-statement .legend + div .section-title,
.problem-statement .input-specification .section-title { margin-top: .6em; }

/* Samples */
.problem-statement .sample-tests { font-size: 1.3rem !important; }
.problem-statement .sample-tests .input,
.problem-statement .sample-tests .output,
.problem-statement .sample-tests .interaction-log {
  border: 1px solid var(--rule) !important;
  border-radius: 8px;
  overflow: hidden;
  background: var(--code-bg);
}
.problem-statement .sample-tests .output { margin-top: .6em !important; }
.problem-statement .sample-tests .title {
  background: var(--raise);
  color: var(--chalk-2);
  border-bottom: 1px solid var(--rule) !important;
  text-transform: none !important;
  font-family: var(--sans) !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  padding: .45em .8em !important;
}
.problem-statement .sample-tests pre {
  background: var(--code-bg) !important;
  color: var(--chalk) !important;
  padding: .7em .8em !important;
  line-height: 1.5 !important;
  border: 0 !important;
  border-radius: 0 !important;
  margin: 0 !important;
}
.problem-statement .test-example-line-even { background-color: rgba(255,255,255,.045) !important; }
.problem-statement .test-example-line-odd  { background-color: transparent !important; }
/* CF highlights the hovered test case with an inline background; show it as a blue tint */
.problem-statement .test-example-line[style*="background-color"] { background-color: rgba(110,150,240,.22) !important; }
.testCaseMarker { color: var(--signal) !important; }
.problem-statement .interaction-log pre { color: var(--chalk) !important; }
.problem-statement .interaction-log .IN  { background-color: rgba(142,171,242,.10) !important; }
.problem-statement .interaction-log .OUT { background-color: rgba(255,255,255,.05) !important; }
.problem-statement .interaction-log .direction { color: var(--chalk-3) !important; }
.problem-statement .interaction-log .noNewLine { background-color: rgba(255,107,107,.3) !important; }

.input-output-copier {
  background: transparent !important;
  color: var(--chalk-3) !important;
  border: 1px solid var(--rule-2) !important;
  border-radius: 5px !important;
  font-family: var(--sans) !important;
  text-transform: none !important;
  padding: 1px 8px !important;
}
.input-output-copier:hover { color: var(--chalk) !important; border-color: var(--signal) !important; }

.problem-statement .note, .problem-statement .tutorial { color: var(--chalk) !important; }
.problem-statement .tex-tabular td, .problem-statement .tex-tabular th { border-color: var(--rule-2) !important; }
.problem-statement .tex-font-style-tt, .tex-font-style-tt { font-family: var(--mono) !important; }

/* Images: formula renders get inverted, diagrams get a light backing so black lines survive */
img.tex-formula, img.tex-graphics[src*="formula"] { filter: invert(.88) hue-rotate(180deg); }
.ttypography img:not(.tex-formula):not([src*="flags"]):not([src*="icons"]) {
  background: #eceff3; border-radius: 6px; padding: 4px;
}

/* MathJax inherits text color */
.MathJax, .MathJax_Display, .MathJax_CHTML, mjx-container, .MathJax_SVG,
html body div.ttypography .MathJax, html body div.ttypography .MathJax_Display { color: inherit !important; }
.MathJax_Preview { color: var(--chalk-3) !important; }

/* ───────── Sidebar link lists (contest materials etc.) ───────── */
.sidebar-menu ul li { border: 1px solid transparent !important; border-radius: 6px; }
.sidebar-menu ul li:hover { background: var(--hover) !important; border-color: var(--rule) !important; }
.sidebar-menu ul li.active { background: rgba(142,171,242,.12) !important; border-color: rgba(142,171,242,.3) !important; }
.sidebar-menu ul a { color: var(--chalk) !important; font-family: var(--sans) !important; }
.sidebar-menu ul li::marker { color: var(--chalk-3); }
.resource-locale { color: var(--chalk-3) !important; }
.delete-resource-link { filter: invert(.75); opacity: .6; }

/* ───────── Typography (blogs, comments) ───────── */
div.ttypography, .problem-statement, div.ttypography h1, div.ttypography h2, div.ttypography h3,
div.ttypography h4, div.ttypography h5, div.ttypography h6 { font-family: var(--sans) !important; }
.topic .content { border-left: 3px solid var(--rule-2) !important; }
.ttypography h1, .ttypography h2, .ttypography h3, .ttypography h4 { color: #f3f5f8 !important; }
.ttypography code, .ttypography .tt, code.tt {
  background: var(--raise) !important;
  color: #e6c7a1 !important;
  border-radius: 4px; padding: .1em .35em;
}
.ttypography pre, pre.prettyprint, .source, #program-source-text, pre.linenums {
  background: var(--code-bg) !important;
  border: 1px solid var(--rule) !important;
  border-radius: 8px;
  color: var(--chalk) !important;
}
.ttypography blockquote { border-left: 3px solid var(--rule-2) !important; color: var(--chalk-2) !important; background: transparent !important; }
.ttypography table.bordertable td, .ttypography table.bordertable th { border-color: var(--rule-2) !important; background: transparent !important; }
.ttypography hr { border-color: var(--rule) !important; }
.spoiler-content, .spoiler { background: var(--slate) !important; border-color: var(--rule) !important; }
.spoiler-title { color: var(--signal) !important; }

.topic .title a, .topic .title p { color: #f3f5f8 !important; }
.topic .info, .topic .meta, .left-meta, .right-meta, .comment-table .info, .comment-table .info .item a { color: var(--chalk-3) !important; }
.topic-read-more, .comments .title { color: var(--signal) !important; }
.comment-table .reply a { color: var(--chalk-3) !important; }
.comment-table .reply:hover a { color: var(--chalk) !important; }
.comment-content { color: var(--chalk); }
.comment-bad, .comment-too-bad { opacity: .45 !important; }

/* Prettify (code blocks) */
.prettyprint .pln { color: #dde2ea !important; }
.prettyprint .str, .prettyprint .atv { color: #a5d6a7 !important; font-weight: 400 !important; }
.prettyprint .kwd, .prettyprint .tag { color: #c4a7ff !important; font-weight: 400 !important; }
.prettyprint .com { color: #6f7887 !important; font-weight: 400 !important; font-style: italic; }
.prettyprint .typ, .prettyprint .atn, .prettyprint .dec, .prettyprint .var { color: #7fc8f8 !important; font-weight: 400 !important; }
.prettyprint .lit { color: #f5b36b !important; }
.prettyprint .pun, .prettyprint .opn, .prettyprint .clo { color: #a3acba !important; }
.prettyprint .fun { color: #f2c14b !important; }
ol.linenums li { background: transparent !important; color: var(--chalk-3) !important; }
ol.linenums li > * { color: var(--chalk); }

/* ───────── Forms & buttons ───────── */
input:not([type=checkbox]):not([type=radio]):not([type=image]), select, textarea {
  background-color: var(--raise) !important;
  color: var(--chalk) !important;
  border: 1px solid var(--rule-2) !important;
  border-radius: 6px;
}
input[type=submit], input[type=button], button, .button-link, a.button {
  background: var(--hover) !important;
  color: var(--chalk) !important;
  border: 1px solid var(--rule-2) !important;
  border-radius: 6px !important;
  padding: .3em .9em !important;
  cursor: pointer;
}
input[type=submit]:hover, input[type=button]:hover, button:hover { border-color: var(--signal) !important; }
.table-form .field-name, .field-name { color: var(--chalk-2) !important; }
.fieldRequired, .error__submittedProblemIndex { color: var(--bad) !important; }
.tag-box {
  background: var(--raise) !important;
  border: 1px solid var(--rule) !important;
  border-radius: 999px !important;
  color: var(--chalk-2) !important;
  padding: 1px 8px !important;
}
.tag-box:hover { color: var(--chalk) !important; border-color: var(--rule-2) !important; }
/* Each tag sits in its own little roundbox wrapper; flatten it so only the pill shows */
.roundbox:has(> .tag-box) {
  background: transparent !important; border: 0 !important; border-radius: 0 !important;
  padding: 0 !important; margin: 0 6px 6px 0 !important; box-shadow: none !important;
}

/* Ace editor (submit page) */
.ace-tm { background: var(--code-bg) !important; color: var(--chalk) !important; }
.ace-tm .ace_gutter { background: var(--slate) !important; color: var(--chalk-3) !important; }
.ace-tm .ace_marker-layer .ace_active-line { background: rgba(255,255,255,.04) !important; }
.ace-tm .ace_gutter-active-line { background: var(--raise) !important; }
.ace-tm .ace_cursor { color: var(--chalk) !important; border-color: var(--chalk) !important; }
.ace-tm .ace_marker-layer .ace_selection { background: rgba(142,171,242,.3) !important; }
.ace-tm .ace_keyword, .ace-tm .ace_storage { color: #c4a7ff !important; }
.ace-tm .ace_string { color: #a5d6a7 !important; }
.ace-tm .ace_comment { color: #6f7887 !important; }
.ace-tm .ace_constant.ace_numeric { color: #f5b36b !important; }
.ace-tm .ace_support.ace_function, .ace-tm .ace_entity.ace_name.ace_function { color: #f2c14b !important; }
.ace-tm .ace_print-margin { background: var(--rule) !important; }

/* ───────── Popups, alerts, notifications ───────── */
#facebox .popup, #facebox .content, #facebox .body, #facebox table, #facebox td,
.jGrowl-notification, .jGrowl-closer, .colorbox, #cboxContent, #cboxLoadedContent {
  background: var(--slate) !important;
  color: var(--chalk) !important;
  border-color: var(--rule) !important;
}
#facebox .content, .jGrowl-notification { border: 1px solid var(--rule-2) !important; border-radius: 10px !important; }
#facebox .tl, #facebox .tr, #facebox .bl, #facebox .br, #facebox .b { background: transparent !important; }
#facebox_overlay, #cboxOverlay { background: #000 !important; }

.alert, .alert-info, .alert-warning, .alert-danger, .alert-success { border-radius: 8px !important; }
.alert-info    { color: #b3c7f7 !important; background: rgba(142,171,242,.10) !important; border-color: rgba(142,171,242,.3) !important; }
.alert-warning { color: #f5d08a !important; background: rgba(242,193,75,.09) !important; border-color: rgba(242,193,75,.28) !important; }
.alert-danger  { color: #ffb3b3 !important; background: rgba(255,107,107,.10) !important; border-color: rgba(255,107,107,.3) !important; }
.alert-success { color: #a6e6b8 !important; background: rgba(92,207,124,.10) !important; border-color: rgba(92,207,124,.3) !important; }

.datepick-popup, .ac_results, .ac_results li { background: var(--slate) !important; color: var(--chalk) !important; border-color: var(--rule) !important; }
.ac_over { background: var(--hover) !important; }

/* ───────── Profile ───────── */
.userbox, .userbox .info { background: transparent !important; color: var(--chalk) !important; }
.userbox .user-rank, .main-info .user-rank { font-weight: 600; }
#userActivityGraph rect[fill="#EBEDF0" i], #userActivityGraph rect[fill="#ebedf0" i] { fill: var(--raise) !important; }
#userActivityGraph text { fill: var(--chalk-3) !important; }
#usersRatingGraphPlaceholder, .legendColorBox > div { border-color: var(--rule) !important; }
#usersRatingGraphPlaceholder .legend > div { background: var(--slate) !important; }
#usersRatingGraphPlaceholder .tickLabel { color: var(--chalk-3) !important; }

/* ───────── Pagination, footer, misc ───────── */
.pagination li span, .pagination li a { color: var(--chalk-2) !important; border-color: var(--rule) !important; }
.pagination li.active span, .pagination li.active a { color: var(--chalk) !important; background: var(--raise) !important; }
#footer { display: none !important; }
.notice, .small, .smaller, .format-humantime, .contest-state-phase { color: var(--chalk-3); }
.button-up, .side-bell { color: var(--chalk-3) !important; }
hr { border-color: var(--rule); background: var(--rule); }

/* ───────── Inline-style overrides (CF hardcodes white/grey backgrounds) ───────── */
[style*="background-color: white" i], [style*="background-color:white" i],
[style*="background: white" i], [style*="background:white" i],
[style*="background-color: #fff" i], [style*="background-color:#fff" i],
[style*="background-color: rgb(255, 255, 255)" i] { background-color: transparent !important; }
.datatable[style*="#E1E1E1" i], [style*="background-color: #E1E1E1" i],
[style*="background-color: #F5F5F5" i], [style*="background-color: #eee" i],
[style*="background-color: #efefef" i], [style*="background-color: #f8f8f8" i] { background-color: var(--slate) !important; }
[style*="185, 185, 185"], [style*="#b9b9b9" i], [style*="#e1e1e1" i], [style*="solid #ccc" i], [style*="solid #ddd" i] { border-color: var(--rule) !important; }
[style*="color:green" i], [style*="color: green" i] { color: var(--ok) !important; }
[style*="color:gray" i], [style*="color: gray" i], [style*="color:#888" i], [style*="color: #888" i] { color: var(--chalk-3) !important; }
[style*="color:black" i], [style*="color: black" i], [style*="color:#000" i], [style*="color: #000" i] { color: var(--chalk) !important; }
[style*="color:red" i], [style*="color: red" i] { color: var(--bad) !important; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
`;

  function apply() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = CSS;
    (document.head || document.documentElement).appendChild(el);
  }

  function remove() {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  // Keep our sheet last in <head> so it wins ties against CF's late-loaded CSS.
  function keepLast() {
    const el = document.getElementById(STYLE_ID);
    if (el && document.head && el.parentNode !== document.head) document.head.appendChild(el);
    else if (el && document.head && document.head.lastElementChild !== el) document.head.appendChild(el);
  }

  // Fold the header row into the menu bar: logo on the left, Enter (or handle + Logout) on the right.
  // The header is hidden only once both have been moved, so nothing is lost if CF changes its markup.
  function moveAuth() {
    if (!document.getElementById(STYLE_ID)) return;
    const header = document.getElementById('header');
    const menu = document.querySelector('.menu-list-container');
    if (!header || !menu || menu.querySelector('.cfns-auth')) return;

    const logo = header.querySelector('a:has(> img[src*="codeforces-logo"])') ||
                 header.querySelector('img[src*="logo"]')?.closest('a');
    const chooser = header.querySelector('.lang-chooser');
    const links = chooser ? [...chooser.querySelectorAll('a')].filter((a) =>
      !a.querySelector('img') && !/\/register\b/.test(a.getAttribute('href') || '')) : [];
    if (!logo || !links.length) return;

    logo.classList.add('cfns-logo');
    menu.insertBefore(logo, menu.firstChild);

    const box = document.createElement('div');
    box.className = 'cfns-auth';
    links.forEach((a) => box.appendChild(a));
    menu.appendChild(box);

    header.classList.add('cfns-moved');
  }

  // On problem pages, turn the sidebar into a drawer opened by a "Sidebar" button in the menu bar.
  function setupDrawer() {
    if (!document.getElementById(STYLE_ID)) return;
    const sidebar = document.getElementById('sidebar');
    const menu = document.querySelector('.menu-list-container');
    if (!sidebar || !menu || !document.querySelector('.problem-statement')) return;
    if (document.querySelector('.cfns-drawer-btn')) return;

    document.body.classList.add('cfns-drawer');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cfns-drawer-btn';
    btn.textContent = 'Sidebar';
    btn.title = 'Show contest sidebar (Alt+Shift+S)';
    btn.setAttribute('aria-controls', 'sidebar');
    btn.setAttribute('aria-expanded', 'false');
    const auth = menu.querySelector('.cfns-auth');
    const form = menu.querySelector(':scope > form');
    menu.insertBefore(btn, form || auth || null);

    const setOpen = (open) => {
      document.body.classList.toggle('cfns-drawer-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!document.body.classList.contains('cfns-drawer-open'));
    });
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('cfns-drawer-open') && !sidebar.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.altKey && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); btn.click(); }
    });
  }

  // Turnstile reads data-theme / data-appearance when it renders, so set them as soon as the
  // element is parsed. "interaction-only" keeps the widget hidden unless a click is actually needed.
  function tuneTurnstile(root) {
    if (!document.getElementById(STYLE_ID)) return;
    const els = root.matches?.('.cf-turnstile') ? [root] : root.querySelectorAll?.('.cf-turnstile') || [];
    for (const el of els) {
      if (!el.hasAttribute('data-theme')) el.setAttribute('data-theme', 'dark');
      if (!el.hasAttribute('data-appearance')) el.setAttribute('data-appearance', 'interaction-only');
    }
  }
  const turnstileObserver = new MutationObserver((records) => {
    for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) tuneTurnstile(n);
  });
  turnstileObserver.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', () => setTimeout(() => turnstileObserver.disconnect(), 5000));

  function toggle() {
    const on = !document.getElementById(STYLE_ID);
    on ? (apply(), keepLast(), moveAuth(), setupDrawer()) : remove();
    set(KEY, on);
  }

  if (get(KEY, true)) apply();
  document.addEventListener('DOMContentLoaded', () => { keepLast(); moveAuth(); setupDrawer(); });
  window.addEventListener('load', keepLast);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'D' || e.key === 'd' || e.code === 'KeyD')) {
      e.preventDefault();
      toggle();
    }
  });

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Toggle dark theme (Alt+Shift+D)', toggle);
  }
})();
