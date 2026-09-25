# API Reference

The CLI follows `@lapage/content-api` conventions.

| Resource | Public API path | Content-manager UID |
| --- | --- | --- |
| posts | `/api/generic-posts` | `api::generic-post.generic-post` |
| products | `/api/generic-products` | `api::generic-product.generic-product` |
| authors | `/api/generic-authors` | `api::generic-author.generic-author` |
| post-categories | `/api/generic-post-categories` | `api::generic-post-category.generic-post-category` |
| product-categories | `/api/generic-product-categories` | `api::generic-product-category.generic-product-category` |
| web-data | `/api/generic-web-data` | `api::generic-web-datum.generic-web-datum` |

Admin mutations use:

```text
POST   /content-manager/collection-types/{uid}
POST   /content-manager/collection-types/{uid}/{documentId}/actions/publish
DELETE /content-manager/collection-types/{uid}/{documentId}
POST   /content-manager/single-types/{uid}/actions/publish   # web-data
```

The request body is the item fields directly (not wrapped in `data`). For
localized operations, include `locale` in the query string. The publish action
is also used by the package for create/update operations so returned items are
consistent with the CMS content-manager API.

Useful post fields include `title`, `slug`, `postType`, `contentMD`, `summary`,
`excerpt`, `tags`, `categories`, `heroImage`, `gallery`, and `freeform`.
