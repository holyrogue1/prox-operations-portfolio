import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = name => fs.readFileSync(path.join(root, 'source', name), 'utf8');
const html = source('template.html')
  .replace('__STYLE__', () => source('style.css'))
  .replace('__SCRIPT__', () => source('demo.js'));
if (/__(?:STYLE|SCRIPT|MARK|ICONS)__/.test(html)) throw Error('Unresolved build marker');
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('Built standalone synthetic demo: index.html');
