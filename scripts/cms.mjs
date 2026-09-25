#!/usr/bin/env node

import { openAsBlob } from 'node:fs';
import { readFile } from 'node:fs/promises';

const BASE_URL = 'https://strapi-cms.lapage.vn';
const RESOURCES = {
  posts: { api: '/api/generic-posts', uid: 'api::generic-post.generic-post' },
  products: { api: '/api/generic-products', uid: 'api::generic-product.generic-product' },
  authors: { api: '/api/generic-authors', uid: 'api::generic-author.generic-author' },
  'post-categories': { api: '/api/generic-post-categories', uid: 'api::generic-post-category.generic-post-category' },
  'product-categories': { api: '/api/generic-product-categories', uid: 'api::generic-product-category.generic-product-category' },
  'web-data': { api: '/api/generic-web-data', uid: 'api::generic-web-datum.generic-web-datum', single: true },
};

const args = process.argv.slice(2);
const [command, resourceName, documentId] = args;

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: cms.mjs <list|get|create|update|publish|delete|upload> <resource> [documentId] [options]
Resources: posts, products, authors, post-categories, product-categories, web-data
Options: --locale LOCALE --limit N --page N --populate VALUE --query-json JSON
         --data JSON --data-file PATH --file PATH --status draft|published`);
  process.exit(0);
}

function option(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function resource() {
  const value = RESOURCES[resourceName];
  if (!value) throw new Error(`Unknown resource: ${resourceName || '(missing)'}`);
  return value;
}

function queryString(values) {
  const query = new URLSearchParams();
  const append = (key, value) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) return value.forEach((entry) => append(`${key}[]`, entry));
    if (typeof value === 'object') return Object.entries(value).forEach(([child, entry]) => append(`${key}[${child}]`, entry));
    query.set(key, String(value));
  };
  Object.entries(values).forEach(([key, value]) => append(key, value));
  return query.toString() ? `?${query}` : '';
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${await login()}`;
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) {
    const detail = typeof payload === 'object' && payload ? payload.error?.message || payload.message : payload;
    throw new Error(`CMS request failed (${response.status}): ${detail || response.statusText}`);
  }
  return payload;
}

let token;
async function login() {
  if (token) return token;
  const payload = await request('/admin/login', {
    method: 'POST',
    body: { email: requiredEnv('CMS_USERNAME'), password: requiredEnv('CMS_PASSWORD') },
  });
  token = payload?.data?.token || payload?.data?.accessToken || payload?.token || payload?.accessToken;
  if (!token) throw new Error('CMS login response did not include an admin token');
  return token;
}

async function dataPayload() {
  const inline = option('--data');
  const file = option('--data-file');
  if (inline && file) throw new Error('Use only one of --data and --data-file');
  if (!inline && !file) return {};
  const raw = file ? await readFile(file, 'utf8') : inline;
  try { return JSON.parse(raw); } catch { throw new Error('Mutation data must be valid JSON'); }
}

function scopedData(data) {
  const projectId = requiredEnv('CMS_PROJECT_ID');
  return data.projectId ? data : { ...data, projectId };
}

async function main() {
  if (!command || !resourceName || !['list', 'get', 'create', 'update', 'publish', 'delete', 'upload'].includes(command)) {
    throw new Error('Usage: cms.mjs <list|get|create|update|publish|delete|upload> <resource> [documentId] [options]');
  }
  if (command === 'upload') {
    const filePath = option('--file');
    if (resourceName !== 'media' || !filePath) throw new Error('Usage: cms.mjs upload media --file PATH');
    const form = new FormData();
    form.append('files', await openAsBlob(filePath), filePath.split('/').pop());
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await login()}` },
      body: form,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(`CMS upload failed (${response.status})`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  const item = resource();
  const locale = option('--locale');

  if (command === 'list' || command === 'get') {
    const path = command === 'list'
      ? `${item.api}${queryString({
          ...JSON.parse(option('--query-json') || '{}'),
          locale: locale || '*',
          'filters[projectId][$eq]': requiredEnv('CMS_PROJECT_ID'),
          'pagination[page]': option('--page') || 1,
          'pagination[pageSize]': option('--limit') || 100,
          populate: option('--populate') || '*',
        })}`
      : `${item.api}/${encodeURIComponent(documentId)}${queryString({ locale, populate: option('--populate') || '*' })}`;
    console.log(JSON.stringify(await request(path), null, 2));
    return;
  }

  const uidPath = `/content-manager/${item.single ? 'single-types' : 'collection-types'}/${item.uid}`;
  const options = queryString({ locale });
  let result;
  if (command === 'delete') {
    if (!documentId) throw new Error('delete requires a documentId');
    result = await request(`${uidPath}/${encodeURIComponent(documentId)}${options}`, { method: 'DELETE', auth: true });
  } else if (command === 'publish') {
    if (!documentId && !item.single) throw new Error('publish requires a documentId');
    const path = item.single ? `${uidPath}/actions/publish${options}` : `${uidPath}/${encodeURIComponent(documentId)}/actions/publish${options}`;
    result = await request(path, { method: 'POST', body: {}, auth: true });
  } else {
    const data = scopedData(await dataPayload());
    if (command === 'create') {
      result = await request(`${uidPath}/actions/publish${options}`, { method: 'POST', body: { ...data, ...(locale ? { locale } : {}), ...(option('--status') ? { status: option('--status') } : {}) }, auth: true });
    } else {
      if (!documentId) throw new Error(`${command} requires a documentId`);
      result = await request(`${uidPath}/${encodeURIComponent(documentId)}/actions/publish${options}`, { method: 'POST', body: { ...data, ...(locale ? { locale } : {}), ...(option('--status') ? { status: option('--status') } : {}) }, auth: true });
    }
  }
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
