# Changelog

All notable changes to `lapage-strapi-cms` are recorded here.

## [1.1.1] - 2026-10-22

### Fixed

- Publish `web-data` through the collection-type endpoint with its `documentId`; it is a collection type (one entry per project), not a single type. The old single-type call let Strapi pick the document, which is only safe for roles that can see a single project.
- Strip component `id` values and read-only metadata from `web-data` create/update payloads, so a payload copied from the published version (whose component ids differ from the draft) round-trips cleanly. JSON `message` values are left untouched.

## [1.1.0] - 2026-10-22

### Added

- Added `package.json` with the published skill version.
- Added `scripts/check-update.mjs`; agents now check this repository for a newer version on first use in a session and ask before updating.
- Linked the other public LaPage Digital skills from the README.

## [1.0.0] - 2026-09-25

### Added

- Published the LaPage Strapi CMS skill and dependency-free CLI.
