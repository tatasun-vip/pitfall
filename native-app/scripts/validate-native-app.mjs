import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'package.json',
  'app.json',
  'eas.json',
  'tsconfig.json',
  'App.tsx',
  'src/data.ts',
  'src/icons.tsx',
  'README.md'
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error('Missing files:', missing.join(', '));
  process.exit(1);
}

const app = readFileSync(join(root, 'App.tsx'), 'utf8');
const data = readFileSync(join(root, 'src/data.ts'), 'utf8');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const appJson = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8'));

const checks = {
  packageName: pkg.name === 'pitfall-native',
  expoDependency: Boolean(pkg.dependencies?.expo),
  reactNativeSvg: Boolean(pkg.dependencies?.['react-native-svg']),
  appName: appJson.expo?.name === 'Pitfall',
  bundleIdentifier: appJson.expo?.ios?.bundleIdentifier === 'com.tatasun.pitfall',
  packageIdentifier: appJson.expo?.android?.package === 'com.tatasun.pitfall',
  worlds: ['campus', 'travel', 'work', 'home', 'shop', 'beauty'].every((key) => data.includes(`id: '${key}'`)),
  nativeComponents: ['SafeAreaView', 'ScrollView', 'Pressable', 'Modal', 'TextInput'].every((name) => app.includes(name)),
  noHtmlShell: !app.includes('<!doctype') && !app.includes('document.querySelector') && !app.includes('window.'),
  publishModal: app.includes('publishOpen') && app.includes('30 秒投递 Story'),
  detailModal: app.includes('detailOpen') && app.includes('材料链'),
  bottomNav: app.includes('bottomNav') && app.includes('世界') && app.includes('房间') && app.includes('我的')
};

let failed = false;
for (const [name, ok] of Object.entries(checks)) {
  console.log(`${name}: ${ok}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
console.log('native app scaffold validation passed');
