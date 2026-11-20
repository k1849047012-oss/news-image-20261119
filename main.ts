// news-image-20261119 entry (Node 22, standard library only): writes the
// day's news image to /output/entry.png. The image itself is the entry.png
// beside this file, drawn programmatically with Python/PIL; this program
// copies it to the output directory and verifies the copy byte for byte,
// so a truncated or corrupted write fails loudly instead of silently
// submitting a broken image. The gate takes a whole PNG or JPEG of at most
// 1 MiB and 1024 by 1024 pixels, and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// The grader's /output exists, but a local run's directory may not: create it.
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Verify the copy: same bytes, same sha256, and within the 1 MiB gate.
const expected = createHash('sha256').update(readFileSync(source)).digest('hex');
const actual = createHash('sha256').update(readFileSync(target)).digest('hex');
if (expected !== actual) {
  throw new Error(`entry.png copy failed verification: ${actual} != ${expected}`);
}
const bytes = readFileSync(target).length;
if (bytes > 1048576) {
  throw new Error(`entry.png is ${bytes} bytes, over the 1 MiB gate`);
}
console.log(`wrote ${target} (${bytes} bytes, sha256 ${actual})`);
