/**
 * @zync/plugin-api — Zync Plugin API Type Definitions
 *
 * This is a pure ambient declaration file. It augments `window` so that
 * `window.zync` is typed wherever this file is included.
 *
 * Usage (Drop-in):  Place this file alongside your plugin code
 * Usage (JSDoc):    Add `@type {import('./index.d.ts').ZyncAPI}` in your JS file
 * Usage (NPM):      `npm install --save-dev @zync/plugin-api`
 */

interface ZyncTerminalAPI {
    /**
     * Sends text directly to the active terminal tab's stdin.
     * @requires Permission: `terminal:write`
     * @param text The string to send (include '\n' for enter)
     */
    send(text: string): void;

    /**
     * Opens a new terminal tab, optionally running a command on launch.
     * @requires Permission: `terminal:newtab`
     */
    newTab(opts: { connectionId?: string; command?: string }): void;
}

interface ZyncSSHAPI {
    /**
     * Executes a single shell command on the active SSH host and returns the output.
     * @requires Permission: `ssh:exec`
     * @param command The shell command to run
     * @returns Promise resolving to the stdout output string
     */
    exec(command: string): Promise<string>;
}

interface ZyncStatusBarAPI {
    /**
     * Updates or creates a status bar item for this plugin.
     * @requires Permission: `statusbar:write`
     * @param id   Unique slot ID for this plugin's status item
     * @param text The text to display in the status bar
     */
    set(id: string, text: string): void;
}

interface ZyncUIAPI {
    /**
     * Shows a Zync-themed notification toast.
     * @requires Permission: `ui:notify`
     */
    notify(opts: { message: string; type?: 'info' | 'success' | 'error' }): void;

    /**
     * Shows a Zync-themed confirmation dialog.
     * @requires Permission: `ui:confirm`
     * @returns Promise resolving to true if the user clicked Confirm
     */
    confirm(opts: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean>;
}

interface ZyncAPI {
    /** Terminal control and input */
    terminal: ZyncTerminalAPI;
    /** Secure SSH command execution */
    ssh: ZyncSSHAPI;
    /** Status bar integration */
    statusBar: ZyncStatusBarAPI;
    /** UI interactions (toasts, dialogs) */
    ui: ZyncUIAPI;
}

interface Window {
    /**
     * The Zync Plugin API.
     * Automatically injected into every plugin panel and extension script by Zync.
     *
     * All API calls are gated by the plugin's declared `permissions` in `manifest.json`.
     * Any call without the required permission will be silently blocked and logged as a warning.
     */
    zync: ZyncAPI;
}
