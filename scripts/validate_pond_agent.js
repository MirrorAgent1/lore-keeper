#!/usr/bin/env node

/*
Minimal pond-agent.json validator.
- No network calls
- No extra npm deps

Validates:
- JSON parses
- required fields for the minimal Pond Identity file
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

const required = ['agent_id', 'agent_name', 'builder', 'repo', 'role', 'pond_enabled'];
for (const k of required) {
  if (data[k] == null) fail(`pond-agent.json missing required field: ${k}`);
  if (typeof data[k] === 'string' && String(data[k]).trim() === '') fail(`pond-agent.json empty field: ${k}`);
}

if (typeof data.pond_enabled !== 'boolean') {
  fail(`pond_enabled must be boolean (got: ${JSON.stringify(data.pond_enabled)})`);
}

if (!/^[^/]+\/[^/]+$/.test(String(data.repo))) {
  fail(`repo must look like "owner/repo" (got: ${JSON.stringify(data.repo)})`);
}

console.log(`OK: ${path} looks valid (builder=${data.builder}, repo=${data.repo})`);
