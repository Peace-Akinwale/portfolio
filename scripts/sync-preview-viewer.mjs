// The static mockup uses the exact viewer implementation and CSS as the app.
// Run: node scripts/sync-preview-viewer.mjs /absolute/path/to/mockup
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
const destination = process.argv[2];
if (!destination || !path.isAbsolute(destination)) throw new Error('Pass the absolute preview directory');
const source = await fs.readFile('lib/image-viewer.ts','utf8');
const js = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2020}}).outputText;
await fs.writeFile(path.join(destination,'image-viewer.js'), '// Generated from lib/image-viewer.ts; do not edit here.\n'+js);
await fs.copyFile('public/image-viewer.css',path.join(destination,'image-viewer.css'));
