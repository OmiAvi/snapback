import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

function printUsage() {
  console.log(`Usage:
  npm run seed:app-data -- --data ./firebase/app-data.2026.json --service-account ./firebase/service-account.json

Options:
  --data <path>             JSON file containing { teams, bracket }
  --service-account <path>  Firebase service account JSON file

Environment variable fallback:
  FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/or/relative/path/to/service-account.json
`);
}

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function resolveRequiredFile(inputPath, label) {
  if (!inputPath) {
    throw new Error(`Missing ${label} path.`);
  }

  const resolvedPath = path.resolve(process.cwd(), inputPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`${label} file not found: ${resolvedPath}`);
  }

  return resolvedPath;
}

function loadJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to parse ${label}: ${filePath}`);
  }
}

function validateAppData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('App data JSON must be an object.');
  }

  if (!data.teams || typeof data.teams !== 'object' || Array.isArray(data.teams)) {
    throw new Error('App data JSON must include a "teams" object.');
  }

  if (!Array.isArray(data.bracket)) {
    throw new Error('App data JSON must include a "bracket" array.');
  }
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage();
    return;
  }

  const dataPath = resolveRequiredFile(getArgValue('--data'), 'app data');
  const serviceAccountPath = resolveRequiredFile(
    getArgValue('--service-account') || process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    'service account'
  );

  const appData = loadJson(dataPath, 'app data JSON');
  validateAppData(appData);

  const serviceAccount = loadJson(serviceAccountPath, 'service account JSON');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();

  await db.doc('appData/current').set(appData, { merge: false });

  console.log(`Seeded Firestore document appData/current from ${dataPath}`);
}

main().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  printUsage();
  process.exit(1);
});
