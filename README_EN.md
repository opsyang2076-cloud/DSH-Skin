# DSH Skin - Apple Style for DeepSeek

An Apple-style glassmorphism skin for the DeepSeek web app (chat.deepseek.com). Change the background, adjust glass transparency and blur, and every setting applies live and persists locally.

> 中文文档：[README.md](README.md)

## Features

- Apple-style theme: frosted glass surfaces, SF system font stack, iOS-style controls, slim scrollbars
- Background switching: 10 preset gradients, custom image URL, local image upload, one-click clear
- Glass transparency: continuous adjustment from 10% to 100%
- Background blur: continuous adjustment from 0 to 40px
- Light / dark / auto (follows system) appearance modes
- Settings live in a draggable floating ball; everything is stored locally
- No network requests, no data collection

## Installation

### Option 1: Chrome / Edge extension (developer mode)

1. Download this repository and unzip it to a fixed location
2. Open the extensions page: type `chrome://extensions` in the address bar (`edge://extensions` for Edge)
3. Turn on "Developer mode" in the top-right corner
4. Click "Load unpacked" and select this directory (the folder containing manifest.json)
5. Open chat.deepseek.com; a palette floating ball appears at the bottom-right

### Option 2: Tampermonkey userscript

1. Install the Tampermonkey extension
2. Click the Tampermonkey icon → "Add a new script"
3. Replace the template with the full contents of `dsh-skin.user.js` and save (Ctrl+S)
4. Open chat.deepseek.com

### Option 3: DeepSeek Harness desktop plugin (Cordis)

1. Open the Plugins page in DeepSeek Harness and click "Add plugin" in the top-right corner
2. Enter the full HTTPS URL (the `https://` prefix is required, otherwise pnpm reports an unsupported protocol error):

   ```
   https://github.com/opsyang2076-cloud/DSH-Skin.git
   ```

3. After installation the plugin appears in the plugin list; enable it
4. Open the chat view; a palette floating ball appears at the bottom-right

How it works: the package follows the official bundle convention by declaring `dsh.bundle.patch` and `dsh.client` in package.json. The host half (index.js) is a no-op; the client half (client.js) registers into the web client through `window.__ModuleLoader__`, injects the glassmorphism styles and the floating-ball settings panel, and manages the style lifecycle with `ctx.effect` (styles are removed automatically when the plugin is disabled).

## Usage

A palette floating ball sits at the bottom-right of the page. Click it to open the settings panel:

| Setting | Description |
|---|---|
| Enable skin | Master switch; off restores the original DeepSeek look |
| Appearance | Light / dark / auto (follows system) |
| Preset backgrounds | 10 gradient swatches, click to apply |
| Image URL | Paste an https image link and click Apply |
| Upload local image | Files over 4MB may exceed the storage quota; compress first |
| Glass opacity | Lower means more transparent; default 72% |
| Background blur | 0 disables blur; default 20px |
| Reset | Restores all defaults (floating ball position is kept) |

Hold and drag the floating ball anywhere you like; the position is remembered.

## Project structure

```
DSH-Skin/
├── index.js             # Cordis bundle host entry (no-op)
├── client.js            # Client module: injects styles + floating panel (generated)
├── cordis.patch.yml     # Bundle patch: inserts the dsh-skin plugin row
├── icon.svg             # Plugin icon
├── lib/                 # Client sources
│   ├── page.css         #   Glass theme + panel styles
│   └── page.js          #   Floating-ball settings panel logic
├── scripts/
│   └── build-client.mjs #   Inlines lib/ into client.js
├── manifest.json        # Chrome extension manifest (Manifest V3, optional form)
├── styles.css           # Theme styles (Chrome extension version)
├── content.js           # Settings panel logic (Chrome extension version)
├── dsh-skin.user.js     # Single-file userscript
├── icons/               # Chrome extension icons
├── LICENSE              # MIT
├── README.md            # Chinese documentation
└── README_EN.md         # This file
```

## Known limitations

- The DeepSeek frontend uses hashed class names and changes over time. If the skin breaks someday, the page structure probably changed. The skin relies on structural selectors (aside, header, class-substring matches) to reduce that risk, but it cannot rule it out. Open an issue if that happens.
- Locally uploaded images are stored as dataURLs in localStorage, which caps out around 5MB depending on the browser. When the quota is hit you will see a prompt; switch to an image URL instead.
- The extension and the userscript share the same localStorage key. Install one or the other in the same browser, not both, or they will overwrite each other's settings.

## Customization

To change colors, radii, or fonts, edit the `:root` variable block at the top of `styles.css`; every visual parameter lives there. For the userscript, the equivalent block is the `GM_CSS` template at the top of `dsh-skin.user.js`.

## License

MIT. See [LICENSE](LICENSE).
