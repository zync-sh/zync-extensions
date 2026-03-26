# Changelog

All notable changes to Zync Extensions are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-03-26

### Added
- **PermissionError Class**: Introduced a formal `PermissionError` class to the SDK, enabling plugins to catch and handle unauthorized API access gracefully. ([11da47f])
- **Structured SSH Results**: Upgraded `zync.ssh.exec()` to return a structured `CommandResult` (`stdout`, `stderr`, `exitCode`), providing enterprise-grade shell control. ([11da47f])
- **Marketplace Integrity**: Populated SHA-256 integrity hashes for all bundled plugins in `marketplace.json` to ensure secure delivery. ([11da47f])

### Changed
- **CLI Validation Hardening**: Upgraded `zync-publish-cli` with strict `manifest.id` validation and improved error reporting for permission mismatches. ([11da47f])
- **Modernized Engines**: Updated all packages to require Node.js 20+ and enriched plugin manifests with `author`, `description`, and `type` metadata. ([11da47f])
- **Cross-Platform Scripting**: Refactored `hash-plugin.sh` for compatibility with both `sha256sum` (Linux/Windows) and `shasum` (macOS). ([11da47f])

### Documentation
- **SDK Hardening Guide**: Comprehensive updates to `DEVELOPER_GUIDE.md` detailing the new permission model and structured execution results. ([11da47f])

[Unreleased]: https://github.com/zync-sh/zync-extensions/compare/3.0.0...HEAD
[3.0.0]: https://github.com/zync-sh/zync-extensions/releases/tag/v3.0.0
[11da47f]: https://github.com/zync-sh/zync-extensions/commit/11da47f4f7e05d0336a0581833222e67a752a758
