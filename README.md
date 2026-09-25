# LaPage Strapi CMS Skill

A Codex skill and dependency-free Node CLI for inspecting and managing LaPage
Strapi CMS content.

## Configuration

Set these environment variables before running the CLI:

```sh
export CMS_USERNAME='admin@example.com'
export CMS_PASSWORD='...'
export CMS_PROJECT_ID='your-project-id'
```

The CLI always uses `https://strapi-cms.lapage.vn`.

## Examples

```sh
node scripts/cms.mjs list posts --locale en --limit 20
node scripts/cms.mjs get posts DOCUMENT_ID --locale en
node scripts/cms.mjs update posts DOCUMENT_ID --data-file ./post.json --locale en
node scripts/cms.mjs upload media --file ./image.png
```

See [SKILL.md](SKILL.md) for the full workflow and safety guidance.
