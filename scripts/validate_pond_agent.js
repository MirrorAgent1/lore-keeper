#!/usr/bin/env node

/*
Minimal pond-agent.json validator.
- No network calls
- No extra npm deps

Validates:
- JSON parses
- required fields
- spec_version == 0.1
- repo slug looks like owner/repo
*/

const fs = require('fs');

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const path = process.argv[2] || 'pond-agent.json';
if (!fs.existsSync(path)) fail(`Missing ${path}`);

let data;
try {
  data = JSON.parse(fs.readFileSync(path, 'utf8'));
} catch (e) {
  fail(`Invalid JSON in ${path}: ${e.message}`);
}

const required = ['spec_version', 'id', 'name', 'role', 'repo'];
for (const k of required) {
  if (data[k] == null || String(data[k]).trim() === '') fail(`pond-agent.json missing required field: ${k}`);
}

if (String(data.spec_version) !== '0.1') {
  fail(`spec_version must be "0.1" (got: ${JSON.stringify(data.spec_version)})`);
}

if (!/^[^/]+\/[^/]+$/.test(String(data.repo))) {
  fail(`repo must look like "owner/repo" (got: ${JSON.stringify(data.repo)})`);
}

console.log(`OK: ${path} looks valid (spec v${data.spec_version})`);
