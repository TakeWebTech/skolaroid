import { rmSync } from 'node:fs';

for (const path of ['.next', '.next-stale-20260723100618']) {
  rmSync(path, { recursive: true, force: true });
}

console.log('Removed Next.js generated cache folders.');
