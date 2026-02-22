# Zync Extensions

Official registry and repository for [Zync](https://github.com/gajendraxdev/zync) plugins and themes.

The full list of available extensions is maintained in the main Zync repo: [Plugin Catalog](https://github.com/gajendraxdev/zync/blob/main/PLUGIN_CATALOG.md).

---

## How It Works

Zync fetches `marketplace.json` from this repository to display available extensions in the **Marketplace** tab of Settings. When a user clicks **Install**, Zync downloads the `.zip` from `downloadUrl` and extracts it to `~/.config/zync/plugins/`.

## Quick Reference

| Extension | Type | Description |
|-----------|------|-------------|
| [SSH Quick Commands](plugins/ssh-quick-commands) | tool | SSH utility commands in the command palette |
| [Connection Stats](plugins/connection-stats) | tool | Live CPU/memory/disk stats in the status bar |
| [PM2 Monitor](plugins/pm2-monitor) | panel | PM2 process manager dashboard |

See the [Plugin Catalog](https://github.com/gajendraxdev/zync/blob/main/PLUGIN_CATALOG.md) for the full catalog with links and versions.

---

## Submitting Your Extension

1. **Fork** this repository and add your extension under `plugins/<your-plugin>/`.
2. **Package** it as a `.zip` containing `manifest.json` and entry file (e.g. `main.js`).
3. **Host** the `.zip` as a GitHub Release asset or public URL.
4. **Edit** `marketplace.json` to add your entry.
5. **Open a Pull Request** for review.

## Extension Structure

Every extension must include `manifest.json` at the root of the zip:

```json
{
  "id": "com.yourname.plugin.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "main": "main.js"
}
```

### manifest.json Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique reverse-domain ID (e.g. `com.zync.plugin.name`) |
| `name` | Yes | Display name |
| `version` | Yes | Semver version string |
| `main` | No | Entry JS file (tool plugins) |
| `style` | No | CSS file (theme plugins) |
| `mode` | No | `"dark"` or `"light"` (themes) |
| `preview_bg` | No | Background color hex for theme preview |
| `preview_accent` | No | Accent color hex for theme preview |

## Plugin API

Your `main.js` has access to the `zync` global:

```js
// Register command palette entry
zync.commands.register('my-plugin.hello', {
  label: 'My Plugin: Say Hello',
  description: 'Prints hello to the terminal',
  handler: () => zync.terminal.sendInput('echo Hello from My Plugin!\n'),
});

// Listen to events
zync.events.on('connection:connected', () => {
  console.log('Connected!');
});

// Update status bar
zync.statusBar.setText('my-plugin', 'Hello World');
```

## marketplace.json Schema

```json
{
  "plugins": [
    {
      "id": "com.example.plugin.my-plugin",
      "name": "My Plugin",
      "version": "1.0.0",
      "description": "Short description of what the plugin does.",
      "author": "Your Name",
      "downloadUrl": "https://github.com/yourname/my-plugin/releases/download/v1.0.0/my-plugin.zip",
      "thumbnailUrl": "https://...",
      "icon": "Terminal",
      "type": "tool"
    }
  ]
}
```

## License

MIT
