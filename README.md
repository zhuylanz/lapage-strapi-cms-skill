<div align="center">
  <img src="assets/lapage-logo.svg" alt="LaPage" width="112" />
  <h1>LaPage Strapi CMS Skill</h1>
  <p>Reliable content operations for LaPage CMS and AI-assisted workflows.</p>
</div>

<p align="center">
  <a href="https://github.com/zhuylanz/lapage-strapi-cms-skill">GitHub Repository</a>
  ·
  <a href="https://lapage.vn">LaPage Digital</a>
</p>

## Overview

The LaPage Strapi CMS Skill gives AI agents and technical teams a controlled,
repeatable way to work with LaPage content. It combines clear operating
guidance with a lightweight Node.js command-line interface for common content
operations.

The skill is designed for teams that need dependable CMS workflows across
editorial publishing, localized content, structured project data, and media
assets.

## Capabilities

- Review project-scoped CMS content and localized records.
- Create, update, publish, and remove content using Strapi document IDs.
- Upload media assets through the authenticated CMS media service.
- Work with posts, products, authors, categories, and web data.
- Keep project context and administrative credentials outside application code.
- Produce machine-readable JSON responses for automation and downstream tools.

## Requirements

- Node.js 20 or newer.
- A LaPage Strapi administrator account with the required role permissions.
- The following environment variables:

```sh
export CMS_USERNAME='admin@example.com'
export CMS_PASSWORD='your-password'
export CMS_PROJECT_ID='your-project-id'
```

Keep credentials in a secure environment manager. Do not commit them, place
them in browser-exposed variables, or include them in logs and support tickets.

## Getting Started

From the repository root:

```sh
node scripts/cms.mjs list posts --locale en --limit 20
node scripts/cms.mjs get posts DOCUMENT_ID --locale en
node scripts/cms.mjs update posts DOCUMENT_ID --data-file ./post.json --locale en
node scripts/cms.mjs upload media --file ./image.png
```

The CLI returns JSON so it can be used directly in scripts, agent workflows,
and operational tooling.

## Supported Operations

| Operation | Example |
| --- | --- |
| List content | `node scripts/cms.mjs list posts --locale en` |
| Read one item | `node scripts/cms.mjs get posts DOCUMENT_ID --locale en` |
| Create content | `node scripts/cms.mjs create posts --data-file ./post.json --locale en` |
| Update content | `node scripts/cms.mjs update posts DOCUMENT_ID --data-file ./post.json --locale en` |
| Publish content | `node scripts/cms.mjs publish posts DOCUMENT_ID --locale en` |
| Remove content | `node scripts/cms.mjs delete posts DOCUMENT_ID --locale en` |
| Upload media | `node scripts/cms.mjs upload media --file ./image.png` |

Supported content resources are `posts`, `products`, `authors`,
`post-categories`, `product-categories`, and `web-data`.

## Content Governance

The workflow keeps project ownership explicit, uses Strapi `documentId` values
for mutations, and supports locale-aware updates under the same content
document. Review the target record, locale, and payload before making a
production change.

For endpoint mappings and payload guidance, see
[references/api.md](references/api.md). For the full agent workflow, see
[SKILL.md](SKILL.md).

## About LaPage Digital

LaPage Digital builds practical digital systems for growing businesses,
including websites, content platforms, automation, and AI-enabled operations.
This skill reflects that approach: clear ownership, predictable workflows, and
operational control at every step.

## License

This repository contains LaPage Digital workflow guidance and tooling. Contact
LaPage Digital before redistributing or adapting it for another organization.
