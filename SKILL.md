---
name: lapage-strapi-cms
description: Operate LaPage Strapi content through a dependency-free Node CLI using CMS_USERNAME, CMS_PASSWORD, and CMS_PROJECT_ID. Use when an agent needs to inspect, create, update, publish, or delete LaPage CMS items.
---

# LaPage Strapi CMS

Use `scripts/cms.mjs` for repeatable CMS reads and mutations. It hardcodes the
LaPage host as `https://strapi-cms.lapage.vn`; do not add a user-controlled base
URL or print credentials.

## Credentials

The command requires these environment variables:

```text
CMS_USERNAME       Strapi admin email
CMS_PASSWORD       Strapi admin password
CMS_PROJECT_ID     LaPage project ID used to scope reads and writes
```

Credentials are sent only to `/admin/login`. Keep them server-side and never
put them in `NEXT_PUBLIC_*` variables, command output, logs, or committed files.

## Commands

Run from this skill directory, or use an absolute script path:

```sh
node scripts/cms.mjs list posts --locale en --limit 20
node scripts/cms.mjs get posts DOCUMENT_ID --locale en
node scripts/cms.mjs create posts --data '{"title":"Post","postType":"blog"}' --locale en
node scripts/cms.mjs update posts DOCUMENT_ID --data-file ./post.json --locale en
node scripts/cms.mjs publish posts DOCUMENT_ID --locale en
node scripts/cms.mjs delete posts DOCUMENT_ID --locale en
node scripts/cms.mjs upload media --file ./image.png
```

Supported resources are `posts`, `products`, `authors`, `post-categories`,
`product-categories`, and `web-data`; media uploads use the `media` resource. Use `--data-file path` for large JSON
payloads. `--query-json` can provide additional Strapi query parameters for
`list`; it is merged with the project and locale filters.

## Operating Rules

- Confirm the target resource, `documentId`, locale, and payload before a
  mutation or deletion.
- Reads use public `/api/*` endpoints with `populate=*` by default.
- Mutations use the authenticated Strapi content-manager endpoints. Updates and
  deletes address `documentId`, never the numeric `id`.
- The CLI adds `projectId: CMS_PROJECT_ID` to create/update payloads unless the
  payload already contains `projectId`; list filters always scope to the project.
- Localized updates use `--locale <locale>` on the same document ID. Do not
  create a separate POST merely to add a localization.
- The CLI prints JSON responses only. It never includes the bearer token in
  output.

See [references/api.md](references/api.md) for endpoint mappings and payload
details when an operation needs more than the command examples.
