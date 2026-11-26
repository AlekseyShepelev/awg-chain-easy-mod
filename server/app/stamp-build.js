'use strict';

const fs = require('node:fs');
const path = require('node:path');
const [metadataFile = path.join(__dirname, 'build-info.json'), changelogDir = path.join(__dirname, 'changelog')] = process.argv.slice(2);
const info = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
const { BUILD_COMMIT, BUILD_COMMIT_DATE, BUILD_CREATED_AT } = process.env;
const date = (value) => new Date(value).toISOString();

if (BUILD_COMMIT) {
  if (!/^[0-9a-f]{40}$/.test(BUILD_COMMIT)) throw new Error('Invalid build commit');
  info.commit = BUILD_COMMIT;
  if (BUILD_COMMIT_DATE) info.commitDate = date(BUILD_COMMIT_DATE);
}
info.builtAt = date(BUILD_CREATED_AT || Date.now());
info.changelog = Object.fromEntries(['ru', 'en'].map((language) =>
  [language, JSON.parse(fs.readFileSync(path.join(changelogDir, language + '.json'), 'utf8'))]));
fs.writeFileSync(metadataFile, JSON.stringify(info, null, 2) + '\n');
