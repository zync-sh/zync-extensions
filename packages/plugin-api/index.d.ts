/**
 * @zync/plugin-api — Zync Plugin API Type Definitions
 *
 * This is a pure ambient declaration file. It augments `window` so that
 * `window.zync` is typed wherever this file is included.
 *
 * All API calls are gated by the plugin's declared `permissions` in `manifest.json`.
 */

/**
 * Thrown when a plugin attempts to access an API it hasn't declared permission for.
 * Instead of silent failure, Zync methods throw or return a rejected Promise with this error.
 */
declare class PermissionError extends Error {
    /** The permission token that was missing (e.g. 'fs:read') */
    permission: string;
    /** The human-readable name of the blocked API */
    apiIdentifier: string;
}

interface ZyncTerminalAPI {
    /**
     * Sends text directly to the active terminal tab's stdin.
     * 
     * @throws {PermissionError} if `terminal:write` is not declared.
     * @throws {Error} if no active terminal session exists.
     * @requires Permission: `terminal:write`
     * @param text The string to send (include '\n' for enter)
     */
    send(text: string): void;

    /**
     * Opens a new terminal tab, optionally running a command on launch.
     * 
     * @returns {Promise<void>} Rejects with {PermissionError} if `terminal:newtab` is not declared.
     * @requires Permission: `terminal:newtab`
     */
    newTab(opts: { connectionId?: string; command?: string }): Promise<void>;
}

interface ZyncSSHAPI {
    /**
     * Executes a shell command on the active SSH host.
     * 
     * @requires Permission: `ssh:exec`
     * @param command The shell command to run.
     * @returns {Promise<{ stdout: string; stderr: string; exitCode: number }>} 
     * Resolves even on non-zero exit codes. Rejects on timeout or network failure.
     * Rejects with {PermissionError} if `ssh:exec` is not declared.
     */
    exec(command: string): Promise<{ stdout: string; stderr: string; exitCode: number }>;
}

interface ZyncStatusBarAPI {
    /**
     * Updates or creates a status bar item for this plugin.
     * 
     * @throws {PermissionError} if `statusbar:write` is not declared.
     * @requires Permission: `statusbar:write`
     * @param id   Unique slot ID for this plugin's status item
     * @param text The text to display in the status bar
     */
    set(id: string, text: string): void;
}

interface ZyncUIAPI {
    /**
     * Shows a Zync-themed notification toast.
     * 
     * @throws {PermissionError} if `ui:notify` is not declared.
     * @requires Permission: `ui:notify`
     */
    notify(opts: { message: string; type?: 'info' | 'success' | 'error' }): void;

    /**
     * Shows a Zync-themed confirmation dialog.
     * 
     * @requires Permission: `ui:confirm`
     * @returns {Promise<boolean>} Resolves to true if confirmed, false if dismissed (ESC, close, or Cancel).
     * Rejects with {PermissionError} if `ui:confirm` is not declared.
     */
    confirm(opts: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean>;
}

interface ZyncFSAPI {
    /**
     * Reads a text file from the remote SSH server.
     * 
     * SECURITY: This API is restricted to the user's home directory.
     * Absolute paths outside the home or path traversal (e.g. "../../") will be rejected.
     * 
     * @requires Permission: `fs:read`
     * @returns {Promise<string>} Rejects with {PermissionError} if `fs:read` is not declared.
     */
    readTextFile(path: string): Promise<string>;

    /**
     * Writes text to a file on the remote SSH server.
     * 
     * SECURITY: Restricted to the user's home directory.
     * OVERWRITE: This operation overwrites existing files without warning.
     * ATOMICITY: This operation is NOT atomic. For critical data, use a tmp + rename pattern.
     * 
     * @requires Permission: `fs:write`
     * @returns {Promise<void>} Rejects with {PermissionError} if `fs:write` is not declared.
     */
    writeTextFile(path: string, content: string): Promise<void>;

    /**
     * Lists the contents of a directory on the remote SSH server.
     * 
     * SECURITY: Path traversal or unauthorized directory access will result in rejection.
     * 
     * @requires Permission: `fs:read`
     * @returns {Promise<{ name: string; isDir: boolean; size: number; modified: string }[]>} 
     * `modified` is returned as an ISO 8601 string.
     * Rejects with {PermissionError} if `fs:read` is not declared.
     */
    readDir(path: string): Promise<{ name: string; isDir: boolean; size: number; modified: string }[]>;
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
    /** Remote File System access */
    fs: ZyncFSAPI;
}

interface Window {
    /**
     * The Zync Plugin API.
     * Automatically injected into every plugin panel and extension script by Zync.
     *
     * All API calls are gated by the plugin's declared `permissions` in `manifest.json`.
     */
    zync: ZyncAPI;
}
