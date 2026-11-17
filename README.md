# Codeforces — Night Slate

A clean, quiet dark theme for [Codeforces](https://codeforces.com), as a userscript.

![Problem page with the theme applied](screenshot.png)

## Install

1. Install [Violentmonkey](https://violentmonkey.github.io/) (or Tampermonkey).
2. Open **[codeforces-dark.user.js](https://raw.githubusercontent.com/Hav1ck/codeforces-dark/main/codeforces-dark.user.js)** and click **Install**.

Updates are picked up automatically by the userscript manager.

### Without automatic updates

If you'd rather not receive updates automatically, add the script by hand:

1. Open the [script source](codeforces-dark.user.js) and copy all of it.
2. Click the Violentmonkey icon in your browser toolbar, then the **+** button (*Create a new script*).
3. Replace the template with the copied code and press **Ctrl+S**.

A script added this way never changes unless you paste in a new version yourself.

> **A note on trust:** a userscript runs on codeforces.com with your logged-in session, and auto-updates install whatever is pushed to this repo without asking. Read the code before installing any userscript, and use the manual method above if you want to review every change yourself.

## What it does

- Dark slate palette across the whole site: tables, standings, blogs, comments, forms, popups, code blocks
- Rating colors retuned so every rank stays readable on dark
- MathJax and statement images adjusted for dark backgrounds
- Compact header: logo, menu, search and login folded into one bar; language flags, Register link and footer removed
- Problem pages: centered statement, title and limits on one row, sidebar moved into a slide-in drawer (tags stay hidden unless you open it)
- Sample tests keep Codeforces' hover highlighting of matching test cases
- Submit captcha (Cloudflare Turnstile) rendered dark and only shown when it needs a click

## Shortcuts

| Keys | Action |
| --- | --- |
| `Alt+Shift+D` | Toggle the theme on/off (also in the userscript menu) |
| `Alt+Shift+S` | Open/close the sidebar drawer on problem pages |
| `Esc` | Close the drawer |
