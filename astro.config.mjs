// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY;
const [owner, repo] = repository ? repository.split('/') : [];
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const site =
  process.env.SITE_URL ||
  (owner ? `https://${owner}.github.io` : 'http://localhost:4321');
const base = process.env.BASE_PATH || (isGitHubActions && repo ? `/${repo}` : '/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
});
