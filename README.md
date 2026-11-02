# RetroVerse

A static retro-gaming library with a dark, cinematic interface inspired by modern cloud-gaming platforms.

## Run locally

Open `index.html` in a modern browser. No build step, account system, database, or application server is required.

## Deploy with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then save.
4. GitHub Pages will publish the site at the repository's Pages URL.

## Current features

- Responsive gaming-library interface
- Search, platform filters, game details and favorites
- Favorites and recently played list stored locally in the visitor's browser
- EmulatorJS browser player integration for the listed platforms
- ROM selection from the visitor's own device; ROM files are not uploaded to this repository or a RetroVerse server
- No visitor accounts or login

## Playing games

Choose a game card, select **Choose ROM & play**, and pick a compatible game file from your device. The emulator assets load from the EmulatorJS CDN. Supported core mappings currently include NES, SNES, Sega Mega Drive, Game Boy, Arcade (MAME 2003 Plus), and PlayStation (PS1).

Some systems or games may require additional BIOS files or specific ROM formats. Arcade ROM sets in particular must match the selected MAME core. Browser/device performance varies. The emulator integration should be tested with the exact ROM formats and devices you plan to support.

Only use game files and BIOS files that you own or are legally authorized to use. RetroVerse does not distribute copyrighted ROMs or BIOS files.

## Privacy and storage

RetroVerse has no user registration or login. Favorites and recently played IDs are saved in the browser's local storage on that device. Browser emulator save states are managed by the emulator/browser and may not sync to other devices. Clearing browser data can remove local information.

## Architecture

GitHub Pages serves the static site. Emulation runs client-side in the visitor's browser. There is no RetroVerse application backend or user database.
