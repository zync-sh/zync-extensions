#!/usr/bin/env bash
# hash-plugin.sh
# Generates a SHA-256 checksum for a plugin zip file.
# Usage: bash scripts/hash-plugin.sh <plugin-folder-name>
# Example: bash scripts/hash-plugin.sh ssh-quick-commands

set -e

PLUGIN_NAME="${1}"

if [ -z "${PLUGIN_NAME}" ]; then
    echo "Usage: bash scripts/hash-plugin.sh <plugin-folder-name>"
    exit 1
fi

ZIP_PATH="plugins/${PLUGIN_NAME}.zip"

if [ ! -f "${ZIP_PATH}" ]; then
    echo "Error: ${ZIP_PATH} does not exist."
    echo "Ensure you have zipped the plugin folder first."
    exit 1
fi

echo "Computing SHA-256 for: ${ZIP_PATH}"
if command -v sha256sum &> /dev/null; then
    HASH=$(sha256sum "${ZIP_PATH}" | awk '{print $1}')
elif command -v shasum &> /dev/null; then
    HASH=$(shasum -a 256 "${ZIP_PATH}" | awk '{print $1}')
else
    echo "Error: Neither sha256sum nor shasum found."
    exit 1
fi
echo ""
echo "SHA-256: ${HASH}"
echo ""
echo "Add this to marketplace.json:"
echo "  \"sha256\": \"${HASH}\""
