# Zync Extensions: Developer Guide

This guide explains how to build, test, and publish extensions for Zync.

---

## 🛠️ Plugin Types

Zync supports two types of extensions:

| Type | How it works |
|---|---|
| **Tool Plugin** | A `main.js` file that registers commands, listens to events, and controls the terminal via `window.zync`. |
| **Panel Plugin** | An `index.html` + `main.js` that renders a full custom tab inside a connection view. |

---

## 🔒 Permissions

Every API call your plugin makes is gated by the `permissions` array in your `manifest.json`. If you call an API without the matching permission, Zync will **silently block** the call and log a warning to the developer console.

```json
{
  "id": "com.yourname.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "main": "main.js",
  "permissions": ["terminal:write", "ssh:exec"]
}
```

### Available Permission Tokens

| Token | API Gated |
|---|---|
| `terminal:write` | `zync.terminal.send()` |
| `terminal:newtab` | `zync.terminal.newTab()` |
| `ssh:exec` | `zync.ssh.exec()` |
| `statusbar:write` | `zync.statusBar.set()` |
| `ui:notify` | `zync.ui.notify()` |
| `ui:confirm` | `zync.ui.confirm()` |

> [!IMPORTANT]
> Only declare permissions your plugin actually uses. Unnecessary permissions will flag your plugin during community review.

---

## 📝 TypeScript Support (3 methods)

### Method 1: Drop-In File
Download [`packages/plugin-api/index.d.ts`](packages/plugin-api/index.d.ts) and place it in your plugin folder. VS Code will automatically pick it up and give you full autocomplete.

### Method 2: JSDoc (No files needed)
Add a single comment to the top of your `main.js`:
```javascript
/** @type {import('./index.d.ts').ZyncAPI} */
const zync = window.zync;

// Full autocomplete from here on!
zync.terminal.send('uptime\n');
```

### Method 3: NPM Package
If you are using a build tool (Vite, esbuild), install the types:
```bash
npm install --save-dev @zync/plugin-api
```

Add to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["@zync/plugin-api"]
  }
}
```

---

## 📦 Managing Dependencies

Zync plugins are plain JS/HTML. There are two patterns for using libraries:

### Option A: CDN (No build step, for simple plugins)
```html
<!-- index.html -->
<script src="https://unpkg.com/lodash@4.17.21/lodash.min.js"></script>
<script src="main.js"></script>
```

### Option B: Bundling (Recommended for complex plugins)
Use a bundler (Vite, esbuild) to bake all your dependencies into a single `main.js`. Users do NOT need Node.js — only install dependencies on your development machine.

```bash
# Install deps
npm install

# Build to a single dist/main.js
npm run build
```

> [!WARNING]
> **Never** include `node_modules` in your plugin `.zip`. Only ship the final `dist/main.js`.

---

## 🔐 Generating a SHA-256 Checksum

Before publishing a new version, generate the checksum of your `.zip` and add it to `marketplace.json`. This protects users from supply-chain attacks.

**Using the helper script:**
```bash
bash scripts/hash-plugin.sh <plugin-folder-name>
# Example: bash scripts/hash-plugin.sh ssh-quick-commands
```

**Manually (macOS/Linux):**
```bash
shasum -a 256 plugins/my-plugin.zip
```

**Manually (Windows PowerShell):**
```powershell
Get-FileHash plugins\my-plugin.zip -Algorithm SHA256
```

Copy the output hash into the `sha256` field in `marketplace.json`.

---

## 🚀 Submitting Your Plugin

1. **Fork** this repository.
2. Create your plugin folder under `plugins/<your-plugin>/`.
3. Ensure `manifest.json` is at the root of your plugin folder.
4. Generate a `.zip` of your plugin folder (containing `manifest.json` at root).
5. Generate a SHA-256 checksum of the `.zip`.
6. Add your entry to `marketplace.json` including the `sha256` field.
7. Open a **Pull Request** for community review.

---

## Plugin API Reference

See [`packages/plugin-api/index.d.ts`](packages/plugin-api/index.d.ts) for the full typed reference.
