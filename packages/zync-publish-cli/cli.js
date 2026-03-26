#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');

const MANIFEST_NAME = 'manifest.json';
const DIST_DIR = 'dist';
const VALID_PERMISSIONS = [
    'terminal:write', 
    'terminal:newtab', 
    'ssh:exec', 
    'statusbar:write', 
    'ui:confirm',
    'fs:read',
    'fs:write',
    'window:create',
    'theme:set'
];

async function run() {
    console.log("🚀 Zync Extension Publisher CLI\n");

    const cwd = process.cwd();
    const manifestPath = path.join(cwd, MANIFEST_NAME);

    // 1. Lint
    if (!fs.existsSync(manifestPath)) {
        console.error(`❌ Error: Could not find ${MANIFEST_NAME} in the current directory.`);
        process.exit(1);
    }

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
        console.error(`❌ Error parsing ${MANIFEST_NAME}: ${e.message}`);
        process.exit(1);
    }

    if (!manifest.id || !manifest.name || !manifest.version) {
        console.error(`❌ Error: ${MANIFEST_NAME} must contain 'id', 'name', and 'version'.`);
        process.exit(1);
    }

    if (!/^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*$/.test(manifest.id)) {
        console.error(`❌ Error: manifest 'id' contains unsafe characters. Only alphanumerics, hyphens, underscores, and dots are allowed.`);
        process.exit(1);
    }

    if (manifest.permissions) {
        if (!Array.isArray(manifest.permissions)) {
            console.error(`❌ Error: 'permissions' must be an array of strings.`);
            process.exit(1);
        }
        for (const perm of manifest.permissions) {
            if (!VALID_PERMISSIONS.includes(perm)) {
                console.error(`❌ Validation Error: Invalid permission token '${perm}' requested.`);
                console.error(`   Allowed tokens: ${VALID_PERMISSIONS.join(', ')}`);
                process.exit(1);
            }
        }
    }

    if (manifest.type && !['panel', 'headless'].includes(manifest.type)) {
        console.error(`❌ Error: 'type' must be either 'panel' or 'headless'. (Default is 'panel')`);
        process.exit(1);
    }

    console.log("✅ Manifest validation passed.");

    // 2. Prepare Dist
    const distPath = path.join(cwd, DIST_DIR);
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }

    const zipFileName = `${manifest.id}-v${manifest.version}.zip`;
    const zipFilePath = path.join(distPath, zipFileName);

    console.log(`\n📦 Packing extension into ${DIST_DIR}/${zipFileName}...`);

    let totalBytes = 0;
    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        output.on('error', reject);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            totalBytes = archive.pointer();
            resolve();
        });
        archive.on('error', reject);

        archive.pipe(output);

        // Glob all files except node_modules, dist, .git, and common hidden files
        archive.glob('**/*', {
            cwd: cwd,
            ignore: ['node_modules/**', 'dist/**', '.git/**', '.vscode/**', '*.log', '.DS_Store']
        });

        archive.finalize();
    });

    console.log(`✅ Packing complete (${(totalBytes / 1024).toFixed(2)} KB).`);

    // 3. Hash
    const fileBuffer = fs.readFileSync(zipFilePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');

    console.log(`🔒 SHA-256 Checksum generated: ${hex}`);

    // 4. PR Gen Output
    console.log("\n🎉 Build Successful!\n");
    console.log("To submit your plugin to the Zync Marketplace, append the following block to marketplace.json in a PR to github.com/zync-sh/zync-extensions:\n");
    
    // Auto-generate the registry format
    const registryEntry = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description || "",
        author: manifest.author || "Unknown",
        // TODO: Replace YOUR_GITHUB_USER/YOUR_REPO with your actual GitHub repository URL where this plugin is hosted.
        downloadUrl: `https://github.com/YOUR_GITHUB_USER/YOUR_REPO/releases/download/v${manifest.version}/${zipFileName}`,
        thumbnailUrl: manifest.icon || "",
        sha256: hex,
        permissions: manifest.permissions || []
    };

    console.log(JSON.stringify(registryEntry, null, 4));
    console.log("\n");
}

run().catch(e => {
    console.error(e);
    process.exitCode = 1;
});
