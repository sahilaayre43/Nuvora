import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const apiUrl = (process.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const isVercelBuild = process.env.VERCEL === '1';

if (!apiUrl) {
  if (isVercelBuild) {
    throw new Error(
      'Set VITE_API_URL in Vercel to your Render backend URL so the product catalog can be included in the frontend build.'
    );
  }
  console.log('VITE_API_URL is not set; skipping the static catalog sync.');
} else {
  const fetchJson = async (endpoint) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180_000);

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`${endpoint} returned HTTP ${response.status}.`);
      }
      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  const [products, categories] = await Promise.all([
    fetchJson('/api/products'),
    fetchJson('/api/categories'),
  ]);

  if (!Array.isArray(products) || !Array.isArray(categories)) {
    throw new Error('The backend returned an invalid product or category catalog.');
  }

  const publicDir = path.resolve(scriptDir, '../public');
  await fs.mkdir(publicDir, { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(publicDir, 'catalog.json'),
      `${JSON.stringify(products)}\n`
    ),
    fs.writeFile(
      path.join(publicDir, 'categories.json'),
      `${JSON.stringify(categories)}\n`
    ),
  ]);

  console.log(
    `Synced ${products.length} products and ${categories.length} categories into the static frontend.`
  );
}
